"use server"

import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { PDFDocument, rgb } from 'pdf-lib'
import * as XLSX from "xlsx"
import fontkit from '@pdf-lib/fontkit'
import { prisma } from './prisma'

// Cache for participants data
let participantsCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getParticipants(): Promise<any[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (participantsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("Using cached participants data");
    return participantsCache;
  }
  
  // Load fresh data
  console.log("Loading participants from Excel");
  const filePath = path.resolve(process.cwd(), "data", "ICPC intited teams.xlsx");
  const fileBuffer = await fs.readFile(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  participantsCache = XLSX.utils.sheet_to_json(sheet);
  cacheTimestamp = now;
  
  return participantsCache;
}

const formSchema = z.object({
  username: z.string().min(1, "Full name is required"),
  teamName: z.string().min(1, "Team name is required"),
})

type ActionResponse = {
  success: boolean
  message?: string
  data?: string
}

export async function verifyAndGenerateCertificate(data: {
  username: string;
  teamName: string;
}): Promise<ActionResponse> {
  try {
    console.log("Verifying participant:", data);

    // Remove redundant file access checks - only check once
    const templatePath = path.resolve(process.cwd(), "public", "invite.pdf");
    const fontPath = path.resolve(process.cwd(), 'public', 'fonts', 'Acumin-BdPro.otf');

    // Verify participant using cached data
    const participantData = await verifyParticipant(
      data.username,
      data.teamName
    );
    
    if (!participantData) {
      return {
        success: false,
        message: "Participant details not found in registered participants list"
      };
    }

    // Read and modify PDF
    const [templateBytes, fontBytes] = await Promise.all([
      fs.readFile(templatePath),
      fs.readFile(fontPath)
    ]);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const font = await pdfDoc.embedFont(fontBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    
    // Format team name (ALL UPPERCASE)
    const formatName = (teamName: string) => {
      return teamName
        .trim()
        .split(' ')
        .map(word => word.toUpperCase())
        .join(' ');
    };
    
    // Format college name (Title Case)
    const formatCollegeName = (collegeName: string) => {
      return collegeName
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Get college name from Excel data
    const formattedCollegeName = formatCollegeName(participantData.collegeName || '');
    const formattedteamName = formatName(data.teamName);
    
    // Dynamic font size calculation for team name
    const maxNameWidth = width * 0.7;
    let nameFontSize = 40;
    let nameWidth = font.widthOfTextAtSize(formattedteamName, nameFontSize);
    
    while (nameWidth > maxNameWidth && nameFontSize > 20) {
      nameFontSize -= 1;
      nameWidth = font.widthOfTextAtSize(formattedteamName, nameFontSize);
    }
    
    // Dynamic font size calculation for college name
    const maxCollegeNameWidth = width * 0.7;
    let collegeNameFontSize = 20;
    let collegeNameWidth = font.widthOfTextAtSize(formattedCollegeName, collegeNameFontSize);
    
    while (collegeNameWidth > maxCollegeNameWidth && collegeNameFontSize > 20) {
      collegeNameFontSize -= 1;
      collegeNameWidth = font.widthOfTextAtSize(formattedCollegeName, collegeNameFontSize);
    }
    
    const nameConfig = {
      text: formattedteamName,
      fontSize: nameFontSize,
      y: height * 0.68,
      xOffset: -25
    };
    
    const collegeNameConfig = {
      text: formattedCollegeName,
      fontSize: collegeNameFontSize,
      y: height * 0.65, // Below the team name
      xOffset: 0
    };

    const drawCenteredText = (config: { text: string, fontSize: number, y: number, xOffset?: number }) => {
      const textWidth = font.widthOfTextAtSize(config.text, config.fontSize);
      const x = (width - textWidth) / 2 + (config.xOffset || 0);
      
      page.drawText(config.text, {
        x,
        y: config.y,
        size: config.fontSize,
        font,
        color: rgb(0.93, 0.90, 0.82)
      });
    };

    drawCenteredText(nameConfig);
    drawCenteredText(collegeNameConfig);

    const modifiedPdfBytes = await pdfDoc.save();
    const base64PDF = Buffer.from(modifiedPdfBytes).toString('base64');

    return {
      success: true,
      message: "Certificate generated successfully",
      data: base64PDF
    };

  } catch (error) {
    console.error("Certificate generation error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate certificate"
    };
  }
}

// Returns participant data if found, null otherwise
async function verifyParticipant(username: string, teamName: string): Promise<any | null> {
  try {
    const participants = await getParticipants();
    
    const normalizeUserName = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizeTeamName = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    
    const found = participants.find((p: any) => {
      const matchUserName = normalizeUserName(p.username?.toString() || '') === normalizeUserName(username);
      const matchTeamName = normalizeTeamName(p.teamName?.toString() || '') === normalizeTeamName(teamName);
      
      const isMatch = matchUserName && matchTeamName;
      
      // Log matching attempts for debugging
      if (matchUserName && !matchTeamName) {
        console.log("⚠️ Name match but team name doesn't:", {
          excelTeamName: p.teamName,
          inputTeamName: teamName
        });
      }
      
      if (isMatch) {
        console.log("✅ Participant verified:", { 
          username: p.username, 
          teamName: p.teamName,
          collegeName: p.collegeName 
        });
      }
      
      return isMatch;
    });

    if (!found) {
      console.log("❌ No matching participant found for:", { username, teamName });
      return null;
    }

    return found;
  } catch (error) {
    console.error("Error verifying participant:", error);
    return null;
  }
}