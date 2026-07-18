/**
 * Typed, validated access to environment variables.
 *
 * `NEXT_PUBLIC_` variables must be referenced statically (not via a computed
 * key) so Next.js can inline them into the browser bundle at build time.
 * Every consumer imports `env` from here — never read `process.env` directly.
 */

type Env = {
  apiBaseUrl: string;
};

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `[lib/env] Missing required environment variable: ${name}. See .env.example.`
    );
  }
  return value.trim();
}

export const env: Env = {
  apiBaseUrl: required(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL
  ),
};
