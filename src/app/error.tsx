"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Route } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * App Router error boundary. Receives the thrown `Error` and a `reset` to
 * retry rendering the failed segment. Shows where you were (route) and the
 * message, plus optional `?message=` for redirects or a digest from the server.
 */
function ErrorView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryMessage = searchParams.get("message");

  const fromError =
    error?.message && String(error.message).trim()
      ? String(error.message).trim()
      : null;
  const displayMessage =
    fromError || queryMessage || "Something went wrong. Please try again.";

  useEffect(() => {
    // Helpful in dev / production logging tools
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle
            className="size-7 text-destructive"
            aria-hidden
            strokeWidth={1.5}
          />
        </div>

        <h1 className="mt-6 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
          An error was caught while loading this part of the app. You can go
          home, go back, or try again. Details are below.
        </p>

        <div className="mt-6 space-y-3 rounded-lg border bg-muted/30 p-4 text-left text-sm">
          <div className="flex gap-2 text-muted-foreground">
            <Route className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Page / route
              </p>
              <p className="mt-0.5 break-all font-mono text-xs text-foreground sm:text-sm">
                {pathname || "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Error
            </p>
            <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md bg-background/80 p-3 font-mono text-xs text-foreground sm:text-sm">
              {displayMessage}
            </pre>
          </div>

          {error?.digest ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Reference:</span>{" "}
              <span className="font-mono">{error.digest}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col flex-wrap items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Button
            render={
              <Link href="/">
                <Home className="size-4 shrink-0" aria-hidden />
                Home
              </Link>
            }
            size="lg"
            className="gap-2"
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => reset()}
          >
            <RefreshCw className="size-4 shrink-0" aria-hidden />
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
          <p className="text-sm text-muted-foreground">
            Loading error details…
          </p>
        </main>
      }
    >
      <ErrorView error={error} reset={reset} />
    </Suspense>
  );
}
