import Stripe from "stripe";
import { getEnv, getOptionalEnv, isPlaceholder } from "@/lib/env";

export const STRIPE_EXPECTED_PRODUCT_PRO = "prod_TxJIELH1qRihyq";
export const STRIPE_EXPECTED_PRICE_PRO = "price_1SzOg2Fs5YLnaPiWrFezCPyh";

export const STRIPE_REQUIRED_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "invoice.payment_succeeded",
  "invoice.paid",
] as const;

export function getStripeServerClient() {
  return new Stripe(getEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2026-01-28.clover",
  });
}

export function getStripeProPlanConfig() {
  const productId =
    getOptionalEnv("STRIPE_PRODUCT_PRO") || STRIPE_EXPECTED_PRODUCT_PRO;
  const priceId = getOptionalEnv("STRIPE_PRICE_PRO") || STRIPE_EXPECTED_PRICE_PRO;

  return {
    productId,
    priceId,
    productIdMatchesExpected: productId === STRIPE_EXPECTED_PRODUCT_PRO,
    priceIdMatchesExpected: priceId === STRIPE_EXPECTED_PRICE_PRO,
  };
}

export function getStripeEnvVerification() {
  const secretKey = getOptionalEnv("STRIPE_SECRET_KEY");
  const webhookSecret = getOptionalEnv("STRIPE_WEBHOOK_SECRET");
  const configuredProductId = getOptionalEnv("STRIPE_PRODUCT_PRO");
  const configuredPriceId = getOptionalEnv("STRIPE_PRICE_PRO");
  const appUrl = getOptionalEnv("NEXT_PUBLIC_APP_URL");

  const required = {
    STRIPE_SECRET_KEY: Boolean(secretKey && !isPlaceholder(secretKey)),
    STRIPE_WEBHOOK_SECRET: Boolean(webhookSecret && !isPlaceholder(webhookSecret)),
    STRIPE_PRICE_PRO: Boolean(configuredPriceId && !isPlaceholder(configuredPriceId)),
    NEXT_PUBLIC_APP_URL: Boolean(appUrl && !isPlaceholder(appUrl)),
  };

  const placeholders = {
    STRIPE_SECRET_KEY: isPlaceholder(secretKey),
    STRIPE_WEBHOOK_SECRET: isPlaceholder(webhookSecret),
    STRIPE_PRODUCT_PRO: isPlaceholder(configuredProductId),
    STRIPE_PRICE_PRO: isPlaceholder(configuredPriceId),
    NEXT_PUBLIC_APP_URL: isPlaceholder(appUrl),
  };

  const proPlan = getStripeProPlanConfig();
  const ready = Object.values(required).every(Boolean);

  return {
    ready,
    required,
    placeholders,
    configured: {
      productId:
        configuredProductId || `(fallback:${STRIPE_EXPECTED_PRODUCT_PRO})`,
      priceId: configuredPriceId || `(fallback:${STRIPE_EXPECTED_PRICE_PRO})`,
    },
    expected: {
      productId: STRIPE_EXPECTED_PRODUCT_PRO,
      priceId: STRIPE_EXPECTED_PRICE_PRO,
    },
    matchesExpected: {
      productId: proPlan.productIdMatchesExpected,
      priceId: proPlan.priceIdMatchesExpected,
    },
    webhook: {
      endpoint: "/api/stripe/webhook",
      events: [...STRIPE_REQUIRED_WEBHOOK_EVENTS],
    },
  };
}
