"use server"

import fs from "fs"
import path from "path"

/**
 * Utility function to check if a file exists and log detailed information
 * about the file system for debugging purposes
 */
export async function checkFileExists(filePath: string): Promise<{
  exists: boolean
  details: {
    filePath: string
    cwd: string
    publicFiles?: string[]
    error?: string
  }
}> {
  try {
    const exists = fs.existsSync(filePath)
    const publicDir = path.join(process.cwd(), "public")
    let publicFiles: string[] = []

    try {
      if (fs.existsSync(publicDir)) {
        publicFiles = fs.readdirSync(publicDir)
      }
    } catch (error) {
      console.error("Error reading public directory:", error)
    }

    return {
      exists,
      details: {
        filePath,
        cwd: process.cwd(),
        publicFiles,
      },
    }
  } catch (error) {
    return {
      exists: false,
      details: {
        filePath,
        cwd: process.cwd(),
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

/**
 * Utility function to create the data directory if it doesn't exist
 */
export async function ensureDataDirectory(): Promise<{
  success: boolean
  path?: string
  error?: string
}> {
  try {
    const dataDir = path.join(process.cwd(), "data")

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    return {
      success: true,
      path: dataDir,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
