function checkEnv(env: string | undefined, name: string) {
  if (!env) {
    throw new Error(
      `Please define the ${name} environment variable inside .env`
    );
  }

  return env;
}

export function getAPIRoute() {
  const value = process.env.NEXT_PUBLIC_API_ROUTE;
  return checkEnv(value, 'NEXT_PUBLIC_API_ROUTE');
}
