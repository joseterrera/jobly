CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT
);

-- The jobs table has a one to many relationship with companies which means there is a foreign key in the jobs table that references the companies table. In this relationship, one company has many jobs, and each job belongs to a single company.
-- When a company is deleted, all jobs in that company are deleted as well.

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE
);

CREATE TABLE applications(
    username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    job_id INTEGER  REFERENCES jobs ON DELETE CASCADE,
    state TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY(username, job_id)
);