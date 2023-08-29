const request = require('supertest');
const user = require('./user');

describe('API Tests', () => {
  it('fetches user data from API', async () => {
    const userId = 1;
    const response = await request(user).get(`/api`);

    expect(response.status).toBe(200 | 304);
  });

  // TODO: Add more test cases for other routes and scenarios
});
