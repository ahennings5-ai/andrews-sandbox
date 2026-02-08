// Dynasty Superflex Values - From DynastyProcess (scraped 2026-02-06)
// Values in Superflex/2QB format

// Player name -> Superflex Value mapping (from dynastyprocess/data)
export const PLAYER_VALUES_BY_NAME: Record<string, { value: number; pos: string; team: string | null; age: number | null }> = {
  // ELITE TIER (8000+)
  "Josh Allen": { value: 10232, pos: "QB", team: "BUF", age: 30 },
  "Ja'Marr Chase": { value: 9055, pos: "WR", team: "CIN", age: 26 },
  "Jaxon Smith-Njigba": { value: 8498, pos: "WR", team: "SEA", age: 24 },
  "Patrick Mahomes": { value: 8360, pos: "QB", team: "KC", age: 30 },
  "Joe Burrow": { value: 8518, pos: "QB", team: "CIN", age: 29 },
  "Justin Jefferson": { value: 8439, pos: "WR", team: "MIN", age: 27 },
  "Lamar Jackson": { value: 8282, pos: "QB", team: "BAL", age: 29 },
  "CeeDee Lamb": { value: 8146, pos: "WR", team: "DAL", age: 27 },
  "Jalen Hurts": { value: 8051, pos: "QB", team: "PHI", age: 28 },
  
  // STAR TIER (6000-8000)
  "Bijan Robinson": { value: 7883, pos: "RB", team: "ATL", age: 24 },
  "Puka Nacua": { value: 7883, pos: "WR", team: "LAR", age: 25 },
  "Amon-Ra St. Brown": { value: 7864, pos: "WR", team: "DET", age: 26 },
  "Jayden Daniels": { value: 7592, pos: "QB", team: "WAS", age: 25 },
  "Jahmyr Gibbs": { value: 7176, pos: "RB", team: "DET", age: 24 },
  "Justin Herbert": { value: 7209, pos: "QB", team: "LAC", age: 28 },
  "Caleb Williams": { value: 7192, pos: "QB", team: "CHI", age: 24 },
  "Drake Maye": { value: 6395, pos: "QB", team: "NE", age: 23 },
  "Malik Nabers": { value: 6320, pos: "WR", team: "NYG", age: 23 },
  "Ashton Jeanty": { value: 6261, pos: "RB", team: "LV", age: 22 },
  "Jaxson Dart": { value: 6073, pos: "QB", team: "NYG", age: 23 },
  
  // STARTER TIER (4000-6000)
  "Drake London": { value: 5821, pos: "WR", team: "ATL", age: 25 },
  "James Cook": { value: 5299, pos: "RB", team: "BUF", age: 26 },
  "George Pickens": { value: 5262, pos: "WR", team: "DAL", age: 25 },
  "Garrett Wilson": { value: 5213, pos: "WR", team: "NYJ", age: 26 },
  "Breece Hall": { value: 5213, pos: "RB", team: "NYJ", age: 25 },
  "Omarion Hampton": { value: 5068, pos: "RB", team: "LAC", age: 23 },
  "De'Von Achane": { value: 5080, pos: "RB", team: "MIA", age: 24 },
  "Jordan Love": { value: 4973, pos: "QB", team: "GB", age: 27 },
  "C.J. Stroud": { value: 4950, pos: "QB", team: "HOU", age: 24 },
  "Chris Olave": { value: 4915, pos: "WR", team: "NO", age: 26 },
  "Nico Collins": { value: 4915, pos: "WR", team: "HOU", age: 27 },
  "Tetairoa McMillan": { value: 4846, pos: "WR", team: "CAR", age: 23 },
  "Rashee Rice": { value: 4846, pos: "WR", team: "KC", age: 26 },
  "Marvin Harrison Jr.": { value: 4723, pos: "WR", team: "ARI", age: 24 },
  "A.J. Brown": { value: 4624, pos: "WR", team: "PHI", age: 29 },
  "Trey McBride": { value: 4443, pos: "TE", team: "ARI", age: 26 },
  "Brock Bowers": { value: 4219, pos: "TE", team: "LV", age: 23 },
  "TreVeyon Henderson": { value: 4102, pos: "RB", team: "NE", age: 23 },
  "Emeka Egbuka": { value: 4073, pos: "WR", team: "TB", age: 23 },
  "Tee Higgins": { value: 3488, pos: "WR", team: "CIN", age: 27 },
  
  // FLEX TIER (2000-4000)
  "Baker Mayfield": { value: 3681, pos: "QB", team: "TB", age: 31 },
  "Ladd McConkey": { value: 3913, pos: "WR", team: "LAC", age: 24 },
  "Christian McCaffrey": { value: 3877, pos: "RB", team: "SF", age: 30 },
  "Kyren Williams": { value: 3537, pos: "RB", team: "LAR", age: 25 },
  "Jaylen Waddle": { value: 3359, pos: "WR", team: "MIA", age: 27 },
  "DeVonta Smith": { value: 3328, pos: "WR", team: "PHI", age: 27 },
  "Brian Thomas Jr.": { value: 3351, pos: "WR", team: "JAC", age: 23 },
  "Jameson Williams": { value: 3328, pos: "WR", team: "DET", age: 25 },
  "Bucky Irving": { value: 3138, pos: "RB", team: "TB", age: 24 },
  "Sam LaPorta": { value: 3079, pos: "TE", team: "DET", age: 25 },
  "Jared Goff": { value: 3043, pos: "QB", team: "DET", age: 31 },
  "Chase Brown": { value: 2994, pos: "RB", team: "CIN", age: 26 },
  "Zay Flowers": { value: 2843, pos: "WR", team: "BAL", age: 25 },
  "Saquon Barkley": { value: 2770, pos: "RB", team: "PHI", age: 29 },
  "Kyler Murray": { value: 2777, pos: "QB", team: "ARI", age: 29 },
  "Trevor Lawrence": { value: 5412, pos: "QB", team: "JAC", age: 26 },
  "Colston Loveland": { value: 2522, pos: "TE", team: "CHI", age: 22 },
  "Tyler Warren": { value: 2412, pos: "TE", team: "IND", age: 24 },
  "Luther Burden III": { value: 2412, pos: "WR", team: "CHI", age: 22 },
  "Quinshon Judkins": { value: 2395, pos: "RB", team: "CLE", age: 22 },
  "Travis Etienne": { value: 2090, pos: "RB", team: "JAC", age: 27 },
  "Tucker Kraft": { value: 2008, pos: "TE", team: "GB", age: 25 },
  "RJ Harvey": { value: 2090, pos: "RB", team: "DEN", age: 25 },
  "Harold Fannin Jr.": { value: 1961, pos: "TE", team: "CLE", age: 22 },
  "Rome Odunze": { value: 3647, pos: "WR", team: "CHI", age: 24 },
  "DK Metcalf": { value: 1777, pos: "WR", team: "PIT", age: 28 },
  "Kenneth Walker III": { value: 1773, pos: "RB", team: "SEA", age: 25 },
  "Travis Hunter": { value: 1703, pos: "WR", team: "JAC", age: 23 },
  "Cam Skattebo": { value: 1664, pos: "RB", team: "NYG", age: 24 },
  "Josh Jacobs": { value: 2247, pos: "RB", team: "GB", age: 28 },
  "Kyle Pitts": { value: 1625, pos: "TE", team: "ATL", age: 25 },
  "Dalton Kincaid": { value: 1975, pos: "TE", team: "BUF", age: 26 },
  
  // BENCH TIER (500-2000)
  "Cam Ward": { value: 1550, pos: "QB", team: "TEN", age: 24 },
  "Bryce Young": { value: 1401, pos: "QB", team: "CAR", age: 25 },
  "Anthony Richardson": { value: 1385, pos: "QB", team: "IND", age: 24 },
  "Davante Adams": { value: 1425, pos: "WR", team: "LAR", age: 33 },
  "Derrick Henry": { value: 1438, pos: "RB", team: "BAL", age: 32 },
  "Cooper Kupp": { value: 74, pos: "WR", team: "SEA", age: 33 },
  "Jaylen Warren": { value: 1008, pos: "RB", team: "PIT", age: 27 },
  "DJ Moore": { value: 1103, pos: "WR", team: "CHI", age: 29 },
  "Jordan Addison": { value: 1952, pos: "WR", team: "MIN", age: 24 },
  "Brock Purdy": { value: 5337, pos: "QB", team: "SF", age: 26 },
  "Bo Nix": { value: 5400, pos: "QB", team: "DEN", age: 26 },
  "Xavier Worthy": { value: 1514, pos: "WR", team: "KC", age: 23 },
  "Tank Dell": { value: 150, pos: "WR", team: "HOU", age: 26 },
  "Jayden Higgins": { value: 890, pos: "WR", team: "HOU", age: 23 },
  "Tre Harris": { value: 269, pos: "WR", team: "LAC", age: 24 },
  "J.J. McCarthy": { value: 1077, pos: "QB", team: "MIN", age: 23 },
  "Michael Penix Jr.": { value: 1206, pos: "QB", team: "ATL", age: 26 },
  "Sam Darnold": { value: 2557, pos: "QB", team: "SEA", age: 29 },
  "Kirk Cousins": { value: 225, pos: "QB", team: "ATL", age: 38 },
  "Aaron Rodgers": { value: 275, pos: "QB", team: "PIT", age: 42 },
  "Tua Tagovailoa": { value: 1276, pos: "QB", team: "MIA", age: 28 },
  "Rachaad White": { value: 127, pos: "RB", team: "TB", age: 27 },
  "Travis Kelce": { value: 131, pos: "TE", team: "KC", age: 36 },
  "Rashid Shaheed": { value: 279, pos: "WR", team: "SEA", age: 27 },
  "Alvin Kamara": { value: 172, pos: "RB", team: "NO", age: 31 },
  "Jaylen Wright": { value: 54, pos: "RB", team: "MIA", age: 23 },
  "Blake Corum": { value: 662, pos: "RB", team: "LAR", age: 25 },
  "Kendre Miller": { value: 36, pos: "RB", team: "NO", age: 24 },
  "Nick Chubb": { value: 19, pos: "RB", team: "HOU", age: 30 },
  "Russell Wilson": { value: 309, pos: "QB", team: "NYG", age: null },
  "Deshaun Watson": { value: 3, pos: "QB", team: "CLE", age: null },
  "Shedeur Sanders": { value: 635, pos: "QB", team: "CLE", age: 24 },
  "Justin Fields": { value: 633, pos: "QB", team: "NYJ", age: 27 },
  "Tank Bigsby": { value: 108, pos: "RB", team: "PHI", age: 24 },
  "Elijah Mitchell": { value: 3, pos: "RB", team: null, age: 28 },
  "Jonnu Smith": { value: 23, pos: "TE", team: "PIT", age: 31 },
  "Josh Downs": { value: 540, pos: "WR", team: "IND", age: 25 },
  "Zach Ertz": { value: 24, pos: "TE", team: "WAS", age: 35 },
  "George Kittle": { value: 855, pos: "TE", team: "SF", age: 32 },
  "Mark Andrews": { value: 373, pos: "TE", team: "BAL", age: 30 },
  "Dallas Goedert": { value: 368, pos: "TE", team: "PHI", age: 31 },
  "Pat Freiermuth": { value: 103, pos: "TE", team: "PIT", age: 27 },
  "Isaiah Likely": { value: 214, pos: "TE", team: "BAL", age: 26 },
  "Jalen Milroe": { value: 356, pos: "QB", team: "SEA", age: 23 },
  "Quinn Ewers": { value: 111, pos: "QB", team: "MIA", age: 23 },
  "Dillon Gabriel": { value: 3, pos: "QB", team: "CLE", age: 25 },
};

// 2026 NFL Draft Pick Values (from DynastyProcess)
export const PICK_VALUES_2026: Record<string, number> = {
  "1.01": 5484,
  "1.02": 5173,
  "1.03": 4882,
  "1.04": 4609,
  "1.05": 4354,
  "1.06": 4115,
  "1.07": 3890,
  "1.08": 3679,
  "1.09": 3481,
  "1.10": 3296,
  "1.11": 3123,
  "1.12": 2961,
  "2.01": 2809,
  "2.02": 2666,
  "2.03": 2533,
  "2.04": 2408,
  "2.05": 2288,
  "2.06": 2177,
  "2.07": 2074,
  "2.08": 1975,
  "2.09": 1880,
  "2.10": 1791,
  "2.11": 1711,
  "2.12": 1641,
  "3.01": 1576,
  "3.02": 1515,
  "3.03": 1457,
  "3.04": 1404,
  "3.05": 1358,
  "3.06": 1314,
};

// 2027 Pick Values (from DynastyProcess)
export const PICK_VALUES_2027: Record<string, number> = {
  "early_1st": 4021,
  "mid_1st": 3201,
  "1st": 3209, // generic
  "late_1st": 2568,
  "early_2nd": 2080,
  "mid_2nd": 1700,
  "2nd": 1706, // generic
  "late_2nd": 1403,
  "early_3rd": 1190,
  "3rd": 1034,
};

// 2028 Pick Values
export const PICK_VALUES_2028: Record<string, number> = {
  "1st": 2567,
  "2nd": 1364,
  "3rd": 827,
};

// 2026 NFL Draft Prospects (NOT YET DRAFTED - based on PFF Big Board Feb 2026)
// These are players who will be in the April 2026 NFL Draft
export const PROSPECTS_2026 = [
  // Fantasy-Relevant Prospects (actual 2026 class)
  { name: "Jeremiyah Love", position: "RB", college: "Notre Dame", consensus: 1, notes: "RB1 of the class. Elite athleticism - speed, burst, agility. Natural pass catcher. Power game still developing. First-round talent." },
  { name: "Jordyn Tyson", position: "WR", college: "Arizona State", consensus: 2, notes: "Sun Devils' top playmaker. Smaller but plays strong. Great contested catches. Day 1-2 pick projection." },
  { name: "Makai Lemon", position: "WR", college: "USC", consensus: 3, notes: "Devastating quickness. Elite footwork, acceleration. Lacks size but extremely productive. Day 2 pick." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 4, notes: "Long frame, big catch radius. Good blocker. Needs more twitch vs press." },
  { name: "Denzel Boston", position: "WR", college: "Washington", consensus: 5, notes: "Smooth for a big receiver. Quick releases, good route cuts. Creates chunk plays." },
  { name: "Cam Skattebo", position: "RB", college: "Arizona State", consensus: 6, notes: "Physical runner with excellent hands. Older prospect but productive." },
  { name: "Devin Neal", position: "RB", college: "Kansas", consensus: 7, notes: "Productive workhorse. Solid floor, limited ceiling. Day 2-3 pick." },
  { name: "Dylan Sampson", position: "RB", college: "Tennessee", consensus: 8, notes: "Quick, shifty. Good in space. Smaller frame." },
  { name: "Ty Simpson", position: "QB", college: "Alabama", consensus: 9, notes: "Foundational NFL tools - mobility, escapability. Developmental. Must improve processing." },
  { name: "Fernando Mendoza", position: "QB", college: "Indiana", consensus: 10, notes: "Good size, arm strength. Nice touch. Breaks down under pressure." },
  { name: "Kenyon Sadiq", position: "TE", college: "Oregon", consensus: 11, notes: "Great size/athleticism combo. Deployed like big receiver. Day 2 pick potential." },
  { name: "Kaleb Johnson", position: "RB", college: "Iowa", consensus: 12, notes: "Explosive runner. Breakaway speed. Boom-bust profile." },
  { name: "Jayden Higgins", position: "WR", college: "Iowa State", consensus: 13, notes: "Big body red zone threat. 6'4\". Limited separation." },
  { name: "Terrance Ferguson", position: "TE", college: "Oregon", consensus: 14, notes: "Athletic TE prospect. Day 3 pick." },
];

// 2027 NFL Draft Prospects (PROJECTIONS - current underclassmen)
export const PROSPECTS_2027 = [
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "GENERATIONAL. All-American as freshman. 1,200+ yards year 1. 6'3\", elite speed. Best WR prospect in years." },
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 2, notes: "Manning bloodlines. Elite arm talent, poise. Could be QB1 if he declares." },
  { name: "Ryan Williams", position: "WR", college: "Alabama", consensus: 3, notes: "Electric freshman. Game-breaking speed. Creates chunk plays consistently." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 4, notes: "5-star recruit. Big arm, mobility. Early in development." },
  { name: "Gunnar Helm", position: "TE", college: "Texas", consensus: 5, notes: "Athletic TE with good production." },
  { name: "Dane Key", position: "WR", college: "Kentucky", consensus: 6, notes: "Productive. Good route runner. NFL bloodlines." },
  { name: "DJ Giddens", position: "RB", college: "Kansas State", consensus: 7, notes: "Explosive runner with receiving ability." },
  { name: "Nate Frazier", position: "RB", college: "Georgia", consensus: 8, notes: "Talented back. Will get his chance." },
  { name: "Julian Lewis", position: "QB", college: "Colorado", consensus: 9, notes: "Deion's next QB. Young but talented arm." },
];

// Get player value by Sleeper ID (lookup via name)
export function getPlayerValue(sleeperId: string, playerName?: string): { value: number; tier: string } {
  // If we have a name, try to find it in our database
  if (playerName) {
    const data = PLAYER_VALUES_BY_NAME[playerName];
    if (data) {
      const tier = data.value >= 6000 ? "Elite" : 
                   data.value >= 4000 ? "Star" : 
                   data.value >= 2000 ? "Starter" : 
                   data.value >= 500 ? "Flex" : "Bench";
      return { value: data.value, tier };
    }
  }
  
  // Default fallback for unknown players
  return { value: 100, tier: "Bench" };
}

// Get pick value
export function getPickValue(season: string, round: number, pick?: number): number {
  if (season === "2026" && pick) {
    const key = `${round}.${pick.toString().padStart(2, "0")}`;
    return PICK_VALUES_2026[key] || (round === 1 ? 3500 : round === 2 ? 2000 : 1200);
  } else if (season === "2027") {
    // Without specific pick, use generic
    return round === 1 ? PICK_VALUES_2027["1st"] : 
           round === 2 ? PICK_VALUES_2027["2nd"] : 
           PICK_VALUES_2027["3rd"] || 1034;
  } else if (season === "2028") {
    return round === 1 ? PICK_VALUES_2028["1st"] : 
           round === 2 ? PICK_VALUES_2028["2nd"] : 
           PICK_VALUES_2028["3rd"] || 827;
  }
  return 500;
}

// Calculate team phase recommendation - ROSTER VALUE ONLY
export function recommendPhase(
  rosterValue: number,
  avgAge: number,
  leagueRank: number,
  wins: number,
  losses: number
): { phase: "tank" | "retool" | "contend"; reason: string } {
  // Based on roster value only
  const isHighValue = rosterValue > 50000;
  const isTopThird = leagueRank <= 4;
  const hasWinningRecord = wins > losses;
  
  const isLowValue = rosterValue < 30000;
  const isBottomThird = leagueRank >= 9;
  
  if (isHighValue && isTopThird) {
    return { phase: "contend", reason: `Elite roster (${rosterValue.toLocaleString()} value, #${leagueRank} in league). Window is OPEN.` };
  } else if (isLowValue || isBottomThird) {
    return { phase: "tank", reason: `Roster ranks #${leagueRank} (${rosterValue.toLocaleString()} value). Accumulate picks and youth.` };
  } else {
    return { phase: "retool", reason: `Middle-tier roster (#${leagueRank}, ${rosterValue.toLocaleString()} value). Look for value trades.` };
  }
}
