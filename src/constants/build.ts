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
  [BuildVariant.Development]: 'https://dev.poc.p33r.finance/',
  [BuildVariant.Staging]: 'https://poc.p33r.finance/',
  [BuildVariant.Release]: 'https://poc.p33r.finance/',
};

export function getAppDomainName({
  localhostAllowed = true,
}: GetDomainProps = {}) {
  if (process.env.NODE_ENV === 'development' && localhostAllowed) {
    return 'http://localhost:3000';
  }

  return appDomains[BUILD_ENV];
}

export function getPrintableEnvName() {
  if (BUILD_ENV === BuildVariant.Staging) return '';
  if (BUILD_ENV === BuildVariant.Release) return '';

  return ` | ${BUILD_ENV.toUpperCase()}`;
}
