DROP TABLE IF EXISTS endpoints;
DROP TABLE IF EXISTS bins;


CREATE TABLE bins (
  id serial PRIMARY KEY,
  username text DEFAULT 'admin'
);
CREATE TABLE endpoints (
  id serial PRIMARY KEY,
  path text UNIQUE NOT NULL,
  binid int NOT NULL,
  FOREIGN KEY (binid) REFERENCES bins(id)
);

INSERT INTO bins (id) VALUES (1);
