const request = require('supertest');
const app = require('../src/app');

describe('Dealer Endpoints', () => {
    it('debería obtener todos los dealers', async () => {
        const res = await request(app).get('/dealers');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
