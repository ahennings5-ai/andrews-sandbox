import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Initial prospect data (would be updated by weekly sync/scraping)
const INITIAL_PROSPECTS_2026 = [
  { name: "Ashton Jeanty", position: "RB", college: "Boise State", consensus: 1, notes: "Generational RB prospect. Elite production, vision, and contact balance." },
  { name: "Travis Hunter", position: "WR", college: "Colorado", consensus: 2, notes: "Two-way star. Elite route running and ball skills. Heisman winner." },
  { name: "Tetairoa McMillan", position: "WR", college: "Arizona", consensus: 3, notes: "6'5\" with elite contested catch ability. Alpha WR profile." },
  { name: "Luther Burden III", position: "WR", college: "Missouri", consensus: 4, notes: "Dynamic playmaker. Excellent after the catch." },
  { name: "Cam Ward", position: "QB", college: "Miami", consensus: 5, notes: "Big arm, mobility. High ceiling SF asset." },
  { name: "Shedeur Sanders", position: "QB", college: "Colorado", consensus: 6, notes: "Accurate, poised. NFL-ready processor." },
  { name: "Emeka Egbuka", position: "WR", college: "Ohio State", consensus: 7, notes: "Polished route runner. Reliable target." },
  { name: "Quinshon Judkins", position: "RB", college: "Ohio State", consensus: 8, notes: "Power back with good vision. Solid floor." },
  { name: "Nic Scourton", position: "EDGE", college: "Texas A&M", consensus: 9, notes: "Not fantasy relevant in most formats." },
  { name: "Kaleb Johnson", position: "RB", college: "Iowa", consensus: 10, notes: "Explosive runner. Breakaway speed." },
  { name: "Omarion Hampton", position: "RB", college: "UNC", consensus: 11, notes: "Well-rounded back. Good pass catcher." },
  { name: "Isaiah Bond", position: "WR", college: "Texas", consensus: 12, notes: "Speed demon. Big play ability." },
  { name: "Tre Harris", position: "WR", college: "Ole Miss", consensus: 13, notes: "Contested catch specialist. Physical." },
  { name: "Nick Singleton", position: "RB", college: "Penn State", consensus: 14, notes: "Explosive runner, improving pass game." },
  { name: "Jaylin Noel", position: "WR", college: "Iowa State", consensus: 15, notes: "Reliable slot. Good hands." },
  { name: "Tahj Brooks", position: "RB", college: "Texas Tech", consensus: 16, notes: "Productive workhorse. NFL size." },
  { name: "Evan Stewart", position: "WR", college: "Oregon", consensus: 17, notes: "Deep threat. Developing route tree." },
  { name: "Mason Taylor", position: "TE", college: "LSU", consensus: 18, notes: "Athletic TE. Good bloodlines (dad was NFL TE)." },
  { name: "Harold Fannin Jr", position: "TE", college: "Bowling Green", consensus: 19, notes: "Elite production. Questions about competition level." },
  { name: "Jayden Higgins", position: "WR", college: "Iowa State", consensus: 20, notes: "Big body receiver. Red zone threat." },
  { name: "Kyren Lacy", position: "WR", college: "LSU", consensus: 21, notes: "Physical receiver. YAC ability." },
  { name: "Dont'e Thornton Jr", position: "WR", college: "Tennessee", consensus: 22, notes: "Deep threat. Track speed." },
  { name: "Kevin Concepcion", position: "WR", college: "NC State", consensus: 23, notes: "Versatile playmaker." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 24, notes: "Quick, shifty. Change of pace back." },
  { name: "Jalen Royals", position: "WR", college: "Utah State", consensus: 25, notes: "Production monster. Small school." },
  { name: "Tyler Warren", position: "TE", college: "Penn State", consensus: 26, notes: "Swiss army knife. Used everywhere." },
  { name: "Colston Loveland", position: "TE", college: "Michigan", consensus: 27, notes: "Solid all-around TE prospect." },
  { name: "Devin Neal", position: "RB", college: "Kansas", consensus: 28, notes: "Productive. Solid floor." },
  { name: "RJ Harvey", position: "RB", college: "UCF", consensus: 29, notes: "Electric runner. Home run hitter." },
  { name: "Le'Veon Moss", position: "RB", college: "Texas A&M", consensus: 30, notes: "Physical runner. Between the tackles." },
];

const INITIAL_PROSPECTS_2027 = [
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "Potential generational WR. Elite freshman season." },
  { name: "Quinn Ewers", position: "QB", college: "Texas", consensus: 2, notes: "If he returns - top SF asset." },
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 3, notes: "The name. Massive upside if he develops." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 4, notes: "Five-star recruit. Big arm." },
  { name: "TreVeyon Henderson", position: "RB", college: "Ohio State", consensus: 5, notes: "If he returns - explosive talent." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 6, notes: "Talented sophomore WR." },
  { name: "Ryan Williams", position: "WR", college: "Alabama", consensus: 7, notes: "True freshman starter. Electric." },
  { name: "Dallas Wilson", position: "QB", college: "UCF", consensus: 8, notes: "Rising prospect. Mobile passer." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 9, notes: "Physical runner. Late breakout." },
  { name: "Bhayshul Tuten", position: "RB", college: "Virginia Tech", consensus: 10, notes: "Productive. NFL-ready size." },
  { name: "Kyion Grayes", position: "WR", college: "Ohio State", consensus: 11, notes: "Speed receiver. Developing." },
  { name: "Trey Maxie", position: "TE", college: "LSU", consensus: 12, notes: "Athletic TE prospect." },
  { name: "Zachariah Branch", position: "WR", college: "USC", consensus: 13, notes: "Return specialist. Big play threat." },
  { name: "Jacorey Brooks", position: "WR", college: "Louisville", consensus: 14, notes: "Former Alabama WR. Physical." },
  { name: "De'Zhaun Stribling", position: "WR", college: "Oklahoma State", consensus: 15, notes: "Productive in Big 12." },
  { name: "Anthony Hankerson", position: "RB", college: "Georgia Tech", consensus: 16, notes: "Breakout candidate." },
  { name: "Nate Frazier", position: "RB", college: "Georgia", consensus: 17, notes: "Talented back on loaded team." },
  { name: "Daniel Barker", position: "WR", college: "Arkansas", consensus: 18, notes: "Big body. Red zone target." },
  { name: "Stacy Gage", position: "RB", college: "Texas A&M", consensus: 19, notes: "Powerful runner." },
  { name: "Rico Flores Jr", position: "WR", college: "Notre Dame", consensus: 20, notes: "Reliable possession receiver." },
  { name: "Jacory Croskey-Merritt", position: "RB", college: "Arizona", consensus: 21, notes: "Transfer. Fresh start." },
  { name: "CJ Daniels", position: "WR", college: "LSU", consensus: 22, notes: "Former Liberty standout." },
  { name: "Peyton O'Brien", position: "TE", college: "Penn State", consensus: 23, notes: "Developing prospect." },
  { name: "Jalen Milroe", position: "QB", college: "Alabama", consensus: 24, notes: "If he returns - athletic QB." },
  { name: "Sawyer Robertson", position: "QB", college: "Texas Tech", consensus: 25, notes: "Gunslinger. Big arm." },
  { name: "Alijah Huzzie", position: "WR", college: "NC State", consensus: 26, notes: "Productive slot." },
  { name: "Jordan Faison", position: "WR", college: "UCF", consensus: 27, notes: "Speed receiver." },
  { name: "DJ Giddens", position: "RB", college: "Kansas State", consensus: 28, notes: "Explosive. Big play ability." },
  { name: "Josey Jewell", position: "RB", college: "Oregon State", consensus: 29, notes: "Workhorse profile." },
  { name: "AJ Harris", position: "WR", college: "Alabama", consensus: 30, notes: "True freshman. High ceiling." },
];

// GET prospects by draft class
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const draftClass = searchParams.get("class") || "2026";
  const position = searchParams.get("position");

  try {
    // Check if we have prospects in DB
    let prospects = await prisma.dynastyProspect.findMany({
      where: {
        draftClass,
        ...(position ? { position } : {}),
      },
      orderBy: { drewRank: "asc" },
    });

    // If empty, seed with initial data
    if (prospects.length === 0) {
      const initialData = draftClass === "2027" ? INITIAL_PROSPECTS_2027 : INITIAL_PROSPECTS_2026;
      
      // Get settings for team needs
      const settings = await prisma.dynastySettings.findFirst();
      const mode = settings?.mode || "tank";
      
      // Calculate Drew scores
      const prospectsWithScores = initialData
        .filter(p => ["QB", "RB", "WR", "TE"].includes(p.position))
        .map((p, idx) => {
          // Base score from consensus (inverse)
          let drewScore = 100 - (p.consensus - 1) * 2;
          
          // SF premium for QBs
          if (p.position === "QB") drewScore += 15;
          
          // PPR premium for pass catchers
          if (p.position === "WR" || p.position === "TE") drewScore += 5;
          
          return {
            name: p.name,
            position: p.position,
            college: p.college,
            draftClass,
            consensus: p.consensus,
            drewRank: idx + 1,
            drewScore,
            notes: p.notes,
          };
        })
        .sort((a, b) => b.drewScore - a.drewScore)
        .map((p, idx) => ({ ...p, drewRank: idx + 1 }));

      // Insert
      await prisma.dynastyProspect.createMany({
        data: prospectsWithScores,
        skipDuplicates: true,
      });

      prospects = await prisma.dynastyProspect.findMany({
        where: {
          draftClass,
          ...(position ? { position } : {}),
        },
        orderBy: { drewRank: "asc" },
      });
    }

    return NextResponse.json({ prospects, draftClass });
  } catch (error) {
    console.error("Failed to fetch prospects:", error);
    return NextResponse.json({ error: "Failed to fetch prospects" }, { status: 500 });
  }
}
