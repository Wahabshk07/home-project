/**
 * Browser: serialize outbound HTTP to the API and enforce a short pause between
 * back-to-back calls. Server/SSR: no throttling (direct fetch).
 */
const BROWSER_MIN_GAP_MS = 200;

let afterPrevious = Promise.resolve();

export function spacingFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  if (typeof window === "undefined") {
    return fetch(input, init);
  }
  return runAfterBrowserSpacing(() => fetch(input, init));
}

export function runAfterBrowserSpacing<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof window === "undefined") {
    return fn();
  }
  const run = afterPrevious.then(() => fn());
  afterPrevious = run
    .catch(() => {
      /* do not let failures block the queue */
    })
    .then(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, BROWSER_MIN_GAP_MS);
        }),
    );
  return run;
}
