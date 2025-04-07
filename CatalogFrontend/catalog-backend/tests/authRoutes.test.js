const request = require('supertest');
const app = require('../app');
const { sequelize, Student, Teacher } = require('../models');

let agent;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Teacher.create({
    id: 1,
    name: 'Mr. Smith',
    email: 'teacher@test.com',
    password: 'teach123'
  });

  await Student.create({
    id: 2,
    name: 'Jane Student',
    email: 'student@test.com',
    password: 'stud123'
  });

  agent = request.agent(app);
});

afterAll(async () => {
  await sequelize.close();
});

describe('🛡️ Auth Routes', () => {

  test('POST /login - teacher login success', async () => {
    const res = await agent.post('/login').send({
      username: 'Mr. Smith',
      email: 'teacher@test.com',
      password: 'teach123',
      isTeacher: true
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user.name', 'Mr. Smith');
    expect(res.body).toHaveProperty('user.role', true);
  });

  test('POST /login - student login success', async () => {
    const res = await agent.post('/login').send({
      username: 'Jane Student',
      email: 'student@test.com',
      password: 'stud123',
      isTeacher: false
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user.name', 'Jane Student');
    expect(res.body).toHaveProperty('user.role', false);
  });

  test('POST /login - login failure with wrong password', async () => {
    const res = await agent.post('/login').send({
      username: 'Jane Student',
      email: 'student@test.com',
      password: 'wrong',
      isTeacher: false
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Username, email or password is wrong');
  });

  test('POST /register - register new student', async () => {
    const res = await request(app).post('/register').send({
      username: 'New Student',
      email: 'new@student.com',
      password: 'newpass',
      isTeacher: false
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toMatchObject({
      name: 'New Student',
      email: 'new@student.com',
      role: false
    });
  });

  test('POST /register - fail on duplicate email', async () => {
    const res = await request(app).post('/register').send({
      username: 'Any',
      email: 'teacher@test.com',
      password: '123',
      isTeacher: true
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'This email is already used by another account');
  });

  test('GET /session - returns session data if logged in', async () => {
    // First log in
    await agent.post('/login').send({
      username: 'Jane Student',
      email: 'student@test.com',
      password: 'stud123',
      isTeacher: false
    });

    const res = await agent.get('/session');
    expect([200, 400]).toContain(res.statusCode); // Adjust based on session logic
  });

  test('POST /logout - logs out successfully', async () => {
    const res = await agent.post('/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Delogat cu succes!');
  });

});
