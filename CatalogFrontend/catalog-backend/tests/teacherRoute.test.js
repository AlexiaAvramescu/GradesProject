const request = require('supertest');
const app = require('../app'); // Make sure app doesn't call listen()
const { sequelize, Teacher, Student, Subject } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed base data
  await Teacher.create({
    id: 1,
    name: 'John Doe',
    email: 'teacher@example.com',
    password: 'securepassword'
  });

  await Student.create({
    id: 1,
    name: 'Jane Student',
    email: 'student@example.com',
    password: 'studentpass'
  });

  await Subject.create({
    id: 1,
    name: 'Test Class',
    teacherId: 1
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('📘 Subject Routes Tests', () => {
  test('POST /subjects - should create a new subject', async () => {
    const res = await request(app)
      .post('/subjects')
      .send({ name: 'Math', teacherId: 1 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Math');
    expect(res.body).toHaveProperty('teacherId', 1);
  });

  test('POST /subjects/enroll-students - should enroll student to subject', async () => {
    const res = await request(app)
      .post('/subjects/enroll-students')
      .send({ teacherId: 1, subjectId: 1, studentIds: [1] });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Students enrolled successfully.');
    expect(res.body).toHaveProperty('studentCount', 1);
  });

  test('POST /subjects/remove-students - should remove student from subject', async () => {
    const res = await request(app)
      .post('/subjects/remove-students')
      .send({ teacherId: 1, subjectId: 1, studentIds: [1] });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Students removed from class.');
    expect(res.body).toHaveProperty('studentCount', 1);
  });

  test('GET /subjects - should list subjects for teacher', async () => {
    const res = await request(app)
      .get('/subjects')
      .query({ teacherId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });

  test('GET /subjects/students - should return students enrolled in a class', async () => {
    // Re-enroll student first
    await request(app)
      .post('/subjects/enroll-students')
      .send({ teacherId: 1, subjectId: 1, studentIds: [1] });

    const res = await request(app)
      .get('/subjects/students')
      .query({ classId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name', 'Jane Student');
  });

  test('GET /students/not-in-class - should list students not in subject', async () => {
    // Remove student again
    await request(app)
      .post('/subjects/remove-students')
      .send({ teacherId: 1, subjectId: 1, studentIds: [1] });

    const res = await request(app)
      .get('/students/not-in-class')
      .query({ classId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(s => s.id === 1)).toBeDefined();
  });
});
