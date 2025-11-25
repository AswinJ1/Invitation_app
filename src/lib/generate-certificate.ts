import { promises as fs } from "fs"
import path from "path"
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

type CertificateResult = {
  success: boolean
  message?: string
  data?: string
}

export async function generateCertificate(userData: { 
  name: string;
  email: string;
}): Promise<CertificateResult> {
  try {
    // Read template file
    const templatePath = path.join(process.cwd(), "templates", "certificate-template.pdf")
    const templateBytes = await fs.readFile(templatePath)

    const pdfDoc = await PDFDocument.load(templateBytes)
    const page = pdfDoc.getPages()[0]
    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    
    const { width, height } = page.getSize()
    
    // Calculate text dimensions and positioning
    const fontSize = 30
    const nameText = userData.name
    const nameWidth = font.widthOfTextAtSize(nameText, fontSize)

    // Center the name horizontally
    const nameX = (width - nameWidth) / 2

    // Position vertically - adjust these values based on your template
    const nameY = height / 2 + 30  // Adjust this value to position above the line

    // Draw the name
    page.drawText(nameText, {
      x: nameX,
      y: nameY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0)
    })

    const modifiedPdfBytes = await pdfDoc.save()
    const base64PDF = Buffer.from(modifiedPdfBytes).toString('base64')

    return {
      success: true,
      data: base64PDF
    }

  } catch (error) {
    console.error("Certificate generation error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate certificate"
    }
  }
}