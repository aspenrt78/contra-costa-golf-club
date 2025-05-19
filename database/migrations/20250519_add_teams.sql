-- 1) Create the teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- 2) Add a team_id column to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS team_id INTEGER REFERENCES teams(id);
