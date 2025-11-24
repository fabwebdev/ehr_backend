-- Legacy destructive migration intentionally disabled.
-- The schema corrections this file once performed are now covered by
-- earlier idempotent migrations, and running them on an existing database
-- would drop critical tables (users, roles, etc.) that other tables depend on.
-- We keep a no-op body so the migration still registers as applied.
DO
$migration$
BEGIN
    RAISE NOTICE 'Skipping legacy users/roles rebuild migration (0005_fix_users_table).';
END $migration$;