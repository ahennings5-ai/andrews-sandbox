// Dynasty Superflex Values - Based on KTC/FantasyCalc market values (Feb 2026)
// Values on a 0-10000 scale where top players are ~9500-10000

// 2026 NFL Draft Pick Values (Superflex - QBs get drafted high)
export const PICK_VALUES_2026: Record<string, number> = {
  "1.01": 8500, // Ashton Jeanty / Cam Ward level
  "1.02": 7800,
  "1.03": 7200,
  "1.04": 6800,
  "1.05": 6400,
  "1.06": 6000,
  "1.07": 5700,
  "1.08": 5400,
  "1.09": 5100,
  "1.10": 4800,
  "1.11": 4500,
  "1.12": 4300,
  "2.01": 4000,
  "2.02": 3800,
  "2.03": 3600,
  "2.04": 3400,
  "2.05": 3200,
  "2.06": 3000,
  "2.07": 2800,
  "2.08": 2600,
  "2.09": 2400,
  "2.10": 2200,
  "2.11": 2100,
  "2.12": 2000,
  "3.01": 1500,
  "3.02": 1400,
  "3.03": 1300,
  "3.04": 1200,
  "3.05": 1100,
  "3.06": 1000,
};

// Future pick values (mid-round estimates with time discount)
export const PICK_VALUES_2027: Record<string, number> = {
  "1st": 5500, // Mid 1st estimate
  "2nd": 2800,
  "3rd": 1000,
};

export const PICK_VALUES_2028: Record<string, number> = {
  "1st": 5000, // Further future discount
  "2nd": 2500,
  "3rd": 800,
};

// Dynasty Player Values by Sleeper ID
// Based on SF PPR values as of Feb 2026
export const PLAYER_VALUES: Record<string, { value: number; tier: string }> = {
  // TIER 1 - Elite (9000+)
  "4984": { value: 9999, tier: "Elite" },      // Bijan Robinson
  "9509": { value: 9500, tier: "Elite" },      // CJ Stroud
  "9221": { value: 9400, tier: "Elite" },      // Jahmyr Gibbs
  "8110": { value: 9800, tier: "Elite" },      // Ja'Marr Chase
  "9226": { value: 9600, tier: "Elite" },      // Anthony Richardson
  
  // TIER 2 - Star (7500-9000)
  "4866": { value: 8800, tier: "Star" },       // Saquon Barkley
  "6794": { value: 8500, tier: "Star" },       // Amon-Ra St. Brown
  "6819": { value: 8400, tier: "Star" },       // Jaylen Waddle
  "9493": { value: 8700, tier: "Star" },       // Puka Nacua
  "8148": { value: 8300, tier: "Star" },       // Garrett Wilson
  "8121": { value: 8200, tier: "Star" },       // Chris Olave
  "9754": { value: 8100, tier: "Star" },       // De'Von Achane
  "7611": { value: 8600, tier: "Star" },       // Nico Collins
  "8144": { value: 8000, tier: "Star" },       // Drake London
  "5906": { value: 7900, tier: "Star" },       // AJ Brown
  "7525": { value: 7800, tier: "Star" },       // Breece Hall
  "4037": { value: 7700, tier: "Star" },       // Josh Allen
  "3163": { value: 7600, tier: "Star" },       // Patrick Mahomes
  "96": { value: 5500, tier: "Veteran" },      // Aaron Rodgers (old)
  
  // TIER 3 - Solid Starters (5500-7500)
  "7543": { value: 7000, tier: "Starter" },    // Tank Dell
  "6865": { value: 6800, tier: "Starter" },    // DeVonta Smith
  "7567": { value: 6700, tier: "Starter" },    // Brock Bowers
  "8137": { value: 6600, tier: "Starter" },    // James Cook
  "12527": { value: 6500, tier: "Starter" },   // Marvin Harrison Jr
  "12529": { value: 6400, tier: "Starter" },   // Malik Nabers
  "11563": { value: 6300, tier: "Starter" },   // Caleb Williams
  "8150": { value: 6200, tier: "Starter" },    // Travis Etienne
  "6813": { value: 6100, tier: "Starter" },    // Rachaad White
  "8155": { value: 6000, tier: "Starter" },    // Jaylen Warren
  "6797": { value: 5900, tier: "Starter" },    // Tua Tagovailoa
  "11635": { value: 5800, tier: "Starter" },   // Ladd McConkey
  "7049": { value: 5700, tier: "Starter" },    // Kyle Pitts
  "8126": { value: 5600, tier: "Starter" },    // Jaxon Smith-Njigba
  "9758": { value: 5500, tier: "Starter" },    // Sam LaPorta
  
  // TIER 4 - Flex/Depth (3500-5500)
  "2505": { value: 5200, tier: "Flex" },       // Davante Adams
  "12545": { value: 5100, tier: "Flex" },      // Jayden Daniels
  "8676": { value: 5000, tier: "Flex" },       // Rashid Shaheed
  "7607": { value: 4800, tier: "Flex" },       // Trey McBride
  "12493": { value: 4600, tier: "Flex" },      // Xavier Worthy
  "11565": { value: 4400, tier: "Flex" },      // Bo Nix
  "4892": { value: 4200, tier: "Flex" },       // Deshaun Watson
  "7588": { value: 4000, tier: "Flex" },       // Dalton Kincaid
  "1166": { value: 3800, tier: "Flex" },       // Kirk Cousins
  "4034": { value: 3700, tier: "Flex" },       // Cooper Kupp (aging)
  "3198": { value: 3600, tier: "Flex" },       // Derrick Henry (aging)
  "260": { value: 3500, tier: "Flex" },        // Travis Kelce (aging)
  
  // TIER 5 - Deep Bench (1500-3500)
  "6768": { value: 3200, tier: "Bench" },      // Kadarius Toney
  "11576": { value: 3000, tier: "Bench" },     // Jaylen Wright
  "11579": { value: 2800, tier: "Bench" },     // Rome Odunze
  "7090": { value: 2600, tier: "Bench" },      // Kendre Miller
  "11834": { value: 2400, tier: "Bench" },     // Blake Corum
  "12658": { value: 2200, tier: "Bench" },     // Jonnu Smith
  "12718": { value: 2000, tier: "Bench" },     // Various
  "4983": { value: 1800, tier: "Bench" },      // Nick Chubb (injury)
  "8210": { value: 1600, tier: "Bench" },      // Various
  "4017": { value: 1000, tier: "Bench" },      // Ryan Tannehill
  "7528": { value: 800, tier: "Bench" },       // Elijah Mitchell
  
  // More players for other teams
  "10232": { value: 5300, tier: "Flex" },      // Josh Downs
  "4988": { value: 2500, tier: "Bench" },      // Nick Chubb
  "4981": { value: 5400, tier: "Starter" },    // Alvin Kamara
  "1466": { value: 4500, tier: "Flex" },       // Travis Kelce
  "331": { value: 1500, tier: "Bench" },       // Zach Ertz
  "19": { value: 1200, tier: "Bench" },        // Russell Wilson
  "2306": { value: 1000, tier: "Bench" },      // Geno Smith
  "4035": { value: 6500, tier: "Starter" },    // Joe Burrow
  "4039": { value: 5800, tier: "Starter" },    // Jalen Hurts
  "7591": { value: 4000, tier: "Flex" },       // Tank Bigsby
  "4033": { value: 4500, tier: "Flex" },       // Desmond Ridder
  
  // Default for unknown players
  "default": { value: 1000, tier: "Bench" },
};

// 2026 NFL Draft Prospects (declaring after 2025 college season)
export const PROSPECTS_2026 = [
  // RBs
  { name: "Ashton Jeanty", position: "RB", college: "Boise State", consensus: 1, notes: "Generational RB. 2,600+ rushing yards, Heisman finalist. Best RB prospect since Saquon. Elite vision, contact balance, speed." },
  { name: "Omarion Hampton", position: "RB", college: "UNC", consensus: 8, notes: "Powerful runner with good receiving chops. 1,500+ rushing yards. Solid 3-down back profile." },
  { name: "Kaleb Johnson", position: "RB", college: "Iowa", consensus: 10, notes: "Explosive big-play runner. 1,500+ yards. Breakaway speed, developing pass catcher." },
  { name: "Quinshon Judkins", position: "RB", college: "Ohio State", consensus: 12, notes: "Transfer from Ole Miss. Workhorse profile. Good vision, solid receiver." },
  { name: "TreVeyon Henderson", position: "RB", college: "Ohio State", consensus: 14, notes: "Electric talent when healthy. Home run speed. Injury concerns." },
  { name: "RJ Harvey", position: "RB", college: "UCF", consensus: 18, notes: "Explosive runner. Record-breaking production. Small school questions." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 22, notes: "Physical runner. Great hands. Older prospect." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 25, notes: "Quick, shifty. Good receiving back. Smaller frame." },
  
  // WRs
  { name: "Tetairoa McMillan", position: "WR", college: "Arizona", consensus: 2, notes: "6'5\" alpha WR. Elite contested catches. 1,300+ yards. Best WR in class." },
  { name: "Luther Burden III", position: "WR", college: "Missouri", consensus: 4, notes: "Dynamic playmaker. Great after the catch. 1,200+ yards. Versatile alignment." },
  { name: "Emeka Egbuka", position: "WR", college: "Ohio State", consensus: 6, notes: "Polished route runner. Reliable hands. 1,000+ yards. NFL-ready." },
  { name: "Tre Harris", position: "WR", college: "Ole Miss", consensus: 9, notes: "Contested catch specialist. Physical receiver. 1,400+ yards." },
  { name: "Isaiah Bond", position: "WR", college: "Texas", consensus: 11, notes: "Speed demon. Deep threat specialist. 4.3 speed." },
  { name: "Evan Stewart", position: "WR", college: "Oregon", consensus: 15, notes: "Former 5-star. Developing route tree. Big play potential." },
  { name: "Jaylin Noel", position: "WR", college: "Iowa State", consensus: 17, notes: "Reliable slot. Good hands. Steady production." },
  { name: "Jayden Higgins", position: "WR", college: "Iowa State", consensus: 20, notes: "Big body receiver. Red zone threat. 6'4\"." },
  
  // QBs (Superflex premium)
  { name: "Cam Ward", position: "QB", college: "Miami", consensus: 3, notes: "Heisman finalist. Big arm, mobility. 4,000+ yards, 35+ TDs. High ceiling SF asset." },
  { name: "Shedeur Sanders", position: "QB", college: "Colorado", consensus: 5, notes: "Accurate, poised passer. Pro-ready processor. NFL bloodlines. 3,800+ yards." },
  { name: "Quinn Ewers", position: "QB", college: "Texas", consensus: 7, notes: "If declares - prototypical pocket passer. Strong arm, good size. Inconsistent health." },
  { name: "Jalen Milroe", position: "QB", college: "Alabama", consensus: 13, notes: "Dual-threat QB. Rushing upside. Developing passer. Athletic freak." },
  { name: "Dillon Gabriel", position: "QB", college: "Oregon", consensus: 19, notes: "Experienced winner. Accurate. Older. Good not great arm." },
  { name: "Carson Beck", position: "QB", college: "Georgia", consensus: 21, notes: "If healthy - pro-style QB. Accurate, smart. Injury concerns." },
  
  // TEs
  { name: "Tyler Warren", position: "TE", college: "Penn State", consensus: 16, notes: "Elite TE prospect. Swiss army knife usage. 1,000+ yards. Best TE since Bowers." },
  { name: "Colston Loveland", position: "TE", college: "Michigan", consensus: 23, notes: "Solid all-around TE. Good athlete. Reliable target." },
  { name: "Mason Taylor", position: "TE", college: "LSU", consensus: 24, notes: "Good bloodlines (Travis Kelce's coach's son). Athletic. Developing." },
  { name: "Harold Fannin Jr", position: "TE", college: "Bowling Green", consensus: 26, notes: "Elite production (1,200+ yards). Small school. Athletic testing will matter." },
];

// 2027 NFL Draft Prospects (projections - underclassmen)
export const PROSPECTS_2027 = [
  // The generational talent
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "GENERATIONAL. True freshman All-American. 1,200+ yards as freshman. 6'3\", elite speed. Best WR prospect in years." },
  
  // QBs
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 2, notes: "The Name. Limited playing time but elite tools. Manning bloodlines. If Ewers leaves, will start 2026." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 5, notes: "5-star recruit. Big arm, mobility. Just starting college career." },
  { name: "Jaxson Dart", position: "QB", college: "Ole Miss", consensus: 8, notes: "If he returns - accurate, mobile. Great production." },
  { name: "Sawyer Robertson", position: "QB", college: "Texas Tech", consensus: 15, notes: "Gunslinger. Big arm. Volume passer." },
  
  // WRs
  { name: "Ryan Williams", position: "WR", college: "Alabama", consensus: 3, notes: "Electric true freshman. 800+ yards as freshman. Game-breaking speed. Future star." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 9, notes: "5-star recruit. Developing in loaded WR room." },
  { name: "Zachariah Branch", position: "WR", college: "USC", consensus: 12, notes: "Return specialist. Track speed. Big play threat." },
  { name: "Rico Flores Jr", position: "WR", college: "Notre Dame", consensus: 18, notes: "Possession receiver. Good route runner." },
  { name: "Dane Key", position: "WR", college: "Kentucky", consensus: 20, notes: "Productive. Good size. NFL bloodlines." },
  
  // RBs
  { name: "TreVeyon Henderson", position: "RB", college: "Ohio State", consensus: 4, notes: "If returns - explosive when healthy. Electric talent." },
  { name: "Nate Frazier", position: "RB", college: "Georgia", consensus: 10, notes: "Talented back on loaded team. Will get his chance." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 11, notes: "If returns - physical runner with great hands." },
  { name: "DJ Giddens", position: "RB", college: "Kansas State", consensus: 14, notes: "Explosive. Good receiving back." },
  { name: "Anthony Hankerson", position: "RB", college: "Georgia Tech", consensus: 17, notes: "Breakout candidate. Powerful runner." },
  
  // TEs
  { name: "Trey Maxie", position: "TE", college: "LSU", consensus: 16, notes: "Athletic TE prospect. Developing blocker." },
  { name: "Peyton O'Brien", position: "TE", college: "Penn State", consensus: 22, notes: "Solid prospect. Good athlete." },
  
  // Others
  { name: "Kyren Lacy", position: "WR", college: "LSU", consensus: 6, notes: "Physical receiver. Good after catch." },
  { name: "De'Zhaun Stribling", position: "WR", college: "Oklahoma State", consensus: 7, notes: "Big 12 production monster." },
  { name: "Jacorey Brooks", position: "WR", college: "Louisville", consensus: 13, notes: "Former Alabama. Physical style." },
  { name: "Bhayshul Tuten", position: "RB", college: "Virginia Tech", consensus: 19, notes: "Productive. NFL-ready size." },
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

// Calculate team phase recommendation
export function recommendPhase(
  totalValue: number,
  avgAge: number,
  numFirsts: number,
  leagueRank: number, // 1-12
  wins: number,
  losses: number
): { phase: "tank" | "retool" | "contend"; reason: string } {
  // Contender signals
  const isHighValue = totalValue > 60000;
  const isTopHalf = leagueRank <= 6;
  const hasWinningRecord = wins > losses;
  const isPrimeAge = avgAge >= 24 && avgAge <= 27;
  
  // Tank signals
  const isLowValue = totalValue < 40000;
  const isBottomThird = leagueRank >= 9;
  const hasFuturePicks = numFirsts >= 3;
  const isYoung = avgAge < 24;
  const isOld = avgAge > 28;
  
  // Score each phase
  let contendScore = 0;
  let tankScore = 0;
  
  if (isHighValue) contendScore += 3;
  if (isTopHalf) contendScore += 2;
  if (hasWinningRecord) contendScore += 2;
  if (isPrimeAge) contendScore += 2;
  
  if (isLowValue) tankScore += 3;
  if (isBottomThird) tankScore += 2;
  if (hasFuturePicks) tankScore += 3;
  if (isYoung) tankScore += 1;
  if (isOld) tankScore += 2; // old + bad = sell
  
  if (contendScore >= 6) {
    return { phase: "contend", reason: `Strong roster (${totalValue.toLocaleString()} value, rank #${leagueRank}). Window is open.` };
  } else if (tankScore >= 5) {
    return { phase: "tank", reason: `Building for future. ${numFirsts} 1sts stockpiled. Accumulate youth and picks.` };
  } else {
    return { phase: "retool", reason: `Transitional roster. Look for value trades to accelerate rebuild or make a push.` };
  }
}
