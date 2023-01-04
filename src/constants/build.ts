import { getBuildENV } from '@/lib/env';

export enum BuildVariant {
  Development = 'dev',
  Staging = 'staging',
  Release = 'prod',
}

type GetDomainProps = {
  localhostAllowed?: boolean;
};

export const BUILD_ENV = getBuildENV() as BuildVariant;

export const buildConfig = {
  isProduction: BUILD_ENV === BuildVariant.Release,
  iStaging: BUILD_ENV === BuildVariant.Staging,
  isDevelopment: BUILD_ENV === BuildVariant.Development,
  isProdOrStaging:
    BUILD_ENV === BuildVariant.Release || BUILD_ENV === BuildVariant.Staging,
};

export const appDomains = {
  [BuildVariant.Development]: 'https://develop.d3mj11jj9gi41w.amplifyapp.com/',
  [BuildVariant.Staging]: 'https://staging.d3mj11jj9gi41w.amplifyapp.com/',
  [BuildVariant.Release]: 'https://d3mj11jj9gi41w.amplifyapp.com/',
};

export function getAppDomainName({
  localhostAllowed = true,
}: GetDomainProps = {}) {
  if (process.env.NODE_ENV === 'development' && localhostAllowed) {
    return 'http://localhost:3000';
  }

  return appDomains[BUILD_ENV];
}
