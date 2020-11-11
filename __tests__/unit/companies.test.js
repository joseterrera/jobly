// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');

const {
  TEST_DATA,
  afterEachHook,
  beforeEachHook,
  afterAllHook
} = require('./config');


beforeEach(async function() {
  await beforeEachHook(TEST_DATA);
});

describe('POST /companies', async function() {
  test('Creates a new company', async function() {
    const response = await request(app)
      .post('/companies')
      .send({
        handle: 'whiskey',
        name: 'Whiskey',
        _token: TEST_DATA.userToken
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.company).toHaveProperty('handle');
  });
  
  test('Prevents creating a company with duplicate handle', async function() {
    const response = await request(app)
      .post('/companies')
      .send({
        _token: TEST_DATA.userToken,
        handle: 'rithm',
        name: 'Test'
      });
    expect(response.statusCode).toBe(400);
  });
});