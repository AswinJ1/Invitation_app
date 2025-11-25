import { checkFileExists, ensureDataDirectory } from "@/lib/debug-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import path from "path"

export default async function DebugPage() {
  const templatePath = path.join(process.cwd(), "public", "certificate_template.png")
  const fileCheck = await checkFileExists(templatePath)
  const dataDir = await ensureDataDirectory()

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Debug Information</h1>
          <p className="text-muted-foreground">Troubleshooting the certificate generator</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Template</CardTitle>
            <CardDescription>Check if the certificate template file exists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Template Path:</h3>
                <p className="text-sm font-mono bg-muted p-2 rounded">{fileCheck.details.filePath}</p>
              </div>

              <div>
                <h3 className="font-medium">File Exists:</h3>
                <p className={`text-sm font-medium ${fileCheck.exists ? "text-green-600" : "text-red-600"}`}>
                  {fileCheck.exists ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="font-medium">Current Working Directory:</h3>
                <p className="text-sm font-mono bg-muted p-2 rounded">{fileCheck.details.cwd}</p>
              </div>

              <div>
                <h3 className="font-medium">Files in Public Directory:</h3>
                {fileCheck.details.publicFiles && fileCheck.details.publicFiles.length > 0 ? (
                  <ul className="text-sm font-mono bg-muted p-2 rounded">
                    {fileCheck.details.publicFiles.map((file, index) => (
                      <li key={index}>{file}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-600">No files found or unable to read directory</p>
                )}
              </div>

              {fileCheck.details.error && (
                <div>
                  <h3 className="font-medium">Error:</h3>
                  <p className="text-sm text-red-600 font-mono bg-muted p-2 rounded">{fileCheck.details.error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Directory</CardTitle>
            <CardDescription>Check if the data directory exists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Status:</h3>
                <p className={`text-sm font-medium ${dataDir.success ? "text-green-600" : "text-red-600"}`}>
                  {dataDir.success ? "Directory exists or was created" : "Failed to create directory"}
                </p>
              </div>

              {dataDir.path && (
                <div>
                  <h3 className="font-medium">Path:</h3>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{dataDir.path}</p>
                </div>
              )}

              {dataDir.error && (
                <div>
                  <h3 className="font-medium">Error:</h3>
                  <p className="text-sm text-red-600 font-mono bg-muted p-2 rounded">{dataDir.error}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This page helps diagnose file system issues with the certificate generator.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}