import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample runs for NYC Marathon training (Feb 2026 base building)
const runs = [
  // Week 1 - Base building
  { week: 1, day: 1, date: "2026-02-02", actualMiles: 4.0, duration: "36:00", pace: "9:00", feeling: "good", notes: "First run of the training block. Felt solid." },
  { week: 1, day: 2, date: "2026-02-04", actualMiles: 3.0, duration: "27:30", pace: "9:10", feeling: "good", notes: "Easy recovery run. Focused on form." },
  { week: 1, day: 3, date: "2026-02-06", actualMiles: 5.0, duration: "44:00", pace: "8:48", feeling: "great", notes: "Pushed a bit on the last mile. Legs felt fresh." },
  { week: 1, day: 4, date: "2026-02-08", actualMiles: 6.0, duration: "54:00", pace: "9:00", feeling: "good", notes: "Long run day. Good mental focus." },

  // Week 2 - Building
  { week: 2, day: 1, date: "2026-02-09", actualMiles: 4.5, duration: "39:15", pace: "8:43", feeling: "great", notes: "Morning run before work. Cold but energized." },
  { week: 2, day: 2, date: "2026-02-11", actualMiles: 3.5, duration: "32:40", pace: "9:20", feeling: "tired", notes: "Legs heavy from yesterday. Kept it easy." },
  { week: 2, day: 3, date: "2026-02-12", actualMiles: 5.5, duration: "46:45", pace: "8:30", feeling: "good", notes: "Tempo effort for middle 2 miles." },
  { week: 2, day: 4, date: "2026-02-14", actualMiles: 7.0, duration: "63:00", pace: "9:00", feeling: "good", notes: "Valentine's Day long run with Wrigley pacing me." },
];

async function main() {
  console.log("Seeding runs...");
  
  for (const run of runs) {
    await prisma.runLog.upsert({
      where: { week_day: { week: run.week, day: run.day } },
      update: run,
      create: run,
    });
    console.log(`✓ Week ${run.week} Day ${run.day}: ${run.actualMiles} miles`);
  }
  
  console.log("\n✅ Done! Seeded", runs.length, "runs");
  
  // Calculate totals
  const totalMiles = runs.reduce((sum, r) => sum + r.actualMiles, 0);
  console.log(`Total miles: ${totalMiles}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
