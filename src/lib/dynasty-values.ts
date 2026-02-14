// Dynasty Superflex Values - Updated Feb 14, 2026
// Sources: Sharp Football Analysis, KeepTradeCut, FantasyPros consensus
// Scale: 10000 = #1 overall asset

export const PLAYER_VALUES_BY_NAME: Record<string, { value: number; pos: string; team: string | null; age: number | null }> = {
  // ═══════════════════════════════════════════════════════════
  // TIER 1: ELITE (9000+) - Cornerstone assets
  // ═══════════════════════════════════════════════════════════
  "Josh Allen": { value: 9998, pos: "QB", team: "BUF", age: 29.7 },
  "Bijan Robinson": { value: 9950, pos: "RB", team: "ATL", age: 24.6 },
  "Ja'Marr Chase": { value: 9900, pos: "WR", team: "CIN", age: 26.5 },
  "Jayden Daniels": { value: 9850, pos: "QB", team: "WAS", age: 25.7 },
  "Lamar Jackson": { value: 9800, pos: "QB", team: "BAL", age: 29.7 },
  "Patrick Mahomes II": { value: 9750, pos: "QB", team: "KC", age: 30.9 },
  "Drake Maye": { value: 9700, pos: "QB", team: "NE", age: 24.0 },
  "Joe Burrow": { value: 9650, pos: "QB", team: "CIN", age: 29.7 },
  "Jahmyr Gibbs": { value: 9600, pos: "RB", team: "DET", age: 24.4 },
  "Justin Jefferson": { value: 9550, pos: "WR", team: "MIN", age: 27.2 },
  "Jaxon Smith-Njigba": { value: 9500, pos: "WR", team: "SEA", age: 24.5 },
  "Puka Nacua": { value: 9450, pos: "WR", team: "LAR", age: 25.3 },
  
  // ═══════════════════════════════════════════════════════════
  // TIER 2: STARS (7000-8999) - Building blocks
  // ═══════════════════════════════════════════════════════════
  "Ashton Jeanty": { value: 8800, pos: "RB", team: "LV", age: 22.7 },
  "Malik Nabers": { value: 8600, pos: "WR", team: "NYG", age: 23.2 },
  "CeeDee Lamb": { value: 8400, pos: "WR", team: "DAL", age: 27.4 },
  "Amon-Ra St. Brown": { value: 8300, pos: "WR", team: "DET", age: 26.9 },
  "Nico Collins": { value: 8200, pos: "WR", team: "HOU", age: 27.5 },
  "Justin Herbert": { value: 8100, pos: "QB", team: "LAC", age: 28.5 },
  "Caleb Williams": { value: 8000, pos: "QB", team: "CHI", age: 24.8 },
  "Jalen Hurts": { value: 7900, pos: "QB", team: "PHI", age: 28.1 },
  "Brock Bowers": { value: 7800, pos: "TE", team: "LV", age: 23.7 },
  "Trey McBride": { value: 7700, pos: "TE", team: "ARI", age: 26.8 },
  "Jonathan Taylor": { value: 7600, pos: "RB", team: "IND", age: 27.6 },
  "Drake London": { value: 7500, pos: "WR", team: "ATL", age: 25.1 },
  "De'Von Achane": { value: 7400, pos: "RB", team: "MIA", age: 24.9 },
  "Jaxson Dart": { value: 7350, pos: "QB", team: "NYG", age: 23.3 },
  "Brock Purdy": { value: 7300, pos: "QB", team: "SF", age: 26.7 },
  "Jordan Love": { value: 7200, pos: "QB", team: "GB", age: 27.8 },
  "Ladd McConkey": { value: 7100, pos: "WR", team: "LAC", age: 24.8 },
  "Tetairoa McMillan": { value: 7050, pos: "WR", team: "CAR", age: 23.4 },
  "Emeka Egbuka": { value: 7000, pos: "WR", team: "TB", age: 23.9 },
  
  // ═══════════════════════════════════════════════════════════
  // TIER 3: STARTERS (5000-6999) - Quality assets
  // ═══════════════════════════════════════════════════════════
  "Omarion Hampton": { value: 6900, pos: "RB", team: "LAC", age: 23.5 },
  "James Cook III": { value: 6850, pos: "RB", team: "BUF", age: 26.9 },
  "George Pickens": { value: 6800, pos: "WR", team: "DAL", age: 25.5 },
  "Rashee Rice": { value: 6750, pos: "WR", team: "KC", age: 25.4 },
  "C.J. Stroud": { value: 6700, pos: "QB", team: "HOU", age: 24.9 },
  "Trevor Lawrence": { value: 6650, pos: "QB", team: "JAC", age: 26.9 },
  "Bo Nix": { value: 6600, pos: "QB", team: "DEN", age: 26.5 },
  "Chris Olave": { value: 6550, pos: "WR", team: "NO", age: 26.2 },
  "Rome Odunze": { value: 6500, pos: "WR", team: "CHI", age: 24.2 },
  "Garrett Wilson": { value: 6450, pos: "WR", team: "NYJ", age: 26.1 },
  "Kyler Murray": { value: 6400, pos: "QB", team: "ARI", age: 29.1 },
  "Baker Mayfield": { value: 6350, pos: "QB", team: "TB", age: 31.4 },
  "Breece Hall": { value: 6300, pos: "RB", team: "NYJ", age: 25.3 },
  "Brian Thomas Jr.": { value: 6250, pos: "WR", team: "JAC", age: 23.9 },
  "Colston Loveland": { value: 6200, pos: "TE", team: "CHI", age: 22.4 },
  "Zay Flowers": { value: 6150, pos: "WR", team: "BAL", age: 26.0 },
  "Tee Higgins": { value: 6100, pos: "WR", team: "CIN", age: 27.6 },
  "Kenneth Walker III": { value: 6050, pos: "RB", team: "SEA", age: 25.9 },
  "TreVeyon Henderson": { value: 6000, pos: "RB", team: "NE", age: 23.9 },
  "Jameson Williams": { value: 5950, pos: "WR", team: "DET", age: 25.4 },
  "Saquon Barkley": { value: 5900, pos: "RB", team: "PHI", age: 29.6 },
  "Marvin Harrison Jr.": { value: 5850, pos: "WR", team: "ARI", age: 24.1 },
  "DeVonta Smith": { value: 5800, pos: "WR", team: "PHI", age: 27.8 },
  "Sam Darnold": { value: 5750, pos: "QB", team: "SEA", age: 29.2 },
  "Josh Jacobs": { value: 5700, pos: "RB", team: "GB", age: 28.6 },
  "Dak Prescott": { value: 5650, pos: "QB", team: "DAL", age: 33.1 },
  "Jaylen Waddle": { value: 5600, pos: "WR", team: "MIA", age: 27.8 },
  "Christian Watson": { value: 5550, pos: "WR", team: "GB", age: 27.3 },
  "A.J. Brown": { value: 5500, pos: "WR", team: "PHI", age: 29.2 },
  "DK Metcalf": { value: 5450, pos: "WR", team: "PIT", age: 28.7 },
  "Christian McCaffrey": { value: 5400, pos: "RB", team: "SF", age: 30.2 },
  "Luther Burden III": { value: 5350, pos: "WR", team: "CHI", age: 22.7 },
  "Chase Brown": { value: 5300, pos: "RB", team: "CIN", age: 26.4 },
  "Tyler Warren": { value: 5250, pos: "TE", team: "IND", age: 24.3 },
  "Jordan Addison": { value: 5200, pos: "WR", team: "MIN", age: 24.6 },
  "Quentin Johnston": { value: 5150, pos: "WR", team: "LAC", age: 25.0 },
  "Tucker Kraft": { value: 5100, pos: "TE", team: "GB", age: 25.8 },
  "Josh Downs": { value: 5050, pos: "WR", team: "IND", age: 25.1 },
  "Bucky Irving": { value: 5000, pos: "RB", team: "TB", age: 24.0 },
  
  // ═══════════════════════════════════════════════════════════
  // TIER 4: FLEX (3000-4999) - Solid contributors
  // ═══════════════════════════════════════════════════════════
  "Quinshon Judkins": { value: 4950, pos: "RB", team: "CLE", age: 22.8 },
  "Travis Hunter": { value: 4900, pos: "WR", team: "JAC", age: 23.3 },
  "Kyren Williams": { value: 4850, pos: "RB", team: "LAR", age: 26.0 },
  "Xavier Worthy": { value: 4800, pos: "WR", team: "KC", age: 23.3 },
  "Derrick Henry": { value: 4750, pos: "RB", team: "BAL", age: 32.7 },
  "Cam Skattebo": { value: 4700, pos: "RB", team: "NYG", age: 24.6 },
  "Matthew Golden": { value: 4650, pos: "WR", team: "GB", age: 23.1 },
  "RJ Harvey": { value: 4600, pos: "RB", team: "DEN", age: 25.6 },
  "Ricky Pearsall": { value: 4550, pos: "WR", team: "SF", age: 26.0 },
  "Travis Etienne Jr.": { value: 4500, pos: "RB", team: "JAC", age: 27.6 },
  "Sam LaPorta": { value: 4450, pos: "TE", team: "DET", age: 25.6 },
  "Harold Fannin Jr.": { value: 4400, pos: "TE", team: "CLE", age: 22.1 },
  "D'Andre Swift": { value: 4350, pos: "RB", team: "CHI", age: 27.6 },
  "Brandon Aiyuk": { value: 4300, pos: "WR", team: "SF", age: 28.5 },
  "Bryce Young": { value: 4250, pos: "QB", team: "CAR", age: 25.1 },
  "Jaylen Warren": { value: 4200, pos: "RB", team: "PIT", age: 27.8 },
  "Kyle Pitts Sr.": { value: 4150, pos: "TE", team: "ATL", age: 25.9 },
  "Javonte Williams": { value: 4100, pos: "RB", team: "DAL", age: 26.4 },
  "Tyler Shough": { value: 4050, pos: "QB", team: "NO", age: 26.9 },
  "Courtland Sutton": { value: 4000, pos: "WR", team: "DEN", age: 30.9 },
  "Jayden Reed": { value: 3950, pos: "WR", team: "GB", age: 26.3 },
  "Jonathon Brooks": { value: 3900, pos: "RB", team: "CAR", age: 23.1 },
  "Michael Pittman Jr.": { value: 3850, pos: "WR", team: "IND", age: 28.9 },
  "DJ Moore": { value: 3800, pos: "WR", team: "CHI", age: 29.4 },  // UPDATED - was too low
  "Terry McLaurin": { value: 3750, pos: "WR", team: "WAS", age: 31.0 },
  "George Kittle": { value: 3700, pos: "TE", team: "SF", age: 32.9 },
  "J.J. McCarthy": { value: 3650, pos: "QB", team: "MIN", age: 23.6 },  // UPDATED - young starting QB
  "Jayden Higgins": { value: 3600, pos: "WR", team: "HOU", age: 23.7 },
  "Alec Pierce": { value: 3550, pos: "WR", team: "IND", age: 26.3 },
  "Malik Willis": { value: 3500, pos: "QB", team: "GB", age: 27.3 },
  "Zach Charbonnet": { value: 3450, pos: "RB", team: "SEA", age: 25.6 },
  "Dalton Kincaid": { value: 3400, pos: "TE", team: "BUF", age: 26.9 },
  "Bhayshul Tuten": { value: 3350, pos: "RB", team: "JAX", age: 23.5 },
  "Rhamondre Stevenson": { value: 3300, pos: "RB", team: "NE", age: 28.5 },
  "J.K. Dobbins": { value: 3250, pos: "RB", team: "DEN", age: 27.7 },
  "Khalil Shakir": { value: 3200, pos: "WR", team: "BUF", age: 26.6 },
  "Oronde Gadsden II": { value: 3150, pos: "TE", team: "LAC", age: 23.2 },  // UPDATED - young TE with upside
  "Blake Corum": { value: 3100, pos: "RB", team: "LAR", age: 25.8 },
  "Woody Marks": { value: 3050, pos: "RB", team: "HOU", age: 25.7 },
  "Tyrone Tracy": { value: 3000, pos: "RB", team: "NYG", age: 26.8 },
  
  // ═══════════════════════════════════════════════════════════
  // TIER 5: BENCH (1500-2999) - Depth pieces
  // ═══════════════════════════════════════════════════════════
  "Jake Ferguson": { value: 2950, pos: "TE", team: "DAL", age: 27.6 },
  "Wan'Dale Robinson": { value: 2900, pos: "WR", team: "NYG", age: 25.6 },
  "Chuba Hubbard": { value: 2850, pos: "RB", team: "CAR", age: 27.1 },
  "Brenton Strange": { value: 2800, pos: "TE", team: "JAX", age: 25.7 },
  "Tyreek Hill": { value: 2750, pos: "WR", team: "MIA", age: 32.5 },
  "Davante Adams": { value: 2700, pos: "WR", team: "LAR", age: 33.7 },
  "Stefon Diggs": { value: 2650, pos: "WR", team: "NE", age: 32.8 },
  "Rashid Shaheed": { value: 2600, pos: "WR", team: "SEA", age: 28.0 },
  "Jerry Jeudy": { value: 2550, pos: "WR", team: "CLE", age: 27.4 },
  "Tony Pollard": { value: 2500, pos: "RB", team: "TEN", age: 29.3 },
  "David Njoku": { value: 2450, pos: "TE", team: "CLE", age: 30.1 },
  "Tyjae Spears": { value: 2400, pos: "RB", team: "TEN", age: 25.2 },
  "Terrance Ferguson": { value: 2350, pos: "TE", team: "LAR", age: 23.6 },
  "Michael Wilson": { value: 2300, pos: "WR", team: "ARI", age: 26.5 },
  "Cam Ward": { value: 2250, pos: "QB", team: "TEN", age: 24.3 },
  "Kayshon Boutte": { value: 2200, pos: "WR", team: "NE", age: 24.3 },
  "Jakobi Meyers": { value: 2150, pos: "WR", team: "JAX", age: 29.8 },
  "Adonai Mitchell": { value: 2100, pos: "WR", team: "IND", age: 24.9 },
  "Tyler Allgeier": { value: 2050, pos: "RB", team: "ATL", age: 26.4 },
  "AJ Barner": { value: 2000, pos: "TE", team: "SEA", age: 24.3 },
  "Jauan Jennings": { value: 1950, pos: "WR", team: "SF", age: 29.1 },
  "Kyle Monangai": { value: 1900, pos: "RB", team: "CHI", age: 24.5 },
  "Deebo Samuel": { value: 1850, pos: "WR", team: "WAS", age: 30.6 },
  "Isaiah Likely": { value: 1800, pos: "TE", team: "BAL", age: 26.4 },
  "Chris Godwin": { value: 1750, pos: "WR", team: "TB", age: 30.5 },
  "Mike Evans": { value: 1700, pos: "WR", team: "TB", age: 33.0 },
  "David Montgomery": { value: 1650, pos: "RB", team: "DET", age: 29.2 },
  "Trey Benson": { value: 1600, pos: "RB", team: "ARI", age: 24.1 },
  "Mason Taylor": { value: 1550, pos: "TE", team: "NYJ", age: 22.3 },
  "Calvin Ridley": { value: 1500, pos: "WR", team: "TEN", age: 31.7 },
  
  // ═══════════════════════════════════════════════════════════
  // TIER 6: ROSTER CLOGGERS (500-1499)
  // ═══════════════════════════════════════════════════════════
  "Romeo Doubs": { value: 1450, pos: "WR", team: "GB", age: 26.4 },
  "Jacory Croskey-Merritt": { value: 1400, pos: "RB", team: "WAS", age: 25.4 },
  "Tre Harris": { value: 1350, pos: "WR", team: "LAC", age: 24.5 },
  "Jalen Coker": { value: 1300, pos: "WR", team: "CAR", age: 24.8 },
  "Rico Dowdle": { value: 1250, pos: "RB", team: "CAR", age: 28.2 },
  "Dylan Sampson": { value: 1200, pos: "RB", team: "CLE", age: 22.0 },
  "Darnell Mooney": { value: 1150, pos: "WR", team: "ATL", age: 28.8 },
  "Tua Tagovailoa": { value: 1100, pos: "QB", team: "MIA", age: 28.5 },  // Concussion history tanks value
  "Sean Tucker": { value: 1050, pos: "RB", team: "TB", age: 24.9 },
  "Kaleb Johnson": { value: 1000, pos: "RB", team: "PIT", age: 23.0 },
  "Rashod Bateman": { value: 950, pos: "WR", team: "BAL", age: 26.8 },
  "Elijah Arroyo": { value: 900, pos: "TE", team: "SEA", age: 23.4 },
  "Tank Dell": { value: 850, pos: "WR", team: "HOU", age: 26.8 },
  "Juwan Johnson": { value: 800, pos: "TE", team: "NO", age: 30.0 },
  "Rachaad White": { value: 750, pos: "RB", team: "TB", age: 27.6 },
  "Theo Johnson": { value: 700, pos: "TE", team: "NYG", age: 25.5 },
  "Kenneth Gainwell": { value: 650, pos: "RB", team: "PIT", age: 27.5 },
  "Jaydon Blue": { value: 600, pos: "RB", team: "DAL", age: 22.6 },
  "Jordan Mason": { value: 550, pos: "RB", team: "MIN", age: 27.3 },
  "Braelon Allen": { value: 500, pos: "RB", team: "NYJ", age: 22.6 },
  
  // ═══════════════════════════════════════════════════════════
  // LOWER TIER (< 500)
  // ═══════════════════════════════════════════════════════════
  "Keaton Mitchell": { value: 450, pos: "RB", team: "BAL", age: 24.6 },
  "T.J. Hockenson": { value: 400, pos: "TE", team: "MIN", age: 29.2 },
  "Troy Franklin": { value: 350, pos: "WR", team: "DEN", age: 23.6 },
  "Jaylin Noel": { value: 300, pos: "WR", team: "HOU", age: 24.0 },
  "Anthony Richardson Sr.": { value: 250, pos: "QB", team: "IND", age: 24.3 },
  "Mark Andrews": { value: 200, pos: "TE", team: "BAL", age: 31.0 },
  "Michael Penix Jr.": { value: 150, pos: "QB", team: "ATL", age: 26.5 },
  "Shedeur Sanders": { value: 100, pos: "QB", team: "CLE", age: 24.6 },
  "Geno Smith": { value: 75, pos: "QB", team: "LV", age: 35.9 },
  "Justin Fields": { value: 50, pos: "QB", team: "NYJ", age: 27.5 },
  "Deshaun Watson": { value: 25, pos: "QB", team: "CLE", age: 30.9 },
  "Aaron Rodgers": { value: 10, pos: "QB", team: "PIT", age: 42.7 },
};

// ═══════════════════════════════════════════════════════════
// 2026 NFL Draft Pick Values
// ═══════════════════════════════════════════════════════════
export const PICK_VALUES_2026: Record<string, number> = {
  "1.01": 7000, "1.02": 6600, "1.03": 6200, "1.04": 5800, "1.05": 5400, "1.06": 5000,
  "1.07": 4700, "1.08": 4400, "1.09": 4100, "1.10": 3800, "1.11": 3500, "1.12": 3200,
  "2.01": 3000, "2.02": 2800, "2.03": 2600, "2.04": 2400, "2.05": 2200, "2.06": 2000,
  "2.07": 1900, "2.08": 1800, "2.09": 1700, "2.10": 1600, "2.11": 1500, "2.12": 1400,
  "3.01": 1300, "3.02": 1200, "3.03": 1100, "3.04": 1000, "3.05": 900, "3.06": 800,
};

// 2027 Pick Values (discounted ~20% for uncertainty)
export const PICK_VALUES_2027: Record<string, number> = {
  "early_1st": 5600, "mid_1st": 4500, "1st": 4800, "late_1st": 3600,
  "early_2nd": 2400, "mid_2nd": 2000, "2nd": 2100, "late_2nd": 1600,
  "early_3rd": 1200, "3rd": 1000, "late_3rd": 800,
};

// 2028 Pick Values (discounted ~35% for uncertainty)
export const PICK_VALUES_2028: Record<string, number> = {
  "1st": 3200, "2nd": 1400, "3rd": 700,
};

// ═══════════════════════════════════════════════════════════
// TEAM OUTLOOK 2026 - For projecting future pick values
// Based on current roster strength, age, cap situation
// ═══════════════════════════════════════════════════════════
export const TEAM_OUTLOOK_2026: Record<string, { outlook: 'strong' | 'average' | 'weak' | 'rebuilding'; pickMultiplier: number; notes: string }> = {
  // STRONG TEAMS (picks worth less - likely late)
  "DET": { outlook: "strong", pickMultiplier: 0.75, notes: "Championship window open. Young core." },
  "BUF": { outlook: "strong", pickMultiplier: 0.75, notes: "Josh Allen in prime. Perennial contender." },
  "KC": { outlook: "strong", pickMultiplier: 0.75, notes: "Mahomes era continues." },
  "BAL": { outlook: "strong", pickMultiplier: 0.80, notes: "Lamar Jackson MVP caliber. Elite roster." },
  "PHI": { outlook: "strong", pickMultiplier: 0.80, notes: "Loaded roster, win-now mode." },
  "SF": { outlook: "strong", pickMultiplier: 0.80, notes: "Contender but aging in spots." },
  "CIN": { outlook: "strong", pickMultiplier: 0.85, notes: "Burrow/Chase stack is elite." },
  
  // AVERAGE TEAMS (picks worth face value)
  "WAS": { outlook: "average", pickMultiplier: 1.00, notes: "Jayden Daniels ascending. Building." },
  "MIN": { outlook: "average", pickMultiplier: 1.00, notes: "JJ McCarthy developing. Playoff caliber." },
  "LAC": { outlook: "average", pickMultiplier: 1.00, notes: "Herbert weapons loading." },
  "GB": { outlook: "average", pickMultiplier: 1.00, notes: "Young and improving." },
  "HOU": { outlook: "average", pickMultiplier: 1.00, notes: "Stroud figuring it out." },
  "TB": { outlook: "average", pickMultiplier: 1.00, notes: "Baker ball continues." },
  "ATL": { outlook: "average", pickMultiplier: 1.00, notes: "Bijan + offense cooking." },
  "DEN": { outlook: "average", pickMultiplier: 1.00, notes: "Bo Nix leading improvement." },
  "SEA": { outlook: "average", pickMultiplier: 1.05, notes: "JSN leading new era." },
  "LAR": { outlook: "average", pickMultiplier: 1.05, notes: "Puka/McVay combo works." },
  "PIT": { outlook: "average", pickMultiplier: 1.05, notes: "QB situation unclear." },
  "MIA": { outlook: "average", pickMultiplier: 1.10, notes: "Tua health concerns." },
  "ARI": { outlook: "average", pickMultiplier: 1.10, notes: "Kyler weapons improving." },
  "CHI": { outlook: "average", pickMultiplier: 1.10, notes: "Caleb Williams developing." },
  
  // WEAK TEAMS (picks worth more - likely early)
  "NYJ": { outlook: "weak", pickMultiplier: 1.20, notes: "Perpetual rebuild mode." },
  "IND": { outlook: "weak", pickMultiplier: 1.15, notes: "JT aging, QB questions." },
  "JAC": { outlook: "weak", pickMultiplier: 1.20, notes: "Trevor Lawrence situation unclear." },
  "NO": { outlook: "weak", pickMultiplier: 1.20, notes: "Aging roster, cap hell." },
  "DAL": { outlook: "weak", pickMultiplier: 1.15, notes: "Post-Dak uncertainty." },
  "CLE": { outlook: "weak", pickMultiplier: 1.25, notes: "Watson disaster continuing." },
  "TEN": { outlook: "weak", pickMultiplier: 1.20, notes: "Full rebuild mode." },
  "NE": { outlook: "weak", pickMultiplier: 1.15, notes: "Maye building but takes time." },
  
  // REBUILDING TEAMS (picks worth premium - likely top picks)
  "NYG": { outlook: "rebuilding", pickMultiplier: 1.30, notes: "Bottom feeder for picks." },
  "CAR": { outlook: "rebuilding", pickMultiplier: 1.30, notes: "Bryce Young project continues." },
  "LV": { outlook: "rebuilding", pickMultiplier: 1.25, notes: "Jeanty bright spot, rest is mess." },
};

// ═══════════════════════════════════════════════════════════
// 2026 NFL Draft Prospects (April 2026)
// ═══════════════════════════════════════════════════════════
export const PROSPECTS_2026 = [
  { name: "Fernando Mendoza", position: "QB", college: "Indiana", consensus: 1, notes: "UNANIMOUS QB1. 41 TD/6 INT. Pocket passer." },
  { name: "Jeremiyah Love", position: "RB", college: "Notre Dame", consensus: 2, notes: "UNANIMOUS RB1. 6.9 YPC, 18 TDs." },
  { name: "Carnell Tate", position: "WR", college: "Ohio State", consensus: 3, notes: "WR1 in class. Elite route runner." },
  { name: "Jordyn Tyson", position: "WR", college: "Arizona State", consensus: 4, notes: "Speed/size combo." },
  { name: "Makai Lemon", position: "WR", college: "USC", consensus: 5, notes: "Volume king. 79 catches." },
  { name: "Kenyon Sadiq", position: "TE", college: "Oregon", consensus: 6, notes: "TE1. 8 TDs leads TEs." },
  { name: "Ty Simpson", position: "QB", college: "Alabama", consensus: 7, notes: "Dual-threat. 28 TD/5 INT." },
  { name: "Denzel Boston", position: "WR", college: "Washington", consensus: 8, notes: "6'4\" red zone threat." },
  { name: "Trinidad Chambliss", position: "QB", college: "Ole Miss", consensus: 9, notes: "Russell Wilson comp." },
  { name: "Jadarian Price", position: "RB", college: "Notre Dame", consensus: 10, notes: "Versatile. 6.0 YPC." },
  { name: "Nicholas Singleton", position: "RB", college: "Penn State", consensus: 11, notes: "Power runner." },
  { name: "KC Concepcion", position: "WR", college: "Texas A&M", consensus: 12, notes: "Slot specialist." },
];

// ═══════════════════════════════════════════════════════════
// 2027 NFL Draft Prospects (Projections)
// ═══════════════════════════════════════════════════════════
export const PROSPECTS_2027 = [
  { name: "Jeremiah Smith", position: "WR", college: "Ohio State", consensus: 1, notes: "GENERATIONAL. 27 TDs in 2 seasons." },
  { name: "Arch Manning", position: "QB", college: "Texas", consensus: 2, notes: "Potential #1 overall." },
  { name: "Dante Moore", position: "QB", college: "Oregon", consensus: 3, notes: "Returned from 2026. Could be QB1." },
  { name: "Ahmad Hardy", position: "RB", college: "Missouri", consensus: 4, notes: "RB1. 1,649 yards, 16 TDs." },
  { name: "Keelon Russell", position: "QB", college: "Alabama", consensus: 5, notes: "Top-5 recruit. Dynamic." },
  { name: "Bryce Underwood", position: "QB", college: "Michigan", consensus: 6, notes: "Five-star QB." },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getPlayerValue(sleeperId: string, playerName?: string): { value: number; tier: string } {
  if (playerName) {
    let data = PLAYER_VALUES_BY_NAME[playerName];
    if (!data) {
      const normalized = playerName.replace(/\s+(Jr\.?|Sr\.?|II|III|IV)$/i, "").replace(/['.]/, "").trim();
      data = PLAYER_VALUES_BY_NAME[normalized];
    }
    if (data) {
      const tier = data.value >= 9000 ? "Elite" : 
                   data.value >= 7000 ? "Star" : 
                   data.value >= 5000 ? "Starter" :
                   data.value >= 3000 ? "Flex" : 
                   data.value >= 1500 ? "Bench" : "Clogger";
      return { value: data.value, tier };
    }
  }
  return { value: 100, tier: "Unknown" };
}

export function getPickValue(season: string, round: number, pick?: number): number {
  if (season === "2026" && pick) {
    const key = `${round}.${pick.toString().padStart(2, "0")}`;
    return PICK_VALUES_2026[key] || (round === 1 ? 4000 : round === 2 ? 2000 : 1000);
  } else if (season === "2027") {
    return round === 1 ? PICK_VALUES_2027["1st"] : round === 2 ? PICK_VALUES_2027["2nd"] : PICK_VALUES_2027["3rd"] || 1000;
  } else if (season === "2028") {
    return round === 1 ? PICK_VALUES_2028["1st"] : round === 2 ? PICK_VALUES_2028["2nd"] : PICK_VALUES_2028["3rd"] || 700;
  }
  return 500;
}

// Project future pick value based on team outlook
export function getProjectedPickValue(season: string, round: number, ownerTeam?: string): number {
  const baseValue = getPickValue(season, round);
  if (!ownerTeam) return baseValue;
  
  const outlook = TEAM_OUTLOOK_2026[ownerTeam];
  if (!outlook) return baseValue;
  
  return Math.round(baseValue * outlook.pickMultiplier);
}

export function recommendPhase(
  rosterValue: number,
  avgAge: number,
  leagueRank: number,
  wins: number,
  losses: number
): { phase: "tank" | "retool" | "contend"; reason: string } {
  const isHighValue = rosterValue > 70000;
  const isTopThird = leagueRank <= 4;
  const isLowValue = rosterValue < 40000;
  const isBottomThird = leagueRank >= 9;
  
  if (isHighValue && isTopThird) {
    return { phase: "contend", reason: `Elite roster (${rosterValue.toLocaleString()} value, #${leagueRank}). Window OPEN.` };
  } else if (isLowValue || isBottomThird) {
    return { phase: "tank", reason: `Roster ranks #${leagueRank} (${rosterValue.toLocaleString()} value). Accumulate picks.` };
  } else {
    return { phase: "retool", reason: `Middle-tier (#${leagueRank}, ${rosterValue.toLocaleString()} value). Find value trades.` };
  }
}

// ═══════════════════════════════════════════════════════════
// AGING CURVES (Research-Backed)
// ═══════════════════════════════════════════════════════════

export interface AgingCurveResult {
  adjustedValue: number;
  discountPercent: number;
  peakYearsLeft: number;
  phase: 'ascending' | 'peak' | 'declining' | 'cliff';
  note: string;
}

export function applyRBAgingCurve(currentValue: number, age: number): AgingCurveResult {
  const PEAK_START = 24;
  const PEAK_END = 27;
  const DISCOUNT_PER_YEAR = 0.15;
  const CLIFF_AGE = 29;
  
  if (age < PEAK_START) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'ascending', note: 'Pre-peak, ascending value' };
  } else if (age <= PEAK_END) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'peak', note: 'Peak years' };
  } else if (age < CLIFF_AGE) {
    const yearsOverPeak = age - PEAK_END;
    const discount = yearsOverPeak * DISCOUNT_PER_YEAR;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: Math.round(discount * 100), peakYearsLeft: 0, phase: 'declining', note: `${Math.round(discount * 100)}% age discount` };
  } else {
    const discount = 0.50;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: 50, peakYearsLeft: 0, phase: 'cliff', note: 'RB cliff reached' };
  }
}

export function applyWRAgingCurve(currentValue: number, age: number): AgingCurveResult {
  const PEAK_START = 25;
  const PEAK_END = 29;
  const DISCOUNT_PER_YEAR = 0.08;
  const CLIFF_AGE = 32;
  
  if (age < PEAK_START) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'ascending', note: 'Pre-peak, ascending value' };
  } else if (age <= PEAK_END) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'peak', note: 'Peak years' };
  } else if (age < CLIFF_AGE) {
    const yearsOverPeak = age - PEAK_END;
    const discount = yearsOverPeak * DISCOUNT_PER_YEAR;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: Math.round(discount * 100), peakYearsLeft: 0, phase: 'declining', note: `${Math.round(discount * 100)}% age discount` };
  } else {
    const discount = 0.35;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: 35, peakYearsLeft: 0, phase: 'cliff', note: 'WR cliff reached' };
  }
}

export function applyQBAgingCurve(currentValue: number, age: number): AgingCurveResult {
  const PEAK_START = 27;
  const PEAK_END = 34;
  const DISCOUNT_PER_YEAR = 0.05;
  
  if (age < PEAK_START) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'ascending', note: 'Pre-peak QB, developing' };
  } else if (age <= PEAK_END) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'peak', note: 'Prime QB years' };
  } else {
    const yearsOverPeak = age - PEAK_END;
    const discount = yearsOverPeak * DISCOUNT_PER_YEAR;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: Math.round(discount * 100), peakYearsLeft: 0, phase: 'declining', note: `${Math.round(discount * 100)}% age discount` };
  }
}

export function applyTEAgingCurve(currentValue: number, age: number): AgingCurveResult {
  const PEAK_START = 25;
  const PEAK_END = 30;
  const DISCOUNT_PER_YEAR = 0.07;
  
  if (age < PEAK_START) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'ascending', note: 'TE developing' };
  } else if (age <= PEAK_END) {
    return { adjustedValue: currentValue, discountPercent: 0, peakYearsLeft: PEAK_END - age, phase: 'peak', note: 'Peak TE years' };
  } else {
    const yearsOverPeak = age - PEAK_END;
    const discount = yearsOverPeak * DISCOUNT_PER_YEAR;
    return { adjustedValue: Math.round(currentValue * (1 - discount)), discountPercent: Math.round(discount * 100), peakYearsLeft: 0, phase: 'declining', note: `${Math.round(discount * 100)}% age discount` };
  }
}
