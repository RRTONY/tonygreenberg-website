import type { ReactNode } from "react";

declare global {
  type AppRouteParamNames<Path extends string> =
    Path extends `${string}[[...${infer Parameter}]]${infer Rest}`
      ? Parameter | AppRouteParamNames<Rest>
      : Path extends `${string}[...${infer Parameter}]${infer Rest}`
        ? Parameter | AppRouteParamNames<Rest>
        : Path extends `${string}[${infer Parameter}]${infer Rest}`
          ? Parameter | AppRouteParamNames<Rest>
          : never;

  type AppRouteParams<Path extends string> = [AppRouteParamNames<Path>] extends [never]
    ? Record<string, never>
    : { [Parameter in AppRouteParamNames<Path>]: string };

  type AppPageProps<AppRoute extends string> = {
    params: Promise<AppRouteParams<AppRoute>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  };

  type AppLayoutProps<AppRoute extends string> = {
    params: Promise<AppRouteParams<AppRoute>>;
    children: ReactNode;
  };
}

export {};
