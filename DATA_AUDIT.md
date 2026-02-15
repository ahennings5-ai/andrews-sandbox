# Data Consistency Audit

## Data Sources

### Marathon
- **Source**: `/api/runs` → Prisma `RunLog` table
- **Dashboard**: Fetches runs, sums `actualMiles`, counts runs this week
- **Marathon Page**: Same source, uses `state.logs` 

**Stats Calculated:**
| Stat | Formula | Source |
|------|---------|--------|
| Total Miles | `runs.reduce(sum + actualMiles)` | /api/runs |
| Runs This Week | `runs.filter(date >= weekStart).length` | /api/runs |
| Streak | HARDCODED to 5 ⚠️ | Needs calculation |

### Ideas
- **Source**: `/api/ideas` → Prisma `BusinessIdea` table
- **Dashboard**: Fetches all, counts total/new/upvoted
- **Ideas Page**: Same source

**Stats Calculated:**
| Stat | Formula | Source |
|------|---------|--------|
| Total | `ideas.length` | /api/ideas |
| New | `ideas.filter(status === "new").length` | /api/ideas |
| Upvoted | `ideas.filter(layer >= 2).length` | /api/ideas |

### Dynasty
- **Source**: `/api/dynasty/teams`, `/api/dynasty/players`, `/api/dynasty/sync`
- **Values**: NOW uses LIVE values from `dynasty-values.ts`
- **Dashboard**: Fetches teams, finds rosterId=1, calculates rank

**Stats Calculated:**
| Stat | Formula | Source |
|------|---------|--------|
| Team Value | `roster.reduce(sum + getLiveValue(name))` | LIVE from dynasty-values.ts |
| Rank | `sortedTeams.findIndex(rosterId === 1) + 1` | Calculated from teams list |
| Mode | `settings.mode` or `team.mode` | /api/dynasty/sync |

## Known Issues Fixed

1. ✅ **Dynasty values were stale** - Now using LIVE values from file
2. ✅ **Single team query not recalculating** - Now recalculates totalValue
3. ✅ **Dashboard optional chaining** - Added proper null checks
4. ✅ **Marathon state safety** - Added initialization checks

## Remaining Issues

1. ⚠️ **Streak is hardcoded to 5** - Should calculate from consecutive run dates
2. ⚠️ **Trade history API** - Needs to parse Sleeper transactions properly
3. ⚠️ **Mode on dashboard vs dynasty page** - Should pull from same source

## Player Value Verification (Feb 15, 2026)

| Player | Drew Value | KTC | Expected |
|--------|-----------|-----|----------|
| Travis Etienne | 4,500 | 2,090 | ✅ |
| Tyler Shough | 4,050 | 1,369 | ✅ |
| DJ Moore | 3,800 | 1,103 | ✅ |
| JJ McCarthy | 3,650 | 1,077 | ✅ |
| Oronde Gadsden | 3,150 | 797 | ✅ |

## My Team Total (Hendawg55)

Should be sum of LIVE values for all players on roster.
