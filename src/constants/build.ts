import { getBuildENV } from '@/lib/env';

export enum BuildVariant {
  Development = 'dev',
  Staging = 'staging',
  Release = 'prod',
}

export const BUILD_ENV = getBuildENV() as BuildVariant;

export const buildConfig = {
  isProduction: BUILD_ENV === BuildVariant.Release,
  iStaging: BUILD_ENV === BuildVariant.Staging,
  isDevelopment: BUILD_ENV === BuildVariant.Development,
  isProdOrStaging:
    BUILD_ENV === BuildVariant.Release || BUILD_ENV === BuildVariant.Staging,
};
