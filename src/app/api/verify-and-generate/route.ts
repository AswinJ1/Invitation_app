import { NextRequest, NextResponse } from "next/server"
import { verifyAndGenerateCertificate } from "@/lib/actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await verifyAndGenerateCertificate(body)

    // Return appropriate status codes
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 } // Bad Request for validation failures
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Server error" 
      },
      { status: 500 } // Internal Server Error
    )
  }
}