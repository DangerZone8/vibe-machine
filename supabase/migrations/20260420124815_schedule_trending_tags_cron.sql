/*
  # Schedule fetch-trending-tags edge function every 24 hours

  ## Summary
  Uses pg_cron + pg_net to call the fetch-trending-tags edge function
  automatically every 24 hours so trending data stays fresh.

  ## Notes
  - Runs at midnight UTC daily
  - pg_cron and pg_net must be enabled (available on all Supabase projects)
*/

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('fetch-trending-tags-daily');
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'fetch-trending-tags-daily',
      '0 0 * * *',
      $job$
      SELECT net.http_post(
        url := current_setting('app.supabase_url', true) || '/functions/v1/fetch-trending-tags',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
      );
      $job$
    );
  END IF;
END $$;
