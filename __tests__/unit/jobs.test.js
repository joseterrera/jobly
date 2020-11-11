// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

const {
  TEST_DATA,
  afterEachHook,
  beforeEachHook,
  afterAllHook
} = require("./config");

beforeEach(async () => {
  await beforeEachHook(TEST_DATA);
});

describe("POST /jobs", async function () {
  test("Creates a new job", async function () {
    const response = await request(app)
        .post(`/jobs`)
        .send({
          _token: TEST_DATA.userToken,
          company_handle: TEST_DATA.currentCompany.handle,
          title: "Software Engineer in Test",
          salary: 1000000,
          equity: 0.2
        });
    expect(response.statusCode).toBe(201);
    expect(response.body.job).toHaveProperty("id");
  });

  test("Prevents creating a job without required title field", async function () {
    const response = await request(app)
        .post(`/jobs`)
        .send({
          _token: TEST_DATA.userToken,
          salary: 1000000,
          equity: 0.2,
          company_handle: TEST_DATA.currentCompany.handle
        });
    expect(response.statusCode).toBe(400);
  });
});


describe("GET /jobs", async function () {
  test("Gets a list of 1 job", async function () {
    const response = await request(app).get(`/jobs`);
    const jobs = response.body.jobs;
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toHaveProperty("company_handle");
    expect(jobs[0]).toHaveProperty("title");
  });

  test("Has working search", async function () {
    await request(app)
        .post(`/jobs`)
        .send({
          title: "Software Engineer in Test",
          salary: 1000000,
          equity: 0.2,
          company_handle: TEST_DATA.currentCompany.handle,
          _token: TEST_DATA.userToken
        });
  await request(app)
        .post(`/jobs`)
        .send({
          title: "Web Dev",
          salary: 1000000,
          company_handle: TEST_DATA.currentCompany.handle,
          _token: TEST_DATA.userToken
        });
  const response = await request(app)
        .get("/jobs?search=web+dev")
        .send({_token: TEST_DATA.userToken});
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs[0]).toHaveProperty("company_handle");
    expect(response.body.jobs[0]).toHaveProperty("title");
  });
});




