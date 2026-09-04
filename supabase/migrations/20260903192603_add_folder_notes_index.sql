-- Serves useNotesList(folder.id) and useNotesList(null) —
-- folder-scoped queries, sorted by date within that folder.
create index idx_notes_user_folder_created_at on public.notes (user_id, folder_id, created_at desc);

-- The plain 2-column (user_id, folder_id) index is now fully redundant —
-- this new composite index serves any query that only needs those two
-- columns too, via Postgres's leftmost-prefix rule. Safe to drop.
drop index if exists idx_notes_user_folder;

-- idx_notes_user_created_at (user_id, created_at desc) is NOT touched here —
-- it's still the only index that correctly serves useNotesList() with no
-- folder filter, sorted by date. Keep it.