import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface DiscoveredIdea {
  name: string;
  oneLiner: string;
  category: string;
  source: string;
  whyNow: string;
  scores: {
    competition?: number;
    personalFit?: number;
    scalability?: number;
    exitMultiple?: number;
    ownerFreedom?: number;
    defensibility?: number;
    marginCeiling?: number;
    timeToRevenue?: number;
    barrierToEntry?: number;
    demandEvidence?: number;
    capitalEfficiency?: number;
  };
}

// POST - add discovered ideas (from agent research)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideas, source: batchSource } = body as {
      ideas: DiscoveredIdea[];
      source?: string;
    };
    
    if (!ideas || !Array.isArray(ideas)) {
      return NextResponse.json(
        { error: "Ideas array required" },
        { status: 400 }
      );
    }
    
    const results = {
      created: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };
    
    for (const idea of ideas) {
      try {
        // Check for duplicates (by name similarity)
        const existing = await prisma.businessIdea.findFirst({
          where: {
            name: {
              contains: idea.name.split(" ").slice(0, 3).join(" "),
              mode: "insensitive",
            },
          },
        });
        
        if (existing) {
          results.skipped.push(idea.name);
          continue;
        }
        
        // Create the idea
        await prisma.businessIdea.create({
          data: {
            name: idea.name,
            oneLiner: idea.oneLiner,
            category: idea.category || "other",
            source: batchSource
              ? `${batchSource}: ${idea.source}`
              : idea.source,
            whyNow: idea.whyNow,
            scores: idea.scores || {},
            status: "new",
            layer: 1,
          },
        });
        
        results.created.push(idea.name);
      } catch (err) {
        results.errors.push(`${idea.name}: ${String(err)}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      summary: {
        created: results.created.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
      details: results,
    });
  } catch (error) {
    console.error("Failed to add discovered ideas:", error);
    return NextResponse.json(
      { error: "Failed to add ideas" },
      { status: 500 }
    );
  }
}

// GET - sources to scan for ideas
export async function GET() {
  const sources = [
    {
      id: "reddit-sweatystartup",
      name: "r/sweatystartup",
      type: "reddit",
      url: "https://reddit.com/r/sweatystartup",
      description: "Small business ideas, validated by operators",
    },
    {
      id: "reddit-entrepreneur",
      name: "r/Entrepreneur",
      type: "reddit",
      url: "https://reddit.com/r/Entrepreneur",
      description: "General startup discussion",
    },
    {
      id: "reddit-smallbusiness",
      name: "r/smallbusiness",
      type: "reddit",
      url: "https://reddit.com/r/smallbusiness",
      description: "SMB operators sharing pain points",
    },
    {
      id: "indiehackers",
      name: "Indie Hackers",
      type: "forum",
      url: "https://indiehackers.com",
      description: "Bootstrapped SaaS and solo founders",
    },
    {
      id: "searchfunder",
      name: "SearchFunder",
      type: "forum",
      url: "https://searchfunder.com",
      description: "Search fund and acquisition entrepreneurs",
    },
    {
      id: "twitter-pe",
      name: "PE Twitter",
      type: "twitter",
      hashtags: ["#searchfund", "#SMB", "#acquisition"],
      description: "Private equity and SMB acquisition community",
    },
    {
      id: "axial",
      name: "Axial Network",
      type: "marketplace",
      url: "https://axial.net",
      description: "Lower middle market deal flow",
    },
  ];
  
  return NextResponse.json(sources);
}
