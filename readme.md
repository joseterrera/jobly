### Jobly

This application has similar functionality to linkedin but at a smaller scale.

### To Run The Application

1. Run `npm install` to add all the necessary libraries (express bcypt json schema, jsonwebtoken morgan pg => some of these are explained below).
2. On the terminal type psql and then `CREATE DATABASE jobly;`
3. After that, also create one database for tests`CREATE DATABASE jobly_test;`
4. Exit psql and then type `psql jobly < data.sql` to import the tables.
5. Repeat the same step for the tests `psql jobly_test < data.sql`.
6. Seed the jobly database to add an admin user and some companies.
7. Run `npm start` or `npm dev` if you want to use nodemon and make changes.
8. To run tests type `npm test`.


### Use Cases 
These are some use cases that should help you navigate the app, while using insomnia.

We have some admin users that we added directly to our database in our seed file. The schemas directory will show us what are the required fields whenever we add a new user/job/company or update them.


### User Routes

1. We want to create a new user:

POST http://localhost:3001/users

input: 
```json
{
	"username" : "whiskey22",
  "first_name": "Whiskey22",
  "password": "foo123",
  "last_name": "Lane",
  "email": "whiskey22@rithmschool.com"
}
```


output: will give us a token which we can use to view users/jobs/companies, but does not give you is_admin status. This by default is false.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkiLCJpYXQiOjE2MDU2NTc0MDZ9.8YoPbTsLsHEFrJUkgIKtOL5RFAqcln62mAgkgyNQJ5Y"
}
```

2. View a list of users, use the token you got when you successfuly registered (adjust token to _token).  
GET http://localhost:3001/users

input: 
  ```json
  {
    "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA"
  }
  ```

  output:
  ```json
  {
    "users": [
      {
        "username": "whiskey",
        "first_name": "Whiskey",
        "last_name": "Lane",
        "email": "whiskey@rithmschool.com"
      },
      {
        "username": "whiskey1",
        "first_name": "Whiskey1",
        "last_name": "Lane1",
        "email": "whiskey1@rithmschool.com"
      },
      {
        "username": "whiskey2",
        "first_name": "Whiskey2",
        "last_name": "Lane1",
        "email": "whiskey2@rithmschool.com"
      },
      {
        "username": "whiskey22",
        "first_name": "Whiskey22",
        "last_name": "Lane1",
        "email": "whiskey22@rithmschool.com"
      }
    ]
  }
  ```


3. View a user's info.   
GET http://localhost:3000/users/whiskey2


input: 
```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA"
}
```
output:

```json
{
  "user": {
    "username": "whiskey2",
    "first_name": "Whiskey2",
    "last_name": "Lane1",
    "photo_url": null,
    "jobs": []
  }
}
```


4. 

http://localhost:3000/:username PATCH
whiskey 22 can patch only their own info, not all details. Such as, he cannot change the is_admin status.

```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA",
"first_name": "new_name again",
"is_admin": true
}

```

```json
{
  "status": 400,
  "message": "You are not allowed to change username or is_admin properties."
}
```

correct input:

```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA",
"first_name": "new_name"
}
```

output:

```json
{
  "user": {
    "username": "whiskey22",
    "first_name": "new_name",
    "last_name": "Lane1",
    "email": "whiskey22@rithmschool.com",
    "photo_url": null
  }
}
```

4. Delete a particular user  
DELETE http://localhost:3000/whiskey22


We first need to ensure the user is deleting himself:
input: 
```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA"
}
```

output: 
```json
{
  "message": "User deleted"
}
```

We can then check and it won't appear on the user's list, nor the user's page.

GET http://localhost:3000/users/

input:
```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndoaXNrZXkyMiIsImlhdCI6MTYwNTY3MzQ3OH0.RAhH28Qq-onU23ynAn9hLphlitr0dELtTb7ImquwklA"
}

```

output:

```json
{
  "users": [
    {
      "username": "whiskey",
      "first_name": "Whiskey",
      "last_name": "Lane",
      "email": "whiskey@rithmschool.com"
    },
    {
      "username": "whiskey1",
      "first_name": "Whiskey1",
      "last_name": "Lane1",
      "email": "whiskey1@rithmschool.com"
    },
    {
      "username": "whiskey2",
      "first_name": "Whiskey2",
      "last_name": "Lane1",
      "email": "whiskey2@rithmschool.com"
    }
  ]
}
```


### Auth and Companies Routes

We can view these routes without being an admin, but in order to make changes you need to be an admin, which is why we will login an admin user.

5. Login an admin user
POST http://localhost:3000/login

input:
```json
{
	"username" : "test",
  "password": "secret"
}
```

output:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

6. View all companies:

input: needs to be authenticated

```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output:
```json
{
  "companies": [
    {
      "handle": "apple",
      "name": "apple inc"
    },
    {
      "handle": "nike",
      "name": "nike inc"
    },
    {
      "handle": "rithm",
      "name": "rithm school"
    },
    {
      "handle": "starbucks",
      "name": "starbucks inc"
    }
  ]
}
```

7. View one company  

GET http://localhost:3000/nike

input:
```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```
output: 
```json 
{
  "company": {
    "handle": "nike",
    "name": "nike inc",
    "num_employees": 200,
    "description": null,
    "logo_url": null,
    "jobs": [
      {
        "id": 3,
        "title": "barista",
        "salary": 200000,
        "equity": null
      }
    ]
  }
}

```

8. Post a new company  
POST http://localhost:3000/companies

input:
```json
{
  "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk",
	"name": "Macys Inc",
	"handle": "macys"
}
```

output:
```json
{
  "company": {
    "handle": "macys",
    "name": "Macys Inc",
    "num_employees": null,
    "description": null,
    "logo_url": null
  }
}
```

9. Modify a company's field. Not all fields can be modified. Handle, in this case, cannot be modified and will display an error status.

PATCH http://localhost:3000/macys

input:
```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk",
	"name": "Macys Incorporated"
}

```

output:
```json
{
  "company": {
    "handle": "macys",
    "name": "Macys Incorporated",
    "num_employees": null,
    "description": null,
    "logo_url": null
  }
}
```

if we try to change the handle, then:  
input: 

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk",
	"name": "Macys Incorporated",
	"handle": "macysinc"
}
```

output:

```json
{
  "status": 400,
  "message": "You are not allowed to change the handle."
}

```

10. Delete a company

DELETE http://localhost:3000/macys

input:

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output:

```json
{
  "message": "Company deleted"
}
```

if company doesnt't exist, for instance we try to DELETE macys again, or we even try to GET that route: `http://localhost:3000/companies/macys`, the output will be the same:

input:

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output:

```json
{
  "status": 404,
  "message": "There exists no company 'macys"
}
```


JOBS

11. Show a list of all jobs
GET http://localhost:3000/jobs

input:
```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output: 
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "engineer",
      "company_handle": "apple"
    },
    {
      "id": 2,
      "title": "plumber",
      "company_handle": "apple"
    },
    {
      "id": 3,
      "title": "barista",
      "company_handle": "nike"
    }
  ]
}
```

12. Post a new job
POST http://localhost:3000/jobs

input:

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk",
	"title": "cook",
	"salary": 100000,
	"company_handle": "apple",
	"equity": 0.1
}
```



output

```json
{
  "job": {
    "id": 5,
    "title": "cook",
    "salary": 100000,
    "equity": 0.1,
    "company_handle": "apple"
  }
}

```

Now, we should see this job listed at these 2 different routes:  
GET http://localhost:3000/jobs  
GET http://localhost:3000/companies/apple


13. Use search functionality to find a job:

GET http://localhost:3000/jobs?search=cook

input --needs authentication:

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output:

```json
{
  "jobs": [
    {
      "id": 5,
      "title": "cook",
      "company_handle": "apple"
    }
  ]
}
```

14. Get a job by its id, if no job with that id return an error

GET http://localhost:3000/jobs/1

input - needs to authenticate:

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}

```
output:

```json
{
  "job": {
    "id": 1,
    "title": "engineer",
    "salary": 100000,
    "equity": null,
    "company_handle": "apple",
    "company": {
      "name": "apple inc",
      "num_employees": 1000,
      "description": null,
      "logo_url": null
    }
  }
}
```


15. Modify a field on a job. We can only update certain fields. If we change the id, it would display an error.  
PATCH http://localhost:3000/jobs/1

input: 

```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk",
	"salary": 200000,
	"equity": 0.9
}
```

output:  
Will display that change, not only here, but on the list of jobs, and other routes where this job appears (such as a company route)


16. Delete a job. Will display an error if job id does not exist. This change will be reflected on the GET route that gets a list of jobs, and will display a 404 on the route for this job.  
DELETE http://localhost:3000/jobs/5


input -must authenticate
```json
{
 "_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjA1NzQ2MzI0fQ.gcfuwvpFzOdHs3OxZgbmmmaNPbHcEiR4Grw-5gc9JHk"
}
```

output:

```json
{
  "message": "Job deleted"
}
```



### Libraries we use on this application:

pg:
A node package to connect and execute SQL queries from Node.


bcrypt: This is a reliable hashing algorithm.
The way it works is we tell bcrypt how many rounds of hashing we want to use. The larger the number the longer it will take to hash it.

Bcrypt has basic methods, such as compare, hash. In our app, the request.body will include a username and password, which we will need to hash, using the work factor we specified, and save to the DB.

We will later need compare the password in the database and the user's password to determine if it is valid, and if the user can be authenticated. Refer to models/user.js.


After using bcrypt to register a user and encrypt their password, we will generate a JWT token, using the sign method.
jwt.sign(payload, secret-key, jwt-options)

payload: object to store as payload of token (it could be the username for an authenticated user).
secret-key: secret string used to “sign” token
jwt-options is optional object of settings for making the token (such as expiration)

The sign method will return a string, which will be used to access protected routes or routes that need authentication.

JWT

A JWT is a self-contained method that can be used securely transmit data between two endpoints. JWTs are most commonly used for user authentication. 
When a user first logs into the application, system backend issues a JWT to the user and sends it to the client-side. This token contains a special signature that validates the token as a one issued by the system. The client stores the token in the browser and sends it with every request to the server, where the token is used to verify the user’s authentication.

A JWT consists of 3 strings separated by periods. The 3 of them are the header, payload, and the signature. Follows is an example JWT token made of these 3 parts.

```js
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJteXdlYnNpdGUuY29tIiwiaWF0IjpudWxsLCJleHAiOjUxNDM3ODA4MDAwLCJhdWQiOiIiLCJzdWIiOiIiLCJpZCI6IjEyMzQ1OTEiLCJuYW1lIjoiTWFyeSBQb3BwaW5zIiwicm9sZSI6ImVkaXRvciJ9.LYKHdyKj6SnxYaRZH_ZhiW6yk31zaBQehYm4BgawH_o
```

JWT header contains metadata about the token in JSON format. 

The payload of a JWT stores information about the token and any other entity in JSON format. In our app, it would store the information in the request body.

The last part of a JWT token, the signature, is a Message Authentication Code that is used to verify the token was not modified or generated by an outsider except the authorized application servers.

So, all the data that is needed to verify the token and identify the user is stored in the token itself. There is no need to maintain any record of the token in the server, like store the token in a database as we do with sessions. This makes JWTs stateless.




In our

We user bcrypt to register a user and ecrypt their password, and check that password against that username


look for the token, verify it and add payload that we get back to the request itself.

if there is something in req.user it means it has been verified. if there is nothing, it has not been verified or there was no token.


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







