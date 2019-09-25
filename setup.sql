create table if not exists "user" (
  user_id serial primary key,
  email text unique not null,
  password text not null,
  first_name text not null,
  last_name text not null,
  phone_number text not null,
  created_at timestamptz not null default current_timestamp,
  updated_at timestamptz
);