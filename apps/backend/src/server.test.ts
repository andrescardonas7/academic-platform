/* eslint-env jest */
/* global jest, describe, it, expect, beforeEach, afterEach */

import request from 'supertest';
import app from './server';

describe('GET /health', () => {
  it('should return 200 OK and status info', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('version');
  });
});
