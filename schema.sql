CREATE TABLE bins (
  id serial PRIMARY KEY,
  username text DEFAULT 'admin'
)
CREATE TABLE endpoints (
  id serial PRIMARY KEY,
  path text UNIQUE NOT NULL,
  binId int NOT NULL, 
  FOREIGN KEY (binId) REFERENCES bins(id)
)

INSERT INTO bins (id) VALUES (1);
