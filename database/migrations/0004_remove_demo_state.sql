-- Remove fixture records that earlier UI versions automatically persisted.
update fithub_state
set data = jsonb_set(
  jsonb_set(data - 'completed', '{activity}', '[]'::jsonb, true),
  '{workouts}',
  coalesce((
    select jsonb_agg(workout)
    from jsonb_array_elements(coalesce(data->'workouts', '[]'::jsonb)) as workout
    where workout->>'id' not in ('push', 'lower', 'pull')
  ), '[]'::jsonb),
  true
)
where coalesce(data->'workouts', '[]'::jsonb) @> '[{"id":"push"}]'::jsonb
   or coalesce(data->'workouts', '[]'::jsonb) @> '[{"id":"lower"}]'::jsonb
   or coalesce(data->'workouts', '[]'::jsonb) @> '[{"id":"pull"}]'::jsonb;

update couple_planner_data
set data = jsonb_build_object(
  'calendar', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'calendar', '[]'::jsonb)) item where item->>'id' not in ('event-1', 'event-2', 'event-3')), '[]'::jsonb),
  'tasks', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'tasks', '[]'::jsonb)) item where item->>'id' not in ('task-1', 'task-2', 'task-3')), '[]'::jsonb),
  'dates', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'dates', '[]'::jsonb)) item where item->>'id' not in ('date-1', 'date-2')), '[]'::jsonb),
  'trips', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'trips', '[]'::jsonb)) item where item->>'id' <> 'trip-1'), '[]'::jsonb),
  'recipes', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'recipes', '[]'::jsonb)) item where item->>'id' not in ('recipe-1', 'recipe-2')), '[]'::jsonb),
  'entertainment', coalesce((select jsonb_agg(item) from jsonb_array_elements(coalesce(data->'entertainment', '[]'::jsonb)) item where item->>'id' not in ('media-1', 'media-2', 'media-3')), '[]'::jsonb)
)
where coalesce(data->'calendar', '[]'::jsonb) @> '[{"id":"event-1"}]'::jsonb
   or coalesce(data->'tasks', '[]'::jsonb) @> '[{"id":"task-1"}]'::jsonb
   or coalesce(data->'dates', '[]'::jsonb) @> '[{"id":"date-1"}]'::jsonb
   or coalesce(data->'trips', '[]'::jsonb) @> '[{"id":"trip-1"}]'::jsonb
   or coalesce(data->'recipes', '[]'::jsonb) @> '[{"id":"recipe-1"}]'::jsonb
   or coalesce(data->'entertainment', '[]'::jsonb) @> '[{"id":"media-1"}]'::jsonb;
