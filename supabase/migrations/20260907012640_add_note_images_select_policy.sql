create policy "Users can view their own note images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'note-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);