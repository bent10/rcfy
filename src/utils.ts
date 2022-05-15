import { promises as fsp, accessSync, constants } from 'node:fs'

/**
 * Returns `true` if the accessibility check is successful.
 */
export async function isExists(filepath: string): Promise<boolean> {
  try {
    await fsp.access(filepath, constants.R_OK)

    return true
  } catch {
    return false
  }
}

/**
 * Returns `true` if the sync accessibility check is successful.
 */
export function isExistsSync(filepath: string): boolean {
  try {
    accessSync(filepath, constants.R_OK)

    return true
  } catch {
    return false
  }
}
