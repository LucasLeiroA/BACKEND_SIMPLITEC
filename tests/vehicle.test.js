const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Vehicle Endpoints (requiere JWT)', () => {
    let token;
    const dealerId = 3;

    beforeAll(async () => {
        const email = 'userCordoba123@gmail.com';
        const password = 'admin123';
        const role = 'dealer';

        const existing = await prisma.user.findUnique({ where: { email } });
        if (!existing) {
            await request(app).post('/auth/register').send({ email, password, role, dealerId });
        }

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email, password });

        token = loginRes.body.token;
    });

    it('debería crear un vehículo correctamente', async () => {
        const vehicleData = {
            dealerId,
            brand: 'TestMarca',
            model: 'TestModelo',
            year: 2024,
            price: 50000,
            fuelType: 'Nafta',
            transmission: 'Manual',
            doors: 5,
            bodyType: 'Hatchback',
            stock: 3
        };

        const res = await request(app)
            .post('/vehicles')
            .set('Authorization', `Bearer ${token}`)
            .send(vehicleData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.model).toBe(vehicleData.model);
    });
});
