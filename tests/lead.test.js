const request = require('supertest');
const app = require('../src/app');

describe('Lead Endpoints', () => {
    it('debería crear un lead correctamente', async () => {
        // Este ID debe existir en tu DB
        const dealerId = 3;
        const postId = 2;

        const leadData = {
            name: 'Test',
            lastname: 'Lead',
            email: 'test.lead@example.com',
            phone: '3811111111',
            postId: postId
        };

        const res = await request(app)
            .post(`/leads/dealer/${dealerId}/leads`)
            .send(leadData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe(leadData.name);
        expect(res.body.email).toBe(leadData.email);
    });
});
