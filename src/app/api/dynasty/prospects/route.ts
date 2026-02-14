import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// 2026 NFL Draft Prospects (April 2026) - ACCURATE as of Feb 2026
const INITIAL_PROSPECTS_2026 = [
  { name: "Fernando Mendoza", position: "QB", college: "Indiana", consensus: 1, notes: "UNANIMOUS QB1. 41 TD/6 INT. Pocket passer, quick-game specialist." },
  { name: "Jeremiyah Love", position: "RB", college: "Notre Dame", consensus: 2, notes: "UNANIMOUS RB1. 6.9 YPC, 18 TDs. Explosive game-breaker." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 3, notes: "WR1 in class. Elite route runner, 17.2 YPR." },
  { name: "Jordyn Tyson", position: "WR", college: "Arizona State", consensus: 4, notes: "Speed/size combo. 8 TDs in 9 games." },
  { name: "Makai Lemon", position: "WR", college: "USC", consensus: 5, notes: "Volume king. 79 catches, 1,156 yards, 11 TDs." },
  { name: "Kenyon Sadiq", position: "TE", college: "Oregon", consensus: 6, notes: "UNANIMOUS TE1. 8 TDs leads TEs." },
  { name: "Ty Simpson", position: "QB", college: "Alabama", consensus: 7, notes: "Dual-threat with strong arm. 28 TD/5 INT." },
  { name: "Denzel Boston", position: "WR", college: "Washington", consensus: 8, notes: "6'4\" red zone monster. 11 TDs in 11 games." },
  { name: "Trinidad Chambliss", position: "QB", college: "Ole Miss", consensus: 9, notes: "Russell Wilson comp. 6'0\" but electric playmaker." },
  { name: "Jadarian Price", position: "RB", college: "Notre Dame", consensus: 10, notes: "Versatile. 6.0 YPC, 11 TDs." },
  { name: "Nicholas Singleton", position: "RB", college: "Penn State", consensus: 11, notes: "Elite contact balance. Power runner." },
  { name: "KC Concepcion", position: "WR", college: "Texas A&M", consensus: 12, notes: "Slot specialist. 919 yards, 9 TDs." },
  { name: "Drew Allar", position: "QB", college: "Penn State", consensus: 13, notes: "Big arm, NFL size (6'5\" 238). Raw but talented." },
  { name: "Garrett Nussmeier", position: "QB", college: "LSU", consensus: 14, notes: "Gunslinger. LSU QB factory. 27 TDs." },
  { name: "Emmett Johnson", position: "RB", college: "Nebraska", consensus: 15, notes: "Power back with contact balance. Short-yardage specialist." },
  { name: "Jonah Coleman", position: "RB", college: "Washington", consensus: 16, notes: "Elite burst and speed. Home-run threat." },
  { name: "Demond Claiborne", position: "RB", college: "Wake Forest", consensus: 17, notes: "Versatile runner. 1,284 yards, 12 TDs." },
  { name: "Malachi Fields", position: "WR", college: "Virginia Tech", consensus: 18, notes: "Big slot (6'4\"). Red zone target." },
  { name: "Zachariah Branch", position: "WR", college: "USC", consensus: 19, notes: "Electric speed. Return specialist. Deep threat." },
  { name: "Joe Royer", position: "TE", college: "Cincinnati", consensus: 20, notes: "TE2. Reliable target. NFL-ready blocker." },
  { name: "Mitchell Evans", position: "TE", college: "Notre Dame", consensus: 21, notes: "Athletic with good hands. Y-TE mold." },
  { name: "Jaxon Lloyd", position: "TE", college: "Utah", consensus: 22, notes: "Complete TE. Good blocker and receiver." },
  { name: "Savion Williams", position: "WR", college: "TCU", consensus: 23, notes: "Big body receiver. Physical at catch point." },
  { name: "Kevin Coleman", position: "WR", college: "Arizona", consensus: 24, notes: "Quick and shifty. Slot value in PPR." },
  { name: "Jayden Higgins", position: "WR", college: "Iowa State", consensus: 25, notes: "Physical receiver. Red zone threat." },
  { name: "Le'Veon Moss", position: "RB", college: "Texas A&M", consensus: 26, notes: "Physical runner. Between-the-tackles style." },
  { name: "Devin Neal", position: "RB", college: "Kansas", consensus: 27, notes: "Productive. Solid floor." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 28, notes: "Quick, shifty. Change of pace back." },
  { name: "Trevor Etienne", position: "RB", college: "Georgia", consensus: 29, notes: "Explosive athlete. Travis Etienne's brother." },
  { name: "Kaleb Johnson", position: "RB", college: "Iowa", consensus: 30, notes: "Power runner. Breakaway speed." },
];

// 2027 NFL Draft Prospects (PROJECTIONS) - Updated Feb 2026
const INITIAL_PROSPECTS_2027 = [
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "GENERATIONAL. DeVonta Smith comp. 27 TDs in 2 seasons. True WR1." },
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 2, notes: "Potential #1 overall. 3,163 yards, 26 TD, 5 INT. 6'4\" 220 dual-threat." },
  { name: "Dante Moore", position: "QB", college: "Oregon", consensus: 3, notes: "Returned from 2026 draft! 3,565 yards, 30 TD. Could be QB1." },
  { name: "Ahmad Hardy", position: "RB", college: "Missouri", consensus: 4, notes: "RB1 in class. 1,649 yards, 16 TDs, 6.4 YPC. Explosive." },
  { name: "Keelon Russell", position: "QB", college: "Alabama", consensus: 5, notes: "Top-5 recruit. Dynamic playmaker. Bama starter." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 6, notes: "Five-star QB. Dual-threat with elite arm." },
  { name: "Treylon Burks Jr", position: "WR", college: "Arkansas", consensus: 7, notes: "Big-play WR. Physical after catch." },
  { name: "Jaylen Mbakwe", position: "WR", college: "Penn State", consensus: 8, notes: "Speed receiver. Deep threat specialist." },
  { name: "CJ Daniels", position: "WR", college: "LSU", consensus: 9, notes: "Former Liberty standout. Physical receiver." },
  { name: "Dakorien Moore", position: "WR", college: "Texas", consensus: 10, notes: "Five-star freshman. Elite route runner potential." },
  { name: "Jordan Faison", position: "WR", college: "UCF", consensus: 11, notes: "Speed receiver. Big play ability." },
  { name: "TreVeyon Henderson", position: "RB", college: "Ohio State", consensus: 12, notes: "If healthy - explosive talent. Injury concerns." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 13, notes: "Physical runner. Late breakout." },
  { name: "Nate Frazier", position: "RB", college: "Georgia", consensus: 14, notes: "Talented back on loaded team." },
  { name: "DJ Giddens", position: "RB", college: "Kansas State", consensus: 15, notes: "Explosive. Big play ability." },
  { name: "Gunnar Helm", position: "TE", college: "Texas", consensus: 16, notes: "TE1 in 2027. Athletic with good hands." },
  { name: "Tyler Warren", position: "TE", college: "Penn State", consensus: 17, notes: "Swiss army knife. Used everywhere." },
  { name: "Colston Loveland", position: "TE", college: "Michigan", consensus: 18, notes: "Solid all-around TE prospect." },
  { name: "Dallas Wilson", position: "QB", college: "UCF", consensus: 19, notes: "Rising prospect. Mobile passer." },
  { name: "Sawyer Robertson", position: "QB", college: "Texas Tech", consensus: 20, notes: "Gunslinger. Big arm." },
  { name: "Rico Flores Jr", position: "WR", college: "Notre Dame", consensus: 21, notes: "Reliable possession receiver." },
  { name: "Ryan Williams", position: "WR", college: "Alabama", consensus: 22, notes: "Electric freshman. Big play threat." },
  { name: "De'Zhaun Stribling", position: "WR", college: "Oklahoma State", consensus: 23, notes: "Productive in Big 12." },
  { name: "Anthony Hankerson", position: "RB", college: "Georgia Tech", consensus: 24, notes: "Breakout candidate. Physical runner." },
  { name: "Stacy Gage", position: "RB", college: "Texas A&M", consensus: 25, notes: "Powerful runner between the tackles." },
  { name: "Bhayshul Tuten", position: "RB", college: "Virginia Tech", consensus: 26, notes: "Productive. NFL-ready size." },
  { name: "Quinten Joyner", position: "RB", college: "Oregon", consensus: 27, notes: "Explosive in limited touches. Upside play." },
  { name: "Elijhah Badger", position: "WR", college: "Arizona State", consensus: 28, notes: "Experienced receiver. Reliable." },
  { name: "Trey Maxie", position: "TE", college: "LSU", consensus: 29, notes: "Athletic TE prospect. Developing." },
  { name: "Peyton O'Brien", position: "TE", college: "Penn State", consensus: 30, notes: "Developing prospect with upside." },
];

// GET prospects by draft class
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const draftClass = searchParams.get("class") || "2026";
  const position = searchParams.get("position");
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    // If force refresh, delete existing prospects for this class
    if (forceRefresh) {
      await prisma.dynastyProspect.deleteMany({
        where: { draftClass },
      });
    }

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

// POST to refresh prospects (clear and re-seed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draftClass } = body;

    if (!draftClass) {
      return NextResponse.json({ error: "draftClass required" }, { status: 400 });
    }

    // Delete existing
    await prisma.dynastyProspect.deleteMany({
      where: { draftClass },
    });

    // Re-fetch will seed fresh data
    const url = new URL(request.url);
    url.searchParams.set("class", draftClass);
    
    return NextResponse.json({ success: true, message: `Cleared ${draftClass} prospects. Reload page to re-seed.` });
  } catch (error) {
    console.error("Failed to refresh prospects:", error);
    return NextResponse.json({ error: "Failed to refresh prospects" }, { status: 500 });
  }
}
