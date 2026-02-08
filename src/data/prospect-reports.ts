// Dynasty Prospect Scouting Reports
// Author: Agent Drew | Last Updated: Feb 2026
// Sources: CBS Sports, WalterFootball, DynastyProcess

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
  
  // 2025 College Stats (where available)
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
    stats: { games: 16, passYds: 3535, passTD: 41, int: 6 },
    strengths: [
      "Prototype size with elite arm",
      "72% completion, 41 TD, 6 INT",
      "Massive 2025 breakout"
    ],
    weaknesses: [
      "First year as starter",
      "Raw—needs development"
    ],
    comps: ["Josh Allen", "Derek Carr"],
    ceiling: "Franchise QB, top-5 fantasy",
    floor: "Developmental project",
    summary: "QB1 in a weak class. 41 TDs with 6 INTs is elite production. Raw but the tools are there.",
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
    stats: { games: 15, passYds: 3567, passTD: 28, int: 5 },
    strengths: [
      "28 TD / 5 INT ratio",
      "Proven winner at Bama",
      "Ball placement is plus"
    ],
    weaknesses: [
      "Lacks elite arm talent",
      "Ceiling concerns"
    ],
    comps: ["Mac Jones", "Kirk Cousins"],
    ceiling: "Low-end QB1",
    floor: "Safe backup",
    summary: "Pro-ready but limited upside. 64.5% completion is fine, not elite. Late 1st in SF.",
    idealFits: ["Jets", "Steelers", "Vikings"]
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
    stats: { games: 12, rushYds: 1372, rushTD: 18 },
    strengths: [
      "6.9 YPC (!), 18 rushing TDs",
      "Plus receiving ability",
      "Workhorse build"
    ],
    weaknesses: [
      "Not elite long speed",
      "Pass pro needs work"
    ],
    comps: ["Josh Jacobs", "Alvin Kamara"],
    ceiling: "Top-5 dynasty RB",
    floor: "Solid RB2",
    summary: "RB1 in this class. 6.9 YPC and 18 TDs is absurd. 1.01-1.02 in 1QB formats.",
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
    stats: { games: 12, rushYds: 674, rushTD: 11 },
    strengths: [
      "6.0 YPC efficiency",
      "11 TDs in limited work",
      "Change-of-pace upside"
    ],
    weaknesses: [
      "Split backfield with Love",
      "Smaller frame"
    ],
    comps: ["Jaylen Warren", "Tony Pollard"],
    ceiling: "High-end RB2",
    floor: "Backup/committee back",
    summary: "Love's backup but efficient. Day 2 pick—2nd round dynasty value.",
    idealFits: ["Broncos", "Cardinals", "Bears"]
  },

  // WIDE RECEIVERS
  {
    id: "2026_wr_tyson",
    name: "Jordyn Tyson",
    position: "WR",
    school: "Arizona State",
    draftYear: 2026,
    height: "6'2\"",
    weight: 200,
    projectedPick: "Top 10",
    dynastyTier: "Elite",
    stats: { games: 9, rec: 61, recYds: 711, recTD: 8 },
    strengths: [
      "11.7 YPR, 8 TDs in 9 games",
      "Explosive speed/size combo",
      "Alpha mentality"
    ],
    weaknesses: [
      "Only 9 games (injury?)",
      "Route tree needs refinement"
    ],
    comps: ["Chris Olave", "Terry McLaurin"],
    ceiling: "WR1 with deep threat ability",
    floor: "Boom-bust WR2",
    summary: "WR1 in the class. Per-game production is elite—8 TDs in 9 games. Top-5 pick.",
    idealFits: ["Saints", "Chiefs", "Ravens"]
  },
  
  {
    id: "2026_wr_tate",
    name: "Carnell Tate",
    position: "WR",
    school: "Ohio State",
    draftYear: 2026,
    height: "6'3\"",
    weight: 195,
    projectedPick: "Top 15",
    dynastyTier: "Blue Chip",
    stats: { games: 11, rec: 51, recYds: 875, recTD: 9 },
    strengths: [
      "17.2 YPR (!), 9 TDs",
      "Big-play ability",
      "Breakout sophomore year"
    ],
    weaknesses: [
      "Quiet freshman year",
      "Needs to add weight"
    ],
    comps: ["Mike Evans", "DK Metcalf"],
    ceiling: "Alpha WR1",
    floor: "TD-dependent WR3",
    summary: "17.2 yards per catch is elite. Big-play machine with size. WR2 in class, mid-1st pick.",
    idealFits: ["Rams", "Patriots", "Bears"]
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
    stats: { games: 12, rec: 79, recYds: 1156, recTD: 11 },
    strengths: [
      "79 rec, 1156 yds, 11 TD",
      "Volume monster",
      "Wins contested catches"
    ],
    weaknesses: [
      "Under 6 feet",
      "Not a burner"
    ],
    comps: ["Amon-Ra St. Brown", "Keenan Allen"],
    ceiling: "PPR WR1",
    floor: "High-floor WR2",
    summary: "Volume king—79 catches leads the class. 14.6 YPR with 11 TDs. PPR darling, mid-1st.",
    idealFits: ["Ravens", "Broncos", "Panthers"]
  },
  
  {
    id: "2026_wr_brazzell",
    name: "Chris Brazzell II",
    position: "WR",
    school: "Tennessee",
    draftYear: 2026,
    height: "6'5\"",
    weight: 200,
    projectedPick: "Round 2",
    dynastyTier: "Solid",
    stats: { games: 12, rec: 62, recYds: 1017, recTD: 9 },
    strengths: [
      "1,000+ yard season",
      "6'5\" with 16.4 YPR",
      "Red zone weapon"
    ],
    weaknesses: [
      "Needs to add mass",
      "May lack elite speed"
    ],
    comps: ["Mike Williams", "Allen Robinson"],
    ceiling: "Big-bodied WR1",
    floor: "TD-dependent WR3",
    summary: "Sneaky good—1017 yards at 6'5\". High-upside day 2 pick. Late 1st value.",
    idealFits: ["Steelers", "Jaguars", "Texans"]
  },
  
  {
    id: "2026_wr_boston",
    name: "Denzel Boston",
    position: "WR",
    school: "Washington",
    draftYear: 2026,
    height: "6'4\"",
    weight: 210,
    projectedPick: "Round 2",
    dynastyTier: "Solid",
    stats: { games: 11, rec: 62, recYds: 881, recTD: 11 },
    strengths: [
      "11 TDs in 11 games",
      "14.2 YPR",
      "Size/TD combo"
    ],
    weaknesses: [
      "Post-Penix production—system?",
      "Not elite separation"
    ],
    comps: ["DeAndre Hopkins", "Courtland Sutton"],
    ceiling: "TD-machine WR1",
    floor: "Red zone specialist",
    summary: "11 TDs in 11 games is ridiculous. TD regression likely but upside is real. Day 2 value.",
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
    stats: { games: 13, rec: 61, recYds: 919, recTD: 9 },
    strengths: [
      "15.1 YPR, 9 TDs",
      "Playmaker ability",
      "Reliable hands"
    ],
    weaknesses: [
      "Smaller frame",
      "SEC competition?"
    ],
    comps: ["Brandin Cooks", "Tyler Lockett"],
    ceiling: "Deep threat WR2",
    floor: "Solid WR3",
    summary: "Another 900-yard guy with 9 TDs. Deep threat upside. Late 1st/early 2nd value.",
    idealFits: ["Bills", "Lions", "Seahawks"]
  },
  
  {
    id: "2026_wr_cooper",
    name: "Omar Cooper Jr.",
    position: "WR",
    school: "Indiana",
    draftYear: 2026,
    height: "6'0\"",
    weight: 204,
    projectedPick: "Round 2-3",
    dynastyTier: "Upside",
    stats: { games: 16, rec: 69, recYds: 937, recTD: 13 },
    strengths: [
      "13 TDs—2nd in class",
      "Mendoza's top target",
      "Solid frame"
    ],
    weaknesses: [
      "Indiana competition level",
      "Can he do it without Mendoza?"
    ],
    comps: ["Jameson Williams", "Rashod Bateman"],
    ceiling: "High-upside WR2",
    floor: "Boom-bust WR4",
    summary: "13 TDs with Mendoza—chemistry matters. If they go together, value rises. Mid-2nd.",
    idealFits: ["Raiders", "Browns", "Giants"]
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
    dynastyTier: "Solid",
    stats: { games: 14, rec: 51, recYds: 560, recTD: 8 },
    strengths: [
      "8 TDs leads TEs",
      "Red zone monster",
      "Solid hands"
    ],
    weaknesses: [
      "Only 11 YPR",
      "Blocking needs work"
    ],
    comps: ["Dallas Goedert", "Hunter Henry"],
    ceiling: "TE1 with TD upside",
    floor: "TE2 in right scheme",
    summary: "TE1 in the class. 8 TDs is elite for the position. Worth late 1st in TEP.",
    idealFits: ["Chiefs", "Chargers", "Cowboys"]
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
    stats: { games: 13, rec: 43, recYds: 448, recTD: 2 },
    strengths: [
      "Great size/athleticism",
      "Improving each year",
      "Day 2 value"
    ],
    weaknesses: [
      "Only 2 TDs",
      "Usage was limited"
    ],
    comps: ["Kyle Pitts (lite)", "Pat Freiermuth"],
    ceiling: "Top-5 TE with development",
    floor: "Blocking TE with upside",
    summary: "Upside play—athletic freak who needs target share. 2nd round dynasty value.",
    idealFits: ["Patriots", "Jaguars", "Dolphins"]
  },

  // ═══════════════════════════════════════════════════════════
  // 2027 NFL DRAFT CLASS (April 2027)
  // ═══════════════════════════════════════════════════════════
  
  {
    id: "2027_qb_manning",
    name: "Arch Manning",
    position: "QB",
    school: "Texas",
    draftYear: 2027,
    height: "6'4\"",
    weight: 225,
    projectedPick: "1.01",
    dynastyTier: "Elite",
    strengths: [
      "Elite bloodline/football IQ",
      "Improved exponentially as starter",
      "Arm talent is real"
    ],
    weaknesses: [
      "Started slow in 2025",
      "Pressure of the name"
    ],
    comps: ["Peyton Manning", "Eli Manning"],
    ceiling: "Generational franchise QB",
    floor: "Starting NFL QB",
    summary: "The name. The talent. 1.01 in SF, no questions. Dynasty cornerstone for 15 years.",
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
    strengths: [
      "Quick release and processing",
      "Dual-threat ability",
      "Returned to boost stock"
    ],
    weaknesses: [
      "Needs to add weight",
      "Decision-making lapses"
    ],
    comps: ["Russell Wilson", "Kyler Murray"],
    ceiling: "Dynamic dual-threat QB1",
    floor: "Boom-bust QB2",
    summary: "Returned to school—smart move. Quick-twitch playmaker. Top-3 SF pick.",
    idealFits: ["Cardinals", "Browns", "Panthers"]
  },
  
  {
    id: "2027_wr_smith",
    name: "Jeremiah Smith",
    position: "WR",
    school: "Ohio State",
    draftYear: 2027,
    height: "6'3\"",
    weight: 215,
    projectedPick: "Top 5",
    dynastyTier: "Elite",
    strengths: [
      "Generational size/speed/skill",
      "Alpha mentality—commands targets",
      "Already elite as sophomore"
    ],
    weaknesses: [
      "Still developing",
      "Will face NFL's best"
    ],
    comps: ["Ja'Marr Chase", "A.J. Green"],
    ceiling: "Top-3 dynasty WR ever",
    floor: "High-end WR2",
    summary: "THE prospect. Best WR since Chase, maybe better. 1.01 in 1QB, top-3 SF. League-winner.",
    idealFits: ["Titans", "Texans", "Chargers"]
  },
  
  {
    id: "2027_wr_coleman",
    name: "Cam Coleman",
    position: "WR",
    school: "Auburn",
    draftYear: 2027,
    height: "6'3\"",
    weight: 205,
    projectedPick: "Top 10",
    dynastyTier: "Blue Chip",
    strengths: [
      "Ridiculous speed for size",
      "Vertical threat",
      "Great athleticism"
    ],
    weaknesses: [
      "Route tree needs polish",
      "Concentration drops"
    ],
    comps: ["DK Metcalf", "Marvin Harrison Jr."],
    ceiling: "Elite WR1",
    floor: "Boom-bust WR2",
    summary: "Smith is 1A, Coleman is 1B. Size + speed = cheat code. Top-5 dynasty pick.",
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
    strengths: [
      "Electric playmaker",
      "Route running advanced",
      "YAC ability"
    ],
    weaknesses: [
      "Needs to add strength",
      "Slight frame"
    ],
    comps: ["Justin Jefferson", "Rashod Bateman"],
    ceiling: "Top-10 dynasty WR",
    floor: "Solid WR2",
    summary: "Slippery route runner with burst. Needs to bulk up but skill is special. Mid-1st.",
    idealFits: ["Jets", "Raiders", "Seahawks"]
  },
  
  {
    id: "2027_rb_baugh",
    name: "Jadan Baugh",
    position: "RB",
    school: "Florida",
    draftYear: 2027,
    height: "5'11\"",
    weight: 205,
    projectedPick: "Round 1",
    dynastyTier: "Blue Chip",
    strengths: [
      "Elite burst",
      "Yards after contact",
      "Home-run speed"
    ],
    weaknesses: [
      "Pass pro unknown",
      "Limited receiving work"
    ],
    comps: ["Jahmyr Gibbs", "Alvin Kamara"],
    ceiling: "Top-5 dynasty RB",
    floor: "Speed-dependent RB2",
    summary: "RB1 in 2027. Electric runner—could be top-5 dynasty RB. Worth mid-1st.",
    idealFits: ["Chiefs", "Ravens", "Bills"]
  },
  
  {
    id: "2027_qb_mateer",
    name: "John Mateer",
    position: "QB",
    school: "Oklahoma",
    draftYear: 2027,
    height: "6'1\"",
    weight: 210,
    projectedPick: "Round 1",
    dynastyTier: "Solid",
    strengths: [
      "Very accurate",
      "Mobile and athletic",
      "Baker Mayfield comp"
    ],
    weaknesses: [
      "Slight frame",
      "Limited tape in new system"
    ],
    comps: ["Baker Mayfield", "Jalen Hurts (lite)"],
    ceiling: "Starting QB with rush upside",
    floor: "Backup-level arm",
    summary: "Sleeper QB in loaded class. Accuracy + mobility is appealing. Late 1st SF.",
    idealFits: ["Browns", "Titans", "Saints"]
  },
  
  {
    id: "2027_qb_johnson",
    name: "Avery Johnson",
    position: "QB",
    school: "Kansas State",
    draftYear: 2027,
    height: "6'2\"",
    weight: 205,
    projectedPick: "Round 1",
    dynastyTier: "Upside",
    strengths: [
      "Elite rushing ability",
      "Off-the-charts athleticism",
      "Clutch playmaker"
    ],
    weaknesses: [
      "Accuracy inconsistent",
      "Relies on legs"
    ],
    comps: ["Lamar Jackson (lite)", "Jalen Hurts"],
    ceiling: "Dual-threat fantasy monster",
    floor: "Boom-bust project",
    summary: "Rushing upside is insane but arm questions persist. High-risk, high-reward dart.",
    idealFits: ["Steelers", "Broncos", "Falcons"]
  }
];

// Helpers
export const getProspectsByYear = (year: number) => 
  prospectReports.filter(p => p.draftYear === year);

export const getProspectsByPosition = (pos: 'QB' | 'RB' | 'WR' | 'TE') =>
  prospectReports.filter(p => p.position === pos);

export const getProspect = (id: string) =>
  prospectReports.find(p => p.id === id);
