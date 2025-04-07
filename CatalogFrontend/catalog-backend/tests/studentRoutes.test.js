const request = require('supertest');
const app = require('../app');
const {
  sequelize,
  Student,
  Teacher,
  Subject,
  Assignment,
  StudentAssignment
} = require('../models');

let agent;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Seed data
  const teacher = await Teacher.create({
    name: 'Test Teacher',
    email: 'teacher@example.com',
    password: 'password'
  });

  const student = await Student.create({
    id: 1,
    name: 'Test Student',
    email: 'student@example.com',
    password: 'password'
  });

  const subject = await Subject.create({
    id: 1,
    name: 'Math',
    teacherId: teacher.id
  });

  await subject.addStudent(student); // Enroll student

  const assignment1 = await Assignment.create({ id: 1, title: 'HW 1', subjectId: 1 });
  const assignment2 = await Assignment.create({ id: 2, title: 'HW 2', subjectId: 1 });

  await StudentAssignment.create({ studentId: 1, assignmentId: 1, grade: 8 });
  await StudentAssignment.create({ studentId: 1, assignmentId: 2, grade: 10 });

  // Simulate login for session-based test
  agent = request.agent(app);
  if (process.env.NODE_ENV === 'test') {
    await agent.post('/test-login').send({ userId: 1 });
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe('📚 Student Assignment Routes', () => {

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
});
