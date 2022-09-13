const request = require('supertest');
const { response } = require('../../app');
const app = require('../../app');
const { mongoConnect,
    mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    })

    describe('Test GET /launches', () => {
        test('should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    })
    const completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 177",
        target: "Kepler-296 f",
        launchDate: "January 4, 2028"
    };

    const launchDataWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 177",
        target: "Kepler-296 f",
    };

    const launchDataWithInvalidDate = {
        mission: "USS Enterprise",
        rocket: "NCC 177",
        target: "Kepler-296 f",
        launchDate: "August 42, 2029"
    };

    describe('Test POST /launches', () => {
        test('should respond with 201 created ', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate)
        });
        test('should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        });
        test('should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Invalid date',
            })
        });
    });
})

