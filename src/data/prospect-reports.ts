// Dynasty Prospect Scouting Reports
// Author: Agent Drew | Last Updated: Feb 2026
// Sources: ESPN, CBS Sports, WalterFootball, DynastyProcess

export interface ProspectReport {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  school: string;
  draftYear: number;
  height: string;
  weight: number;
  projectedPick: string;
  dynastyTier: 'Elite' | 'Blue Chip' | 'Solid' | 'Upside' | 'Dart';
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C';
  
  stats?: {
    games?: number;
    recYds?: number;
    recTD?: number;
    rec?: number;
    rushYds?: number;
    rushTD?: number;
    passYds?: number;
    passTD?: number;
    int?: number;
    ypc?: number;
  };
  
  strengths: string[];
  weaknesses: string[];
  comps: string[];
  
  ceiling: string;
  floor: string;
  summary: string;
  
  idealFits: string[];
}

export const prospectReports: ProspectReport[] = [
  // ═══════════════════════════════════════════════════════════
  // 2026 NFL DRAFT CLASS (April 2026)
  // ═══════════════════════════════════════════════════════════
  
  // QUARTERBACKS
  {
    id: "2026_qb_mendoza",
    name: "Fernando Mendoza",
    position: "QB",
    school: "Indiana",
    draftYear: 2026,
    height: "6'5\"",
    weight: 225,
    projectedPick: "Top 5",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 16, passYds: 3535, passTD: 41, int: 6 },
    strengths: [
      "UNANIMOUS QB1 - pocket passer with elite processing",
      "Quick-game and RPO specialist",
      "72% completion rate, elite production"
    ],
    weaknesses: [
      "First year as full-time starter",
      "Needs development in deep ball accuracy"
    ],
    comps: ["Josh Allen", "Derek Carr"],
    ceiling: "Franchise QB, top-5 fantasy",
    floor: "High-floor starter with limited rushing",
    summary: "QB1 in a historically weak class. 41 TDs/6 INTs is elite. Quick processing translates day one.",
    idealFits: ["Raiders", "Browns", "Giants"]
  },
  
  {
    id: "2026_qb_simpson",
    name: "Ty Simpson",
    position: "QB",
    school: "Alabama",
    draftYear: 2026,
    height: "6'2\"",
    weight: 208,
    projectedPick: "Round 1-2",
    dynastyTier: "Solid",
    grade: "B+",
    stats: { games: 15, passYds: 3567, passTD: 28, int: 5 },
    strengths: [
      "Strong arm with dual-threat ability",
      "Proven winner at Alabama",
      "28 TD / 5 INT efficiency"
    ],
    weaknesses: [
      "Not elite arm talent for NFL standards",
      "Ceiling questions remain"
    ],
    comps: ["Dak Prescott", "Kirk Cousins"],
    ceiling: "Low-end QB1 with rushing floor",
    floor: "Safe backup/bridge starter",
    summary: "Pro-ready but limited upside. 64.5% completion is fine, not elite. Late 1st SF value.",
    idealFits: ["Jets", "Steelers", "Vikings"]
  },

  {
    id: "2026_qb_chambliss",
    name: "Trinidad Chambliss",
    position: "QB",
    school: "Ole Miss",
    draftYear: 2026,
    height: "6'0\"",
    weight: 195,
    projectedPick: "Round 1-2",
    dynastyTier: "Upside",
    grade: "B+",
    strengths: [
      "Russell Wilson comp - electric playmaker",
      "Undersized but plays big",
      "Dynamic dual-threat with arm talent"
    ],
    weaknesses: [
      "6'0\" - legitimate size concerns",
      "May appeal to 2027 class"
    ],
    comps: ["Russell Wilson", "Kyler Murray"],
    ceiling: "Dynamic fantasy QB1",
    floor: "Boom-bust starter",
    summary: "Electric playmaker with Wilson-like traits. Size is the only knock. High upside dart.",
    idealFits: ["Panthers", "Cardinals", "Broncos"]
  },

  {
    id: "2026_qb_allar",
    name: "Drew Allar",
    position: "QB",
    school: "Penn State",
    draftYear: 2026,
    height: "6'5\"",
    weight: 238,
    projectedPick: "Round 2",
    dynastyTier: "Upside",
    grade: "B",
    strengths: [
      "Big arm with ideal NFL size",
      "Developing rapidly",
      "Penn State pedigree"
    ],
    weaknesses: [
      "Still raw in processing",
      "Inconsistent accuracy"
    ],
    comps: ["Josh Allen (lite)", "Daniel Jones"],
    ceiling: "Starting NFL QB with upside",
    floor: "Backup/project",
    summary: "Raw tools and massive frame. Needs development but the arm talent is real.",
    idealFits: ["Saints", "Titans", "Colts"]
  },

  {
    id: "2026_qb_nussmeier",
    name: "Garrett Nussmeier",
    position: "QB",
    school: "LSU",
    draftYear: 2026,
    height: "6'2\"",
    weight: 210,
    projectedPick: "Round 2-3",
    dynastyTier: "Upside",
    grade: "B",
    strengths: [
      "Gunslinger mentality",
      "LSU QB factory production",
      "Aggressive downfield thrower"
    ],
    weaknesses: [
      "Decision-making lapses",
      "Turnover-prone"
    ],
    comps: ["Baker Mayfield", "Drew Lock"],
    ceiling: "Boom-bust starter",
    floor: "Backup with glimpses",
    summary: "Gunslinger with upside and risk. Will make big throws and bad decisions.",
    idealFits: ["Falcons", "Bears", "Texans"]
  },

  // RUNNING BACKS
  {
    id: "2026_rb_love",
    name: "Jeremiyah Love",
    position: "RB",
    school: "Notre Dame",
    draftYear: 2026,
    height: "6'0\"",
    weight: 214,
    projectedPick: "Top 10",
    dynastyTier: "Elite",
    grade: "A",
    stats: { games: 12, rushYds: 1372, rushTD: 18, ypc: 6.9 },
    strengths: [
      "UNANIMOUS RB1 - explosive game-breaker",
      "6.9 YPC (!), 18 rushing TDs",
      "Plus receiving ability, workhorse build"
    ],
    weaknesses: [
      "Not elite long speed (4.5+ forty)",
      "Pass protection needs refinement"
    ],
    comps: ["Josh Jacobs", "Alvin Kamara"],
    ceiling: "Top-5 dynasty RB, three-down back",
    floor: "Solid RB2 even in committee",
    summary: "Clear RB1 in the class. 6.9 YPC and 18 TDs is elite. 1.01-1.02 in 1QB formats.",
    idealFits: ["Commanders", "Titans", "Saints"]
  },
  
  {
    id: "2026_rb_price",
    name: "Jadarian Price",
    position: "RB",
    school: "Notre Dame",
    draftYear: 2026,
    height: "5'11\"",
    weight: 210,
    projectedPick: "Round 2-3",
    dynastyTier: "Solid",
    grade: "B+",
    stats: { games: 12, rushYds: 674, rushTD: 11, ypc: 6.0 },
    strengths: [
      "Versatile skill set",
      "6.0 YPC efficiency despite backup role",
      "11 TDs in limited touches"
    ],
    weaknesses: [
      "Split backfield production with Love",
      "Smaller frame concerns"
    ],
    comps: ["Jaylen Warren", "Tony Pollard"],
    ceiling: "High-end RB2 with receiving upside",
    floor: "Backup/committee back",
    summary: "Love's backup but efficient when used. Day 2 pick—late 1st/early 2nd dynasty value.",
    idealFits: ["Broncos", "Cardinals", "Bears"]
  },

  {
    id: "2026_rb_johnson",
    name: "Emmett Johnson",
    position: "RB",
    school: "Nebraska",
    draftYear: 2026,
    height: "5'10\"",
    weight: 225,
    projectedPick: "Round 3-4",
    dynastyTier: "Solid",
    grade: "B",
    strengths: [
      "Power back with contact balance",
      "Short-yardage specialist",
      "High motor"
    ],
    weaknesses: [
      "Limited receiving upside",
      "Not a home-run hitter"
    ],
    comps: ["David Montgomery", "Kareem Hunt"],
    ceiling: "Starting power back",
    floor: "Short-yardage specialist",
    summary: "Old-school power runner. Won't win leagues but provides steady production.",
    idealFits: ["Ravens", "Browns", "Steelers"]
  },

  {
    id: "2026_rb_coleman",
    name: "Jonah Coleman",
    position: "RB",
    school: "Washington",
    draftYear: 2026,
    height: "5'9\"",
    weight: 205,
    projectedPick: "Round 3-4",
    dynastyTier: "Upside",
    grade: "B",
    strengths: [
      "Elite burst and speed",
      "Home-run threat ability",
      "Improved vision in 2025"
    ],
    weaknesses: [
      "Smaller frame durability",
      "Between-the-tackles running"
    ],
    comps: ["De'Von Achane", "Raheem Mostert"],
    ceiling: "Speed-dependent RB1",
    floor: "Change-of-pace specialist",
    summary: "Electric speed but needs right system. High-upside day 3 dart.",
    idealFits: ["Dolphins", "Chiefs", "Bills"]
  },

  {
    id: "2026_rb_singleton",
    name: "Nicholas Singleton",
    position: "RB",
    school: "Penn State",
    draftYear: 2026,
    height: "6'0\"",
    weight: 220,
    projectedPick: "Round 2-3",
    dynastyTier: "Solid",
    grade: "B+",
    strengths: [
      "Elite contact balance",
      "Powerful through contact",
      "Complete skill set"
    ],
    weaknesses: [
      "Split backfield with Allen",
      "Not elite top-end speed"
    ],
    comps: ["Nick Chubb", "Derrick Henry (lite)"],
    ceiling: "Three-down power back",
    floor: "Solid committee RB",
    summary: "Physical runner with plus contact balance. Penn State RB room competition lowers stock.",
    idealFits: ["Bengals", "Packers", "Cowboys"]
  },

  {
    id: "2026_rb_claiborne",
    name: "Demond Claiborne",
    position: "RB",
    school: "Wake Forest",
    draftYear: 2026,
    height: "5'11\"",
    weight: 208,
    projectedPick: "Round 4-5",
    dynastyTier: "Dart",
    grade: "B-",
    strengths: [
      "Sleeper with receiving ability",
      "Good hands out of backfield",
      "Patient runner"
    ],
    weaknesses: [
      "Small-school competition level",
      "Limited NFL draft buzz"
    ],
    comps: ["James White", "Dion Lewis"],
    ceiling: "Pass-catching specialist RB2",
    floor: "3rd-down back",
    summary: "Under-the-radar sleeper. PPR upside in right system.",
    idealFits: ["Patriots", "Lions", "Vikings"]
  },

  // WIDE RECEIVERS
  {
    id: "2026_wr_tate",
    name: "Carnell Tate",
    position: "WR",
    school: "Ohio State",
    draftYear: 2026,
    height: "6'2\"",
    weight: 195,
    projectedPick: "Top 10",
    dynastyTier: "Elite",
    grade: "A",
    stats: { games: 11, rec: 51, recYds: 875, recTD: 9 },
    strengths: [
      "WR1 in the class - elite route runner",
      "17.2 YPR with 9 TDs",
      "Big-play ability from Ohio State"
    ],
    weaknesses: [
      "Could add more mass to frame",
      "Quiet freshman year"
    ],
    comps: ["Chris Olave", "Terry McLaurin"],
    ceiling: "Alpha WR1 with route-running dominance",
    floor: "High-floor WR2",
    summary: "Best route runner in class. 17.2 YPR proves big-play ability. Top-10 pick, mid-1st dynasty.",
    idealFits: ["Ravens", "Rams", "Patriots"]
  },

  {
    id: "2026_wr_tyson",
    name: "Jordyn Tyson",
    position: "WR",
    school: "Arizona State",
    draftYear: 2026,
    height: "6'2\"",
    weight: 200,
    projectedPick: "Top 15",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 9, rec: 61, recYds: 711, recTD: 8 },
    strengths: [
      "Speed and size combo",
      "8 TDs in 9 games - per-game monster",
      "Explosive playmaker"
    ],
    weaknesses: [
      "Limited sample (9 games)",
      "Route tree still developing"
    ],
    comps: ["CeeDee Lamb", "Terry McLaurin"],
    ceiling: "WR1 with deep threat ability",
    floor: "Boom-bust WR2",
    summary: "Per-game production is elite—8 TDs in 9 games. Small sample risk but talent is obvious.",
    idealFits: ["Saints", "Chiefs", "Ravens"]
  },
  
  {
    id: "2026_wr_lemon",
    name: "Makai Lemon",
    position: "WR",
    school: "USC",
    draftYear: 2026,
    height: "5'11\"",
    weight: 195,
    projectedPick: "Round 1",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 12, rec: 79, recYds: 1156, recTD: 11 },
    strengths: [
      "Explosive playmaker - 79 catches lead class",
      "1,156 yards, 11 TDs",
      "Wins contested catches despite size"
    ],
    weaknesses: [
      "Under 6 feet - outside role questions",
      "Not a burner"
    ],
    comps: ["Amon-Ra St. Brown", "Keenan Allen"],
    ceiling: "PPR WR1 monster",
    floor: "High-floor WR2",
    summary: "Volume king—79 catches leads class. 14.6 YPR with 11 TDs. PPR darling, mid-1st value.",
    idealFits: ["Ravens", "Broncos", "Panthers"]
  },

  {
    id: "2026_wr_boston",
    name: "Denzel Boston",
    position: "WR",
    school: "Washington",
    draftYear: 2026,
    height: "6'4\"",
    weight: 210,
    projectedPick: "Round 1-2",
    dynastyTier: "Blue Chip",
    grade: "B+",
    stats: { games: 11, rec: 62, recYds: 881, recTD: 11 },
    strengths: [
      "Elite size at 6'4\"",
      "11 TDs in 11 games - red zone monster",
      "Contested catch specialist"
    ],
    weaknesses: [
      "Post-Penix production—system concerns",
      "Not elite separation"
    ],
    comps: ["Mike Evans", "Courtland Sutton"],
    ceiling: "TD-machine WR1",
    floor: "Red zone specialist WR3",
    summary: "11 TDs in 11 games is absurd. TD regression likely but size + hands = real upside.",
    idealFits: ["Jaguars", "Browns", "Cardinals"]
  },

  {
    id: "2026_wr_concepcion",
    name: "KC Concepcion",
    position: "WR",
    school: "Texas A&M",
    draftYear: 2026,
    height: "5'11\"",
    weight: 190,
    projectedPick: "Round 2",
    dynastyTier: "Solid",
    grade: "B+",
    stats: { games: 13, rec: 61, recYds: 919, recTD: 9 },
    strengths: [
      "Elite slot skills - 15.1 YPR",
      "9 TDs from slot",
      "Reliable hands and route running"
    ],
    weaknesses: [
      "Smaller frame for outside",
      "Slot-only projection"
    ],
    comps: ["Chris Godwin", "Tyler Lockett"],
    ceiling: "Elite slot WR2",
    floor: "Solid WR3 in slot",
    summary: "Slot specialist with plus production. 919 yards, 9 TDs. Late 1st/early 2nd value.",
    idealFits: ["Bills", "Lions", "Seahawks"]
  },

  {
    id: "2026_wr_fields",
    name: "Malachi Fields",
    position: "WR",
    school: "Notre Dame",
    draftYear: 2026,
    height: "6'2\"",
    weight: 205,
    projectedPick: "Round 2-3",
    dynastyTier: "Solid",
    grade: "B",
    strengths: [
      "Size/speed combo",
      "Notre Dame offense production",
      "Contested catch ability"
    ],
    weaknesses: [
      "Route tree needs polish",
      "Consistency concerns"
    ],
    comps: ["Allen Robinson", "Darnell Mooney"],
    ceiling: "Starting WR2",
    floor: "WR4 with upside",
    summary: "Solid day 2 prospect with size. Notre Dame passing game helped stock.",
    idealFits: ["Vikings", "Packers", "Dolphins"]
  },

  {
    id: "2026_wr_branch",
    name: "Zachariah Branch",
    position: "WR",
    school: "Georgia",
    draftYear: 2026,
    height: "5'10\"",
    weight: 178,
    projectedPick: "Round 2-3",
    dynastyTier: "Upside",
    grade: "B",
    strengths: [
      "Speed demon - sub-4.3 burner",
      "Dynamic return ability",
      "Explosive after the catch"
    ],
    weaknesses: [
      "Slight frame",
      "Limited route tree"
    ],
    comps: ["Tyreek Hill (lite)", "Jaylen Waddle"],
    ceiling: "Deep threat WR2",
    floor: "Return specialist",
    summary: "Elite speed but raw. Home-run threat with proper development. High-upside dart.",
    idealFits: ["Chiefs", "Ravens", "Bills"]
  },

  // TIGHT ENDS
  {
    id: "2026_te_sadiq",
    name: "Kenyon Sadiq",
    position: "TE",
    school: "Oregon",
    draftYear: 2026,
    height: "6'3\"",
    weight: 245,
    projectedPick: "Round 1-2",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 14, rec: 51, recYds: 560, recTD: 8 },
    strengths: [
      "UNANIMOUS TE1 - complete tight end",
      "8 TDs leads all TEs",
      "Red zone monster, solid hands"
    ],
    weaknesses: [
      "Only 11 YPR",
      "Blocking still developing"
    ],
    comps: ["Dallas Goedert", "Hunter Henry"],
    ceiling: "TE1 with TD upside",
    floor: "TE2 in right scheme",
    summary: "TE1 in the class. 8 TDs is elite for position. Worth late 1st in TEP leagues.",
    idealFits: ["Chiefs", "Chargers", "Cowboys"]
  },

  {
    id: "2026_te_royer",
    name: "Joe Royer",
    position: "TE",
    school: "Cincinnati",
    draftYear: 2026,
    height: "6'5\"",
    weight: 255,
    projectedPick: "Round 2-3",
    dynastyTier: "Solid",
    grade: "B",
    strengths: [
      "Good size for position",
      "Red zone target ability",
      "Improving route runner"
    ],
    weaknesses: [
      "Limited athletic ceiling",
      "Blocking inconsistent"
    ],
    comps: ["Pat Freiermuth", "Tyler Higbee"],
    ceiling: "Starting TE1",
    floor: "TE2/blocking TE",
    summary: "Solid TE prospect with good size. Not flashy but productive.",
    idealFits: ["Patriots", "Titans", "Saints"]
  },
  
  {
    id: "2026_te_klare",
    name: "Max Klare",
    position: "TE",
    school: "Ohio State",
    draftYear: 2026,
    height: "6'5\"",
    weight: 243,
    projectedPick: "Round 2-3",
    dynastyTier: "Upside",
    grade: "B",
    stats: { games: 13, rec: 43, recYds: 448, recTD: 2 },
    strengths: [
      "Great size/athleticism combo",
      "Ohio State pedigree",
      "Improving each season"
    ],
    weaknesses: [
      "Only 2 TDs",
      "Limited usage in college"
    ],
    comps: ["Kyle Pitts (lite)", "Noah Fant"],
    ceiling: "Top-5 TE with development",
    floor: "Blocking TE with upside",
    summary: "Athletic freak who needs target share. 2nd round dynasty value, needs patience.",
    idealFits: ["Jaguars", "Dolphins", "Bears"]
  },

  // ═══════════════════════════════════════════════════════════
  // 2027 NFL DRAFT CLASS (April 2027)
  // ═══════════════════════════════════════════════════════════
  
  // QUARTERBACKS
  {
    id: "2027_qb_manning",
    name: "Arch Manning",
    position: "QB",
    school: "Texas",
    draftYear: 2027,
    height: "6'4\"",
    weight: 220,
    projectedPick: "1.01",
    dynastyTier: "Elite",
    grade: "A+",
    stats: { games: 12, passYds: 3163, passTD: 26, int: 5 },
    strengths: [
      "THE franchise QB prospect - potential #1 overall",
      "Elite bloodline with arm talent to back it",
      "Dual-threat ability (6'4\" 220 and mobile)"
    ],
    weaknesses: [
      "Pressure of the name",
      "Still developing at high level"
    ],
    comps: ["Peyton Manning", "Andrew Luck"],
    ceiling: "Generational franchise QB, 15-year dynasty cornerstone",
    floor: "Starting NFL QB floor",
    summary: "The name. The talent. 3,163 yards, 26 TD, 5 INT. 1.01 in SF leagues, no questions asked.",
    idealFits: ["Jets", "Giants", "Raiders"]
  },
  
  {
    id: "2027_qb_moore",
    name: "Dante Moore",
    position: "QB",
    school: "Oregon",
    draftYear: 2027,
    height: "6'2\"",
    weight: 210,
    projectedPick: "Top 5",
    dynastyTier: "Blue Chip",
    grade: "A",
    stats: { games: 13, passYds: 3565, passTD: 30, int: 10 },
    strengths: [
      "Returned from 2026 draft - smart move!",
      "3,565 yards, 30 TDs - could be QB1",
      "Quick release and processing"
    ],
    weaknesses: [
      "10 INTs - decision-making lapses",
      "Needs to add weight"
    ],
    comps: ["Russell Wilson", "Justin Herbert"],
    ceiling: "Dynamic franchise QB",
    floor: "Boom-bust starter",
    summary: "Returned to school and elevated stock. 30 TDs shows arm talent. Top-3 SF pick.",
    idealFits: ["Cardinals", "Browns", "Panthers"]
  },

  {
    id: "2027_qb_sorsby",
    name: "Brendan Sorsby",
    position: "QB",
    school: "Texas Tech",
    draftYear: 2027,
    height: "6'3\"",
    weight: 218,
    projectedPick: "Round 1",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 12, passYds: 2800, passTD: 27, int: 5 },
    strengths: [
      "Elite arm talent - transferred from Cincy",
      "27 TDs, only 5 INTs",
      "Big-play ability"
    ],
    weaknesses: [
      "Newer to the system",
      "Consistency game-to-game"
    ],
    comps: ["Patrick Mahomes (lite)", "Joe Burrow"],
    ceiling: "Top-10 dynasty QB",
    floor: "Starting QB with arm",
    summary: "Transfer success story with elite efficiency. 27/5 TD-INT ratio is outstanding.",
    idealFits: ["Saints", "Broncos", "Bears"]
  },

  // WIDE RECEIVERS
  {
    id: "2027_wr_smith",
    name: "Jeremiah Smith",
    position: "WR",
    school: "Ohio State",
    draftYear: 2027,
    height: "6'3\"",
    weight: 223,
    projectedPick: "Top 5",
    dynastyTier: "Elite",
    grade: "A+",
    strengths: [
      "THE PROSPECT - Julio Jones comp",
      "27 TDs in 2 seasons, 1,200+ yards both years",
      "GENERATIONAL size/speed/skill combo"
    ],
    weaknesses: [
      "Will face NFL's best corners",
      "Minor concerns (none significant)"
    ],
    comps: ["Julio Jones", "Ja'Marr Chase"],
    ceiling: "Top-3 dynasty WR ever, generational talent",
    floor: "High-end WR1",
    summary: "THE prospect. Best WR since Chase, arguably better. 1.01 in 1QB, top-3 SF. League-winner.",
    idealFits: ["Any team", "Titans", "Chargers"]
  },
  
  {
    id: "2027_wr_coleman",
    name: "Cam Coleman",
    position: "WR",
    school: "Texas",
    draftYear: 2027,
    height: "6'3\"",
    weight: 201,
    projectedPick: "Top 15",
    dynastyTier: "Blue Chip",
    grade: "A",
    strengths: [
      "Transferred from Auburn - 6'3\" 201",
      "Big-play ability, vertical threat",
      "Great athleticism and speed for size"
    ],
    weaknesses: [
      "Route tree still developing",
      "New system transition"
    ],
    comps: ["DK Metcalf", "Chris Olave"],
    ceiling: "Elite WR1, top-10 dynasty",
    floor: "Boom-bust WR2",
    summary: "Smith is 1A, Coleman is 1B. Size + speed = cheat code. Texas transfer boosted stock.",
    idealFits: ["Dolphins", "Ravens", "Bills"]
  },
  
  {
    id: "2027_wr_williams",
    name: "Ryan Williams",
    position: "WR",
    school: "Alabama",
    draftYear: 2027,
    height: "6'0\"",
    weight: 185,
    projectedPick: "Top 15",
    dynastyTier: "Blue Chip",
    grade: "A-",
    strengths: [
      "Electric playmaker with burst",
      "Route running is advanced",
      "Elite YAC ability"
    ],
    weaknesses: [
      "13% drop rate - concentration lapses",
      "Slight frame needs strength"
    ],
    comps: ["Justin Jefferson", "Marvin Harrison Jr."],
    ceiling: "Top-10 dynasty WR",
    floor: "WR2 with drop issues",
    summary: "Electric talent with one flaw - 13% drop rate. If he fixes hands, he's special.",
    idealFits: ["Jets", "Raiders", "Seahawks"]
  },

  // RUNNING BACKS
  {
    id: "2027_rb_hardy",
    name: "Ahmad Hardy",
    position: "RB",
    school: "Missouri",
    draftYear: 2027,
    height: "5'11\"",
    weight: 215,
    projectedPick: "Top 15",
    dynastyTier: "Elite",
    grade: "A",
    stats: { games: 13, rushYds: 1649, rushTD: 16, ypc: 6.4 },
    strengths: [
      "Ashton Jeanty comp - 1,649 yards, 16 TDs",
      "6.4 YPC efficiency at high volume",
      "Top-15 pick potential"
    ],
    weaknesses: [
      "Receiving game developing",
      "One elite season sample"
    ],
    comps: ["Ashton Jeanty", "Derrick Henry"],
    ceiling: "Top-5 dynasty RB, bell cow",
    floor: "Starting RB with TD upside",
    summary: "RB1 in 2027 class. Jeanty-level production at 6.4 YPC. Could be special.",
    idealFits: ["Commanders", "Cardinals", "Bengals"]
  },

  {
    id: "2027_rb_lacy",
    name: "Kewan Lacy",
    position: "RB",
    school: "Ole Miss",
    draftYear: 2027,
    height: "5'10\"",
    weight: 200,
    projectedPick: "Round 1",
    dynastyTier: "Blue Chip",
    grade: "A-",
    stats: { games: 14, rushYds: 1567, rushTD: 24 },
    strengths: [
      "24 TDs - elite touchdown production",
      "Track speed, explosive",
      "1,567 rushing yards"
    ],
    weaknesses: [
      "Slighter frame durability",
      "Not a bruiser between tackles"
    ],
    comps: ["Jahmyr Gibbs", "Raheem Mostert"],
    ceiling: "Dynamic RB1 with speed",
    floor: "TD-dependent RB2",
    summary: "24 TDs is ABSURD production. Track speed makes him electric. Top dynasty RB.",
    idealFits: ["Chiefs", "Bills", "Dolphins"]
  },

  {
    id: "2027_rb_brown",
    name: "Isaac Brown",
    position: "RB",
    school: "Louisville",
    draftYear: 2027,
    height: "5'10\"",
    weight: 205,
    projectedPick: "Round 2",
    dynastyTier: "Solid",
    grade: "B+",
    strengths: [
      "Explosive dual-threat",
      "Returning from injury",
      "Pass-catching ability"
    ],
    weaknesses: [
      "Injury return status",
      "Durability concerns"
    ],
    comps: ["Austin Ekeler", "Alvin Kamara (lite)"],
    ceiling: "PPR RB1",
    floor: "Change-of-pace back",
    summary: "Pre-injury was elite. Health is the question. If healthy, top dynasty value.",
    idealFits: ["Rams", "49ers", "Bengals"]
  },

  // TIGHT ENDS
  {
    id: "2027_te_johnson",
    name: "Jamari Johnson",
    position: "TE",
    school: "Oregon",
    draftYear: 2027,
    height: "6'5\"",
    weight: 257,
    projectedPick: "Round 1",
    dynastyTier: "Blue Chip",
    grade: "A",
    strengths: [
      "Best TE in 2027 class - 6'5\" 257",
      "Complete tight end skill set",
      "Receiving and blocking ability"
    ],
    weaknesses: [
      "Not elite athleticism",
      "Route tree developing"
    ],
    comps: ["Mark Andrews", "Travis Kelce"],
    ceiling: "Top-5 dynasty TE",
    floor: "Starting TE1",
    summary: "Clear TE1 in loaded 2027 class. Size and skill make him day 1 starter.",
    idealFits: ["Patriots", "Broncos", "Cowboys"]
  },

  {
    id: "2027_te_carter",
    name: "Terrance Carter Jr.",
    position: "TE",
    school: "Texas Tech",
    draftYear: 2027,
    height: "6'4\"",
    weight: 250,
    projectedPick: "Round 2",
    dynastyTier: "Solid",
    grade: "B+",
    strengths: [
      "Harold Fannin comp",
      "Athletic receiving TE",
      "Air Raid production"
    ],
    weaknesses: [
      "Blocking needs work",
      "System production concerns"
    ],
    comps: ["Harold Fannin Jr.", "Kyle Pitts (lite)"],
    ceiling: "Top-10 dynasty TE",
    floor: "Receiving specialist TE2",
    summary: "Athletic TE from Air Raid system. Fannin comp is exciting. TEP sleeper.",
    idealFits: ["Chiefs", "Bengals", "Raiders"]
  },

  {
    id: "2027_te_green",
    name: "Trey'Dez Green",
    position: "TE",
    school: "LSU",
    draftYear: 2027,
    height: "6'7\"",
    weight: 240,
    projectedPick: "Round 2-3",
    dynastyTier: "Upside",
    grade: "B+",
    strengths: [
      "6'7\" 240 - massive red zone weapon",
      "Mismatch nightmare in end zone",
      "Developing skill set"
    ],
    weaknesses: [
      "Raw route runner",
      "Needs to add muscle"
    ],
    comps: ["Mike Gesicki", "Darren Waller"],
    ceiling: "Elite red zone TE1",
    floor: "TD-dependent TE2",
    summary: "Size is ridiculous. 6'7\" in the red zone is unfair. High-upside TE dart.",
    idealFits: ["Rams", "Cardinals", "Giants"]
  }
];

// Helpers
export const getProspectsByYear = (year: number) => 
  prospectReports.filter(p => p.draftYear === year);

export const getProspectsByPosition = (pos: 'QB' | 'RB' | 'WR' | 'TE') =>
  prospectReports.filter(p => p.position === pos);

export const getProspect = (id: string) =>
  prospectReports.find(p => p.id === id);

export const getEliteProspects = () =>
  prospectReports.filter(p => p.dynastyTier === 'Elite');

export const getProspectsByGrade = (minGrade: string) => {
  const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
  const minIndex = gradeOrder.indexOf(minGrade);
  return prospectReports.filter(p => gradeOrder.indexOf(p.grade) <= minIndex);
};
