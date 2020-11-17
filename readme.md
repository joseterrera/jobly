add gitignore
npm init
npm install express bcypt json schema, jsonwebtoken morgan pg
create two databases one to test

adding unit test for partial update, check this step

create a table for company
add a schema for this table
create routes


what does returning do?
The RETURNING clause allows you to retrieve values of columns (and expressions based on columns) that were modified by an insert, delete or update. Without RETURNING, you would have to run a SELECT statement after the DML statement is completed, in order to obtain the values of the changed columns. So, RETURNING helps avoid another roundtrip to the database, another context switch in a PL/SQL block.


schemas
.Basically, the idea is to specify the data that we expect to be received from our request, to verify that correct JSON data was passed that we can then further use in our route. Keep in mind about any discrepancies when comparing it to the solution - for example, you should also define the "_token" field in the JSON data that you are expecting to be sent to the backend route (that's part of the authentication of the user).


const {
  TEST_DATA,
  afterEachHook,
  beforeEachHook,
  afterAllHook
} = require("./config");


const BCRYPT_WORK_FACTOR = 10;

   const userJobsRes = await db.query(
      `SELECT j.title, j.company_handle, a.state 
        FROM applications AS a
          JOIN jobs AS j ON j.id = a.job_id
        WHERE a.username = $1`,
      [username]
    );

    user.jobs = userJobsRes.rows;
    return user;

    check partial update on all models



    USERS

find all
how do you test on insomnia that there is authrequired?
http://localhost:3000/ GET

http://localhost:3000/:username GET


http://localhost:3000/ POST


http://localhost:3000/:username PATCH


http://localhost:3000/:username DELETE



JOB

http://localhost:3000/ GET

http://localhost:3000/ POST

http://localhost:3000/:id PATCH

http://localhost:3000/:id DELETE


AUTH
http://localhost:3000/login

COMPANIES

http://localhost:3000/ GET

http://localhost:3000/:handle GET

http://localhost:3000/ POST

http://localhost:3000/:handle PATCH

http://localhost:3000/:handle DELETE


{

"username": "test",
"password": "testing123",
"first_name": "Jose",
"last_name": "Testing",
"email": "test@yahoo.com",
"photo_url":  "https://picsum.photos/200/300",
"is_admin": true

}