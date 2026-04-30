import { authedJson } from "./authed-client";

export type CreateCheckoutSessionBody = {
  packageId: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type CheckoutSessionResponse = {
  url: string;
};

export async function createStripeCheckoutSession(
  accessToken: string,
  body: CreateCheckoutSessionBody,
): Promise<CheckoutSessionResponse> {
  return authedJson<CheckoutSessionResponse>(
    "/billing/stripe/checkout-session",
    accessToken,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export type SyncStripeCheckoutSessionBody = {
  sessionId: string;
};

export type SyncStripeCheckoutSessionResponse = {
  ok: boolean;
};

/** Confirms payment with Stripe API and writes the package to the company (fallback when webhooks are missing or slow). */
export async function syncStripeCheckoutSession(
  accessToken: string,
  body: SyncStripeCheckoutSessionBody,
): Promise<SyncStripeCheckoutSessionResponse> {
  return authedJson<SyncStripeCheckoutSessionResponse>(
    "/billing/stripe/sync-checkout-session",
    accessToken,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}
