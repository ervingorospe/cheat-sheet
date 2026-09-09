create or replace function public.handle_new_user()
returns trigger as $$
declare
  full_name text := new.raw_user_meta_data ->> 'full_name';
  explicit_first_name text := new.raw_user_meta_data ->> 'first_name';
  explicit_last_name text := new.raw_user_meta_data ->> 'last_name';
  parsed_first_name text;
  parsed_last_name text;
begin
  if explicit_first_name is not null then
    parsed_first_name := explicit_first_name;
    parsed_last_name := explicit_last_name;
  elsif full_name is not null then
    parsed_first_name := split_part(full_name, ' ', 1);
    parsed_last_name := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  end if;

  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    parsed_first_name,
    parsed_last_name,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$ language plpgsql security definer set search_path = public;