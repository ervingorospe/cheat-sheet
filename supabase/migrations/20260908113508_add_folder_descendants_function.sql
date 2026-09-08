create or replace function public.get_descendant_folder_ids(folder_id uuid)
returns table (id uuid) as $$
  with recursive descendants as (
    select f.id from public.folders f where f.id = folder_id
    union all
    select f.id from public.folders f
    join descendants d on f.parent_folder_id = d.id
  )
  select id from descendants;
$$ language sql stable security definer set search_path = public;