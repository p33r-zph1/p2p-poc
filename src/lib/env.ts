function checkEnv(env: string | undefined, name: string) {
  if (!env) {
    throw new Error(
      `Please define the ${name} environment variable inside .env`
    );
  }

  return env;
}

export function getTransactionsAPIRoute() {
  const value = process.env.NEXT_PUBLIC_API_ROUTE_TRANSACTIONS;
  return checkEnv(value, 'NEXT_PUBLIC_API_ROUTE_TRANSACTIONS');
}

export function getOnboardingAPIRoute() {
  const value = process.env.NEXT_PUBLIC_API_ROUTE_ONBOARDING;
  return checkEnv(value, 'NEXT_PUBLIC_API_ROUTE_ONBOARDING');
}

export function getBuildENV() {
  const value = process.env.NEXT_PUBLIC_BUILD_ENV;
  return checkEnv(value, 'NEXT_PUBLIC_BUILD_ENV');
}
