/**
 * entry-server.tsx
 * Server-side rendering entry point using React 18's renderToPipeableStream.
 * Called by the Express server to render the React app to HTML for every request.
 * The client then hydrates this HTML using hydrateRoot (entry-client.tsx).
 *
 * Key SSR compatibility fix:
 * wouter's memoryLocation uses useSyncExternalStore without getServerSnapshot,
 * which crashes React 18 SSR. We provide a custom SSR-safe location hook that
 * passes the server snapshot (the static URL) as the 3rd argument.
 */
import { renderToPipeableStream } from "react-dom/server";
import { useSyncExternalStore } from "react";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Writable } from "stream";
import App from "./App";

/**
 * Creates an SSR-safe wouter location hook for a given URL path.
 * Unlike wouter's memoryLocation, this passes getServerSnapshot as the 3rd
 * argument to useSyncExternalStore, which React 18 SSR requires.
 */
function makeSSRLocationHook(urlPath: string) {
  // Static — no navigation possible during SSR
  const subscribe = (_cb: () => void) => () => {};
  const getSnapshot = () => urlPath;
  const getServerSnapshot = () => urlPath; // Required by React 18 SSR

  return function useSSRLocation(): [string, (to: string) => void] {
    const path = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const navigate = (_to: string) => {}; // no-op during SSR
    return [path, navigate];
  };
}

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Strip query string for routing
    const urlPath = url.split("?")[0] || "/";

    // SSR-safe wouter location hook
    const hook = makeSSRLocationHook(urlPath);

    // Create a fresh QueryClient per request to avoid shared state between requests
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
      },
    });

    // Create a tRPC client that points to the local server
    const trpcClient = trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
          transformer: superjson,
        }),
      ],
    });

    let didError = false;

    const { pipe } = renderToPipeableStream(
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Router hook={hook}>
            <App />
          </Router>
        </QueryClientProvider>
      </trpc.Provider>,
      {
        onShellReady() {
          const chunks: Buffer[] = [];
          const writable = new Writable({
            write(chunk: Buffer, _encoding: string, callback: () => void) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
              callback();
            },
            final(callback: () => void) {
              resolve(Buffer.concat(chunks).toString("utf-8"));
              callback();
            },
          });
          writable.on("error", reject);
          pipe(writable);
        },
        onShellError(error: unknown) {
          didError = true;
          reject(error);
        },
        onError(error: unknown) {
          didError = true;
          console.error("[SSR] render error:", error);
        },
      }
    );

    void didError; // suppress unused warning — used in onShellError
  });
}
