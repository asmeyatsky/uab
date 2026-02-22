/**
 * ProtocolVersion Value Object
 * Semantic version representation for protocol specifications.
 */

export interface ProtocolVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly label?: string;
}

export function parseVersion(versionString: string): ProtocolVersion {
  const match = versionString.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?(?:-(.+))?$/);
  if (!match) {
    return { major: 0, minor: 0, patch: 0, label: versionString };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: match[3] ? parseInt(match[3], 10) : 0,
    label: match[4],
  };
}

export function formatVersion(version: ProtocolVersion): string {
  const base = `v${version.major}.${version.minor}.${version.patch}`;
  return version.label ? `${base}-${version.label}` : base;
}

export function isCompatible(required: ProtocolVersion, actual: ProtocolVersion): boolean {
  if (actual.major !== required.major) return false;
  if (actual.minor < required.minor) return false;
  return true;
}
