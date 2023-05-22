import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let server: request.SuperTest<request.Test>;

describe('testing account', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list accounts', (done) => {
    server
      .get('/api/accounts')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(2);
        expect(res.body.data).toHaveLength(res.body.total);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should show single account', (done) => {
    server
      .get('/api/accounts/2')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(2);
        expect(res.body.title).toBe('Secondary account');
        expect(res.body.currentValue).toBe(10000);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create account', (done) => {
    server
      .post('/api/accounts')
      .send({
        title: 'New account',
        currentValue: -2000
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.title).toBe('New account');
        expect(res.body.currentValue).toBe(-2000);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  describe('test daily report', () => {
    const today = new Date().toISOString();
    test('should list daily reports with zero results', (done) => {
      server
        .get('/api/accounts/2/daily-report/' + today.substring(0, 10))
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.currentDailyValue).toBe(0);
          expect(res.body.entries).toHaveLength(0);
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });

    test('should list daily reports', (done) => {
      server
        .post('/api/entries')
        .send({
          date: today,
          negotiationType: 'DEBIT',
          customerKey: '56c8e0cc-aaf1-4f32-b412-d0aa69425600',
          customerName: 'Company Zero',
          accountId: 3,
          items: [
            {
              referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
              title: 'Clean up',
              price: 1000
            },
            {
              referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
              title: 'Clean up',
              price: 1000
            }
          ]
        })
        .end(() => {
          server
            .post('/api/entries')
            .send({
              date: today,
              negotiationType: 'CREDIT',
              customerKey: '56c8e0cc-aaf1-4f32-b412-d0aa69425600',
              customerName: 'Company Zero',
              accountId: 3,
              items: [
                {
                  referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
                  title: 'Mechanical Keyboard',
                  price: 250
                }
              ]
            })
            .end(() => {
              server
                .get('/api/accounts/3/daily-report/' + today.substring(0, 10))
                .expect('Content-Type', /json/)
                .expect(200)
                .expect((res) => {
                  expect(res.body.currentDailyValue).toBe(-1750);
                  expect(res.body.entries).toHaveLength(2);
                })
                .end((err) => {
                  if (err) return done(err);
                  return done();
                });
            });
        });
    });
  });

  // test('should create account debit', (done) => {
  //   server
  //     .post('/api/accounts')
  //     .send({
  //       date: '2023-05-23T14:51:37.095Z',
  //       negotiationType: 'DEBIT',
  //       customerKey: '56c8e0cc-aaf1-4f32-b412-d0aa69425600',
  //       customerName: 'Company Zero',
  //       accountId: 1,
  //       items: [
  //         {
  //           referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
  //           title: 'Clean up',
  //           price: 1000
  //         }
  //       ]
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body.id).toBe(4);
  //     })
  //     .end((err) => {
  //       if (err) return done(err);
  //       return done();
  //     });
  // });

  // test('should return validation error', (done) => {
  //   server
  //     .post('/api/accounts')
  //     .send({
  //       date: '2023-05-23T14:51:37.095Z',
  //       negotiationType: 'ANY',
  //       discount: 20,
  //       customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
  //       customerName: 'John Wick',
  //       accountId: 1,
  //       items: [
  //         {
  //           referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
  //           title: 'Mouse Microsoft',
  //           price: 200.5
  //         },
  //         {
  //           referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
  //           title: 'Mouse Microsoft',
  //           price: 200.5
  //         }
  //       ]
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .expect((res) => {
  //       expect(res.body.success).toBe(false);
  //       expect(res.body.status).toBe(400);
  //       expect(res.body.message).toBe('Error body object');
  //       expect(res.body.errors.negotiationType._errors.at(0)).toBe(
  //         // eslint-disable-next-line quotes
  //         "Invalid enum value. Expected 'CREDIT' | 'DEBIT', received 'ANY'"
  //       );
  //     })
  //     .end((err) => {
  //       if (err) return done(err);
  //       return done();
  //     });
  // });

  test('should not found when request an existing account', (done) => {
    server
      .get('/api/accounts/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  // test('should list unique account created yesterday', (done) => {
  //   const yesterday = new Date();
  //   yesterday.setDate(yesterday.getDate() - 1);

  //   server
  //     .get('/api/accounts')
  //     .query({
  //       date: yesterday.toISOString().substring(0, 10)
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.total).toBe(1);
  //     })
  //     .end((err) => {
  //       if (err) return done(err);
  //       return done();
  //     });
  // });

  test('should error when list accounts with error params', (done) => {
    server
      .get('/api/accounts')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  // test('should return error when send unknown account id', (done) => {
  //   server
  //     .post('/api/accounts')
  //     .send({
  //       date: '2023-05-23T14:51:37.095Z',
  //       negotiationType: 'CREDIT',
  //       discount: 20,
  //       customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
  //       customerName: 'John Wick',
  //       accountId: 999,
  //       items: [
  //         {
  //           referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
  //           title: 'Mouse Microsoft',
  //           price: 200.5
  //         }
  //       ]
  //     })
  //     .expect('Content-Type', /json/)
  //     .expect(404)
  //     .end((err) => {
  //       if (err) return done(err);
  //       return done();
  //     });
  // });
});
