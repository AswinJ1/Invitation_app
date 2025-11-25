"use server"

import fs from "fs"
import path from "path"

// This is a utility function to create a sample CSV file for testing
export async function createSampleParticipantsCSV() {
  const csvContent = `name,email,team,institution
John Doe,john.doe@example.com,Team Alpha,University A
Jane Smith,jane.smith@example.com,Team Beta,University B
Alex Johnson,alex.johnson@example.com,Team Gamma,University C
Sam Wilson,sam.wilson@example.com,Team Delta,University D
Taylor Brown,taylor.brown@example.com,Team Epsilon,University E
`

  const dataDir = path.join(process.cwd(), "data")
  const filePath = path.join(dataDir, "participants.csv")

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Write the CSV file
  fs.writeFileSync(filePath, csvContent, "utf8")

  return { success: true, path: filePath }
}
