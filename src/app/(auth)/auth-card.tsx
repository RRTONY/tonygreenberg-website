import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Shared frame for the account pages (sign in, sign up, reset).
export function AuthCard({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1 className="font-heading text-2xl">{title}</h1>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {footer && <div className="mt-6 flex flex-col gap-2 text-center text-sm text-muted-foreground">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
