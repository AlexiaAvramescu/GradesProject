const request = require('supertest');
const app = require('../app');
const { sequelize, Teacher, Subject, Assignment } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed necessary data
  await Teacher.create({
    id: 1,
    name: 'Test Teacher',
    email: 'teacher@test.com',
    password: 'pass123'
  });

  await Subject.create({
    id: 1,
    name: 'Test Subject',
    teacherId: 1
  });

  await Assignment.create({
    id: 1,
    title: 'Original Assignment',
    description: 'Original Description',
    subjectId: 1
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('📒 Assignment Routes', () => {
  test('GET /assignments?subjectId=1 - should return assignments', async () => {
    const res = await request(app).get('/assignments').query({ subjectId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title');
  });

  test('POST /assignments - should create a new assignment', async () => {
    const res = await request(app)
      .post('/assignments')
      .send({
        subjectId: 1,
        title: 'New Assignment',
        description: 'Test description'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Assignment');
    expect(res.body).toHaveProperty('subjectId', 1);
  });

  test('PUT /assignments - should update an assignment', async () => {
    const res = await request(app)
      .put('/assignments')
      .send({
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
  });

  test('DELETE /assignments - should delete assignment', async () => {
    const res = await request(app)
      .delete('/assignments')
      .send({ id: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Assignment deleted successfully.');
  });
});
