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

// GET - sources to scan for ideas + target industries
export async function GET() {
  // Industries with active PE rollup activity - these are fragmented,
  // have proven demand, and offer natural exit paths
  const targetIndustries = [
    {
      id: "home-services",
      name: "Home Services",
      examples: ["HVAC", "Plumbing", "Electrical", "Roofing", "Landscaping", "Pool Service"],
      multiples: "5-8x EBITDA",
      consolidators: ["Wrench Group", "Apex Service Partners", "Neighborly"],
      barriers: "Licensing, trucks, talent",
      fragmentation: "Very high - 90%+ local operators",
    },
    {
      id: "car-wash",
      name: "Car Wash",
      examples: ["Express tunnel", "Full-service", "Self-serve"],
      multiples: "6-10x EBITDA",
      consolidators: ["Mister Car Wash", "Driven Brands", "Mammoth Holdings"],
      barriers: "Real estate, permitting",
      fragmentation: "High - 70% single-site operators",
    },
    {
      id: "pest-control",
      name: "Pest Control",
      examples: ["Residential", "Commercial", "Wildlife removal"],
      multiples: "8-12x EBITDA (recurring revenue premium)",
      consolidators: ["Rollins", "Anticimex", "Rentokil"],
      barriers: "Licensing, routes",
      fragmentation: "High - family-owned dominates",
    },
    {
      id: "med-spa",
      name: "Med Spa / Aesthetics",
      examples: ["Botox", "Laser", "IV therapy"],
      multiples: "4-7x EBITDA",
      consolidators: ["Skin Spirit", "LaserAway", "Ideal Image"],
      barriers: "Medical director required",
      fragmentation: "Very high - mostly single-location",
    },
    {
      id: "auto-services",
      name: "Auto Services",
      examples: ["Auto body", "Oil change", "Tire shops", "Detailing"],
      multiples: "4-6x EBITDA",
      consolidators: ["Caliber Collision", "Driven Brands", "Valvoline"],
      barriers: "Equipment, certifications",
      fragmentation: "High - independent shops",
    },
    {
      id: "fitness",
      name: "Fitness / Studios",
      examples: ["Boutique fitness", "Personal training", "Yoga/Pilates"],
      multiples: "3-5x EBITDA",
      consolidators: ["Xponential Fitness", "Honors Holdings"],
      barriers: "Real estate, brand",
      fragmentation: "High - independent studios",
    },
    {
      id: "senior-care",
      name: "Senior Care / Home Health",
      examples: ["Non-medical home care", "Senior transport", "Companion care"],
      multiples: "5-8x EBITDA",
      consolidators: ["BrightSpring", "LHC Group", "Addus"],
      barriers: "Licensing, caregivers",
      fragmentation: "Very high - aging population tailwind",
    },
    {
      id: "pet-services",
      name: "Pet Services",
      examples: ["Grooming", "Boarding", "Daycare", "Mobile vet"],
      multiples: "4-6x EBITDA",
      consolidators: ["NVA", "Mars Petcare", "Destination Pet"],
      barriers: "Real estate, trust",
      fragmentation: "High - local operators",
    },
  ];

  const sources = [
    {
      id: "reddit-sweatystartup",
      name: "r/sweatystartup",
      type: "reddit",
      url: "https://reddit.com/r/sweatystartup",
      description: "Boots-on-ground operators sharing what works",
    },
    {
      id: "reddit-entrepreneur",
      name: "r/Entrepreneur",
      type: "reddit",
      url: "https://reddit.com/r/Entrepreneur",
      description: "General startup and SMB discussion",
    },
    {
      id: "reddit-smallbusiness",
      name: "r/smallbusiness",
      type: "reddit",
      url: "https://reddit.com/r/smallbusiness",
      description: "SMB operators sharing wins and pain points",
    },
    {
      id: "searchfunder",
      name: "SearchFunder",
      type: "forum",
      url: "https://searchfunder.com",
      description: "Search fund community - see what industries they target",
    },
    {
      id: "twitter-operators",
      name: "Operator Twitter",
      type: "twitter",
      hashtags: ["#SMB", "#smallbusiness", "#entrepreneurship"],
      description: "Operators sharing real numbers and lessons",
    },
    {
      id: "bizbuysell",
      name: "BizBuySell",
      type: "marketplace",
      url: "https://bizbuysell.com",
      description: "See what's selling and at what multiples",
    },
  ];

  return NextResponse.json({
    targetIndustries,
    sources,
    scoringCriteria: {
      note: "Ideas should be OPERATOR businesses, not services to PE",
      ideal: [
        "Fragmented industry with PE rollups active",
        "Can start with <$100K capital",
        "Path to $1M+ EBITDA in 3-5 years",
        "Natural exit to PE platform at 5-8x",
        "Recurring revenue or repeat customers",
        "Doesn't require credentials Andrew lacks",
      ],
    },
  });
}
