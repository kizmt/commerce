"use client";

export default function Error({ 
  error,
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error for debugging
  if (typeof window !== "undefined") {
    console.error("Error boundary caught:", error);
  }

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      {isDev && (
        <details className="my-4 rounded-md bg-red-50 p-4 text-sm dark:bg-red-900/20">
          <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-200">
            Error Details (dev only)
          </summary>
          <pre className="mt-2 overflow-auto text-xs text-red-700 dark:text-red-300">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
