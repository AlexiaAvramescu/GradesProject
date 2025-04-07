const request = require('supertest');
const app = require('../app');
const { sequelize, Teacher, Student, Subject, Assignment, StudentAssignment } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed base data
  await Teacher.create({ id: 1, name: 'Test Teacher', email: 'teacher@test.com', password: 'pass123' });
  await Student.create({ id: 1, name: 'Test Student', email: 'student@test.com', password: 'pass123' });
  await Subject.create({ id: 1, name: 'Test Subject', teacherId: 1 });
  await Assignment.create({ id: 1, title: 'Assignment 1', subjectId: 1, description: 'Test assignment' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('📚 Grade Routes', () => {

  test('POST /grades - add or update grades for students', async () => {
    const res = await request(app)
      .post('/grades')
      .send({
        assignmentId: 1,
        studentIds: [1],
        grade: 9.5
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Grades added/updated successfully');
  });

  test('GET /grades?assignmentId=1 - fetch grades for assignment', async () => {
    const res = await request(app).get('/grades').query({ assignmentId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      studentId: 1,
      assignmentId: 1,
      grade: 9.5
    });
  });

  test('PUT /grades - update grade for a student', async () => {
    const res = await request(app)
      .put('/grades')
      .send({
        assignmentId: 1,
        studentId: 1,
        grade: 8.75
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Grade updated successfully');
    expect(res.body.updatedGrade.grade).toBe(8.75);
  });

  test('GET /history?teacherId=1 - fetch grade history for teacher', async () => {
    const res = await request(app).get('/history').query({ teacherId: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      className: 'Test Subject',
      assignmentName: 'Assignment 1',
      studentName: 'Test Student',
      grade: 8.75
    });
  });

  test('DELETE /grades - delete student grade from assignment', async () => {
    const res = await request(app)
      .delete('/grades')
      .send({
        assignmentId: 1,
        studentIds: [1]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Grades deleted successfully');
  });

  test('GET /subjects/:id - get subject by id', async () => {
    const res = await request(app).get('/subjects/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Subject');
  });

});
