-- Step 1: Rename timer_history to timer_events
ALTER TABLE "timer_history" RENAME TO "timer_events";

-- Step 2: Add new columns
ALTER TABLE "timer_events" ADD COLUMN "started_at" TIMESTAMP WITH TIME ZONE;
ALTER TABLE "timer_events" ADD COLUMN "ended_at" TIMESTAMP WITH TIME ZONE;

-- Step 3: Backfill existing data
-- For consumption (budget_used): elapsed = seconds, so started_at = created_at - seconds
UPDATE "timer_events"
SET
  ended_at = created_at,
  started_at = created_at - (seconds * interval '1 second')
WHERE event_type = 'budget_used';

-- For earned: need to reverse the earning calculation
-- earned_seconds = floor(elapsed * denominator / numerator)
-- so elapsed_seconds ≈ ceil(earned_seconds * numerator / denominator)
UPDATE "timer_events" te
SET
  ended_at = te.created_at,
  started_at = te.created_at - (
    CEIL(te.seconds * et.ratio_numerator / et.ratio_denominator) * interval '1 second'
  )
FROM "earning_types" et
WHERE te.event_type = 'earned'
  AND te.earning_type_id = et.id;

-- For bonus/simulated events: treat as instant events
UPDATE "timer_events"
SET
  ended_at = created_at,
  started_at = created_at
WHERE event_type IN ('bonus_added', 'bonus_subtracted', 'simulated_earned');

-- Step 4: Migrate active timers into timer_events
INSERT INTO "timer_events" (kid_id, event_type, budget_type_id, earning_type_id, started_at, ended_at, seconds, created_at)
SELECT
  kid_id,
  'in_progress',
  budget_type_id,
  earning_type_id,
  started_at,
  NULL,
  0,
  started_at
FROM "active_timers";

-- Step 5: Drop active_timers table
DROP TABLE "active_timers";

-- Step 6: Create indexes for efficient queries

-- Fast active timer lookup (replaces unique constraint from active_timers)
CREATE UNIQUE INDEX "unique_active_timer_per_kid" ON "timer_events" (kid_id) WHERE ended_at IS NULL;

-- History queries (pagination, filtering by kid and time)
CREATE INDEX "idx_timer_events_kid_ended" ON "timer_events" (kid_id, ended_at DESC NULLS FIRST);
