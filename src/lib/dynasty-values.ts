// Dynasty Superflex Values - Based on KTC/FantasyCalc market values (Feb 2026)
// Values on a 0-10000 scale where top players are ~9500-10000

// 2026 NFL Draft Pick Values (Superflex - QBs get drafted high)
export const PICK_VALUES_2026: Record<string, number> = {
  "1.01": 7500, // Weaker class than usual
  "1.02": 7000,
  "1.03": 6600,
  "1.04": 6200,
  "1.05": 5800,
  "1.06": 5500,
  "1.07": 5200,
  "1.08": 4900,
  "1.09": 4600,
  "1.10": 4300,
  "1.11": 4000,
  "1.12": 3800,
  "2.01": 3500,
  "2.02": 3300,
  "2.03": 3100,
  "2.04": 2900,
  "2.05": 2700,
  "2.06": 2500,
  "2.07": 2300,
  "2.08": 2100,
  "2.09": 1900,
  "2.10": 1800,
  "2.11": 1700,
  "2.12": 1600,
  "3.01": 1200,
  "3.02": 1100,
  "3.03": 1000,
  "3.04": 900,
  "3.05": 800,
  "3.06": 700,
};

// Future pick values (mid-round estimates with time discount)
export const PICK_VALUES_2027: Record<string, number> = {
  "1st": 6000, // Stronger class expected (Jeremiah Smith, etc.)
  "2nd": 2800,
  "3rd": 1000,
};

export const PICK_VALUES_2028: Record<string, number> = {
  "1st": 5500,
  "2nd": 2500,
  "3rd": 800,
};

// Dynasty Player Values by Sleeper ID
// Based on SF PPR values as of Feb 2026
export const PLAYER_VALUES: Record<string, { value: number; tier: string }> = {
  // TIER 1 - Elite (9000+)
  "4984": { value: 9999, tier: "Elite" },      // Bijan Robinson
  "9509": { value: 9700, tier: "Elite" },      // CJ Stroud
  "9221": { value: 9600, tier: "Elite" },      // Jahmyr Gibbs
  "8110": { value: 9900, tier: "Elite" },      // Ja'Marr Chase
  "9226": { value: 9400, tier: "Elite" },      // Anthony Richardson
  
  // TIER 2 - Star (7500-9000)
  "4866": { value: 7200, tier: "Star" },       // Saquon Barkley (28, declining)
  "6794": { value: 8600, tier: "Star" },       // Amon-Ra St. Brown
  "6819": { value: 8400, tier: "Star" },       // Jaylen Waddle
  "9493": { value: 8800, tier: "Star" },       // Puka Nacua
  "8148": { value: 8500, tier: "Star" },       // Garrett Wilson
  "8121": { value: 8200, tier: "Star" },       // Chris Olave
  "9754": { value: 8300, tier: "Star" },       // De'Von Achane
  "7611": { value: 8700, tier: "Star" },       // Nico Collins
  "8144": { value: 8100, tier: "Star" },       // Drake London
  "5906": { value: 7800, tier: "Star" },       // AJ Brown
  "7525": { value: 7900, tier: "Star" },       // Breece Hall
  "4037": { value: 8000, tier: "Star" },       // Josh Allen
  "3163": { value: 7700, tier: "Star" },       // Patrick Mahomes
  
  // TIER 3 - Solid Starters (5500-7500)
  "7543": { value: 7000, tier: "Starter" },    // Tank Dell
  "6865": { value: 6800, tier: "Starter" },    // DeVonta Smith
  "7567": { value: 7200, tier: "Starter" },    // Brock Bowers
  "8137": { value: 6600, tier: "Starter" },    // James Cook
  "12527": { value: 7400, tier: "Starter" },   // Marvin Harrison Jr
  "12529": { value: 7300, tier: "Starter" },   // Malik Nabers
  "11563": { value: 6500, tier: "Starter" },   // Caleb Williams
  "8150": { value: 6000, tier: "Starter" },    // Travis Etienne
  "6813": { value: 5800, tier: "Starter" },    // Rachaad White
  "8155": { value: 5600, tier: "Starter" },    // Jaylen Warren
  "6797": { value: 5700, tier: "Starter" },    // Tua Tagovailoa
  "11635": { value: 6200, tier: "Starter" },   // Ladd McConkey
  "7049": { value: 5500, tier: "Starter" },    // Kyle Pitts
  "8126": { value: 6400, tier: "Starter" },    // Jaxon Smith-Njigba
  "9758": { value: 5900, tier: "Starter" },    // Sam LaPorta
  
  // TIER 4 - Flex/Depth (3500-5500)
  "2505": { value: 4000, tier: "Flex" },       // Davante Adams (aging)
  "12545": { value: 5200, tier: "Flex" },      // Jayden Daniels
  "8676": { value: 4800, tier: "Flex" },       // Rashid Shaheed
  "7607": { value: 5000, tier: "Flex" },       // Trey McBride
  "12493": { value: 4600, tier: "Flex" },      // Xavier Worthy
  "11565": { value: 4400, tier: "Flex" },      // Bo Nix
  "4892": { value: 3000, tier: "Flex" },       // Deshaun Watson (risk)
  "7588": { value: 4200, tier: "Flex" },       // Dalton Kincaid
  "1166": { value: 2500, tier: "Flex" },       // Kirk Cousins (old)
  "4034": { value: 3200, tier: "Flex" },       // Cooper Kupp (aging, injury)
  "3198": { value: 2800, tier: "Flex" },       // Derrick Henry (31, limited window)
  "260": { value: 2500, tier: "Flex" },        // Travis Kelce (aging)
  "96": { value: 2000, tier: "Bench" },        // Aaron Rodgers (old)
  
  // TIER 5 - Deep Bench (1000-3500)
  "6768": { value: 1200, tier: "Bench" },      // Kadarius Toney
  "11576": { value: 3000, tier: "Bench" },     // Jaylen Wright
  "11579": { value: 3500, tier: "Bench" },     // Rome Odunze
  "7090": { value: 2200, tier: "Bench" },      // Kendre Miller
  "11834": { value: 2000, tier: "Bench" },     // Blake Corum
  "12658": { value: 1800, tier: "Bench" },     // Jonnu Smith
  "12718": { value: 1500, tier: "Bench" },     // Various
  "4983": { value: 1500, tier: "Bench" },      // Nick Chubb (injury)
  "8210": { value: 1400, tier: "Bench" },      // Various
  "4017": { value: 800, tier: "Bench" },       // Ryan Tannehill
  "7528": { value: 600, tier: "Bench" },       // Elijah Mitchell
  
  // More players for other teams
  "10232": { value: 5100, tier: "Flex" },      // Josh Downs
  "4988": { value: 1800, tier: "Bench" },      // Nick Chubb
  "4981": { value: 4500, tier: "Flex" },       // Alvin Kamara (aging)
  "1466": { value: 3500, tier: "Flex" },       // Travis Kelce (TE1 but old)
  "331": { value: 800, tier: "Bench" },        // Zach Ertz (old)
  "19": { value: 600, tier: "Bench" },         // Russell Wilson
  "2306": { value: 1000, tier: "Bench" },      // Geno Smith
  "4035": { value: 7500, tier: "Starter" },    // Joe Burrow
  "4039": { value: 6800, tier: "Starter" },    // Jalen Hurts
  "7591": { value: 3800, tier: "Flex" },       // Tank Bigsby
  "4033": { value: 2200, tier: "Bench" },      // Desmond Ridder
  
  // Default for unknown players
  "default": { value: 1000, tier: "Bench" },
};

// 2026 NFL Draft Prospects (based on PFF Big Board - Feb 2026)
// NOTE: This is a DEFENSIVE-heavy class. Fantasy-relevant prospects are lower.
export const PROSPECTS_2026 = [
  // RBs
  { name: "Jeremiyah Love", position: "RB", college: "Notre Dame", consensus: 1, notes: "Future impact NFL back. Elite athleticism: speed, burst, agility, change of direction. Natural receiver. Power game still developing. First-round potential." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 6, notes: "Physical runner with excellent hands. Late-bloomer. Older prospect but productive. Workhorse profile." },
  { name: "Devin Neal", position: "RB", college: "Kansas", consensus: 8, notes: "Productive runner. Solid floor, limited ceiling. Day 2 pick likely." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 10, notes: "Quick, shifty back. Good in space. Smaller frame limits between-tackles work." },
  { name: "Kaleb Johnson", position: "RB", college: "Iowa", consensus: 12, notes: "Big-play runner with breakaway speed. Can be inconsistent. Boom-bust profile." },
  
  // WRs
  { name: "Jordyn Tyson", position: "WR", college: "Arizona State", consensus: 2, notes: "Sun Devils' top playmaker. Smaller but plays stronger than listed. Great contested catches. Inside-out versatility. Day 1-2 pick." },
  { name: "Makai Lemon", position: "WR", college: "USC", consensus: 3, notes: "Devastating quickness in every aspect. Elite footwork, acceleration, hand usage. Lacks size but incredibly productive potential." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 5, notes: "Long frame with big catch radius. Lines up as X or Z. Good blocker. Needs to improve twitch and release vs press." },
  { name: "Denzel Boston", position: "WR", college: "Washington", consensus: 7, notes: "Smooth for a big receiver. Quick releases vs press, good route cuts. Big catch radius, strong hands. Creates explosive plays." },
  { name: "Jayden Higgins", position: "WR", college: "Iowa State", consensus: 11, notes: "Big body red zone threat. Reliable hands. Limited separation ability." },
  { name: "Luther Burden III", position: "WR", college: "Missouri", consensus: 4, notes: "Dynamic playmaker. Explosive after the catch. Versatile alignment. If he returns from 2025 class." },
  
  // QBs (SF Premium)
  { name: "Ty Simpson", position: "QB", college: "Alabama", consensus: 9, notes: "Foundational NFL tools: mobility, escapability. Lacks experience and consistency. Developmental prospect with physical upside. Must improve processing." },
  { name: "Fernando Mendoza", position: "QB", college: "Indiana", consensus: 13, notes: "Looks the part - good size, arm strength. Nice touch on sideline throws. Breaks down under pressure. High turnover-worthy play rate." },
  { name: "Dante Moore", position: "QB", college: "UCLA", consensus: 15, notes: "Former 5-star recruit. Transfered from UCLA to Oregon. Still developing but has tools." },
  { name: "Jaxson Dart", position: "QB", college: "Ole Miss", consensus: 14, notes: "If he declares - accurate, mobile, great production. Could rise." },
  
  // TEs
  { name: "Kenyon Sadiq", position: "TE", college: "Oregon", consensus: 16, notes: "Alluring size + athleticism combo. Former two-way player. Deployed like big receiver, not inline TE. Movement skills create alignment versatility." },
  { name: "Colston Loveland", position: "TE", college: "Michigan", consensus: 18, notes: "If he returns - solid all-around TE. Athletic, reliable." },
  { name: "Tyler Warren", position: "TE", college: "Penn State", consensus: 17, notes: "If he returns - Swiss army knife usage. Elite production. Best TE in class if available." },
];

// 2027 NFL Draft Prospects (projections - underclassmen)
export const PROSPECTS_2027 = [
  // The generational talent
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "GENERATIONAL. True freshman All-American in 2024. 1,200+ yards as freshman. 6'3\", elite speed. Best WR prospect in years. Will be WR1 by a mile." },
  
  // QBs
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 2, notes: "Manning bloodlines. Started games in 2025. Elite arm talent, poise. Will be QB1 of the class if he declares." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 6, notes: "5-star recruit. Big arm, mobility. Electric athlete. Early in development." },
  { name: "Julian Lewis", position: "QB", college: "Colorado", consensus: 8, notes: "Deion Sanders' QB of the future. Young but talented arm." },
  
  // WRs
  { name: "Ryan Williams", position: "WR", college: "Alabama", consensus: 3, notes: "Electric true freshman in 2024. Game-breaking speed. Creates chunk plays consistently. Star in the making." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 7, notes: "If he doesn't declare for 2026. Talented but behind Smith/Egbuka." },
  { name: "Zachariah Branch", position: "WR", college: "USC", consensus: 10, notes: "Return specialist. Track speed. Big play threat when involved." },
  { name: "Dane Key", position: "WR", college: "Kentucky", consensus: 13, notes: "Productive receiver. Good route runner. NFL bloodlines." },
  { name: "Barion Brown", position: "WR", college: "Kentucky", consensus: 14, notes: "Speed demon. Track athlete. Developing route runner." },
  
  // RBs
  { name: "Quinshon Judkins", position: "RB", college: "Ohio State", consensus: 4, notes: "If he returns. Workhorse back with receiving chops. Physical runner." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 5, notes: "If he returns from 2026. Quick, good hands. Change of pace type." },
  { name: "Nate Frazier", position: "RB", college: "Georgia", consensus: 11, notes: "Talented back on loaded roster. Will get his chance eventually." },
  { name: "DJ Giddens", position: "RB", college: "Kansas State", consensus: 12, notes: "Explosive runner with receiving ability." },
  
  // TEs
  { name: "Gunnar Helm", position: "TE", college: "Texas", consensus: 9, notes: "If he returns. Athletic TE with good production." },
];

// Get player value with fallback
export function getPlayerValue(sleeperId: string): { value: number; tier: string } {
  return PLAYER_VALUES[sleeperId] || PLAYER_VALUES["default"];
}

// Get pick value
export function getPickValue(season: string, round: number, pick?: number): number {
  if (season === "2026" && pick) {
    const key = `${round}.${pick.toString().padStart(2, "0")}`;
    return PICK_VALUES_2026[key] || (round === 1 ? 5000 : round === 2 ? 2500 : 1000);
  } else if (season === "2027") {
    return round === 1 ? PICK_VALUES_2027["1st"] : round === 2 ? PICK_VALUES_2027["2nd"] : PICK_VALUES_2027["3rd"];
  } else if (season === "2028") {
    return round === 1 ? PICK_VALUES_2028["1st"] : round === 2 ? PICK_VALUES_2028["2nd"] : PICK_VALUES_2028["3rd"];
  }
  return 1000;
}

// Calculate team phase recommendation - ROSTER ONLY, no picks
export function recommendPhase(
  rosterValue: number, // Players only, no picks
  avgAge: number,
  leagueRank: number, // 1-12 based on roster value only
  wins: number,
  losses: number
): { phase: "tank" | "retool" | "contend"; reason: string } {
  // Contender signals - based on ROSTER strength
  const isHighValue = rosterValue > 55000;
  const isTopThird = leagueRank <= 4;
  const hasWinningRecord = wins > losses;
  const isPrimeAge = avgAge >= 24 && avgAge <= 27;
  
  // Tank signals
  const isLowValue = rosterValue < 35000;
  const isBottomThird = leagueRank >= 9;
  const isYoung = avgAge < 24;
  const isOld = avgAge > 28;
  
  // Score each phase
  let contendScore = 0;
  let tankScore = 0;
  
  if (isHighValue) contendScore += 3;
  if (isTopThird) contendScore += 2;
  if (hasWinningRecord) contendScore += 2;
  if (isPrimeAge) contendScore += 1;
  
  if (isLowValue) tankScore += 3;
  if (isBottomThird) tankScore += 2;
  if (isYoung) tankScore += 1;
  if (isOld && isLowValue) tankScore += 2; // old + bad = definitely sell
  
  if (contendScore >= 5) {
    return { phase: "contend", reason: `Strong roster (${rosterValue.toLocaleString()} value, rank #${leagueRank}). Your window is open - maximize it.` };
  } else if (tankScore >= 4 || isBottomThird) {
    return { phase: "tank", reason: `Roster ranks #${leagueRank} in the league (${rosterValue.toLocaleString()} value). Sell aging assets for picks/youth.` };
  } else {
    return { phase: "retool", reason: `Middle-of-pack roster (rank #${leagueRank}). Look for value trades - buy low on injuries, sell high on hot streaks.` };
  }
}
