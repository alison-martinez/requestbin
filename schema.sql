CREATE TABLE endpoints (
  id serial PRIMARY KEY,
  path text UNIQUE NOT NULL
)
