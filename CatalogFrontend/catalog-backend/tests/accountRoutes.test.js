const request = require('supertest');
const app = require('../app');
const { sequelize, Teacher, Student } = require('../models');

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
});

afterAll(async () => {
  await sequelize.close();
});

describe('🔧 Account Routes', () => {

  test('PUT /changeUsername - change teacher name successfully', async () => {
    const res = await request(app).put('/changeUsername').send({
      newName: 'Prof. Smith',
      mail: 'teacher@test.com',
      isTeacher: true
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Username changed succesfully');

    const updated = await Teacher.findOne({ where: { email: 'teacher@test.com' } });
    expect(updated.name).toBe('Prof. Smith');
  });

  test('PUT /changeUsername - fail if email not found', async () => {
    const res = await request(app).put('/changeUsername').send({
      newName: 'Nobody',
      mail: 'notfound@test.com',
      isTeacher: true
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'This email is not found');
  });

  test('PUT /changePassword - change student password successfully', async () => {
    const res = await request(app).put('/changePassword').send({
      mail: 'student@test.com',
      oldPassword: 'stud123',
      newPassword: 'newpass',
      isTeacher: false
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Username changed succesfully');

    const updated = await Student.findOne({ where: { email: 'student@test.com' } });
    expect(updated.password).toBe('newpass');
  });

  test('PUT /changePassword - fail on wrong old password', async () => {
    const res = await request(app).put('/changePassword').send({
      mail: 'student@test.com',
      oldPassword: 'wrongpass',
      newPassword: 'newpass123',
      isTeacher: false
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Wrong password');
  });

});
