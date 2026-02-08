// Prospect Scouting Report Types

export interface ProspectMeasurables {
  height: string;          // "6'2\""
  weight: number;          // 215
  fortyTime?: number;      // 4.38
  school: string;          // "Ohio State"
  class: string;           // "Junior"
  age: number;             // 21
}

export interface ProspectComp {
  playerName: string;      // "Tyreek Hill"
  similarity: number;      // 0-100 how close the comp is
  note?: string;           // "Similar acceleration and RAC ability"
}

export interface ProspectReport {
  // Identity
  playerId: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE';
  
  // Draft Info
  draftYear: number;
  projectedRound: number;         // 1-7
  projectedPick?: string;         // "1.01-1.03"
  draftRank: number;              // Overall prospect rank
  
  // Measurables
  measurables: ProspectMeasurables;
  
  // Scouting Analysis
  strengths: string[];            // 3-5 bullet points
  weaknesses: string[];           // 3-5 bullet points
  comps: ProspectComp[];          // 2-3 player comparisons
  
  // Fantasy Analysis
  fantasyOutlook: {
    ceiling: string;              // "WR1 with alpha target share"
    floor: string;                // "Boom/bust WR3 if lands in crowded room"
    dynastyTier: 'Elite' | 'Blue Chip' | 'Solid' | 'Dart Throw';
    rookieADP: string;            // "1.01-1.02"
    landingSpotSensitivity: 'High' | 'Medium' | 'Low';
  };
  
  // Landing Spot Analysis
  idealFits: {
    team: string;
    fitScore: number;             // 0-100
    note: string;                 // "Would immediately become WR1"
  }[];
  
  // Summary
  oneLineSum: string;             // "Electric playmaker with league-winning upside"
  fullAnalysis: string;           // 2-3 paragraph deep dive
  
  // Meta
  lastUpdated: string;            // ISO date
  author: string;                 // "Agent Drew"
}

// Example for reference:
export const exampleProspect: ProspectReport = {
  playerId: "prospect_2026_01",
  name: "Jeremiah Smith",
  position: "WR",
  draftYear: 2027,
  projectedRound: 1,
  projectedPick: "Top 5",
  draftRank: 1,
  measurables: {
    height: "6'3\"",
    weight: 215,
    fortyTime: 4.42,
    school: "Ohio State",
    class: "Sophomore",
    age: 19
  },
  strengths: [
    "Elite body control and contested catch ability",
    "Alpha WR1 profile - commands targets",
    "Polished route runner for his age",
    "Red zone weapon with size/athleticism combo",
    "Production against top competition (SEC, Big Ten)"
  ],
  weaknesses: [
    "Limited college sample size (sophomore declare)",
    "Could add more creativity after the catch",
    "Will face more complex NFL coverages"
  ],
  comps: [
    { playerName: "Ja'Marr Chase", similarity: 85, note: "Similar alpha presence and contested catch skills" },
    { playerName: "A.J. Green", similarity: 75, note: "Comparable size/speed combo and smoothness" }
  ],
  fantasyOutlook: {
    ceiling: "Perennial WR1, top-5 dynasty WR",
    floor: "High-end WR2 even in suboptimal situation",
    dynastyTier: "Elite",
    rookieADP: "1.01",
    landingSpotSensitivity: "Low"
  },
  idealFits: [
    { team: "New York Giants", fitScore: 95, note: "Immediate WR1 with Daniels connection" },
    { team: "Las Vegas Raiders", fitScore: 90, note: "Clean path to alpha role" },
    { team: "New England Patriots", fitScore: 85, note: "Would transform passing game" }
  ],
  oneLineSum: "Generational WR prospect with Chase-level ceiling",
  fullAnalysis: `Jeremiah Smith represents the most exciting WR prospect since Ja'Marr Chase. At 6'3" 215 with 4.42 speed, he possesses the rare combination of size, athleticism, and polish that translates to immediate NFL impact.

His sophomore season at Ohio State showcased elite contested-catch ability and an alpha mentality that draws comparisons to Chase's LSU dominance. Smith wins at all three levels - capable of taking the top off defenses, winning in the intermediate game, and dominating in the red zone.

For dynasty purposes, Smith is as close to a sure thing as exists in prospect evaluation. His landing spot matters less than most WRs because his talent will command targets regardless of surrounding cast. He's the rare "system-proof" prospect.`,
  lastUpdated: "2026-02-08",
  author: "Agent Drew"
};
