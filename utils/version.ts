// Version utility for automatic version management
import packageJson from '../package.json';

export interface VersionInfo {
  version: string;
  buildDate: string;
  buildTime: string;
  platform: string;
  commitHash?: string;
  environment: string;
}

export const getVersionInfo = (): VersionInfo => {
  const now = new Date();

  return {
    version: packageJson.version,
    buildDate: now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    buildTime: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    platform: 'Web App',
    environment: process.env.NODE_ENV || 'development',
  };
};

export const getFormattedVersion = (): string => {
  const info = getVersionInfo();
  return `v${info.version}`;
};

export const getFormattedBuildInfo = (): string => {
  const info = getVersionInfo();
  return `${info.buildDate} ${info.buildTime}`;
};

export const getFullVersionString = (): string => {
  const info = getVersionInfo();
  return `v${info.version} (${info.buildDate} ${info.buildTime}) - ${info.environment}`;
};

// Version comparison utilities
export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;

    if (v1 > v2) return 1;
    if (v1 < v2) return -1;
  }

  return 0;
};

export const isNewerVersion = (
  newVersion: string,
  currentVersion: string
): boolean => {
  return compareVersions(newVersion, currentVersion) > 0;
};
