import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';

let server: request.SuperTest<request.Test>;

describe('testing entry', () => {
  beforeAll(async () => {
    server = request(app(new PrismaClient()));
  });

  test('should list entries', (done) => {
    server
      .get('/api/entries')
      .query({
        accountId: 1
      })
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

  test('should show single entry', (done) => {
    server
      .get('/api/entries/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.totalPrice).toBe(14300);
        expect(res.body.discount).toBe(0);
        expect(res.body.customerKey).toBe(
          '23c8e0cc-aaf1-4f32-b412-d0aa69425659'
        );
        expect(res.body.customerName).toBe('John Wick');
        expect(res.body.accountId).toBe(1);
        expect(res.body.previousAccountValue).toBe(10000);
        expect(res.body.items).toHaveLength(3);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create entry credit', (done) => {
    server
      .post('/api/entries')
      .send({
        date: '2023-05-23T14:51:37.095Z',
        negotiationType: 'CREDIT',
        discount: 20,
        customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
        customerName: 'John Wick',
        accountId: 1,
        items: [
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Mouse Microsoft',
            price: 200.5
          },
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Mouse Microsoft',
            price: 200.5
          }
        ]
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBe(3);
        expect(res.body.totalPrice).toBe(381);
        expect(res.body.discount).toBe(20);
        expect(res.body.customerKey).toBe(
          '23c8e0cc-aaf1-4f32-b412-d0aa69425659'
        );
        expect(res.body.customerName).toBe('John Wick');
        expect(res.body.accountId).toBe(1);
        expect(res.body.previousAccountValue).toBe(4300);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should create entry debit', (done) => {
    server
      .post('/api/entries')
      .send({
        date: '2023-05-23T14:51:37.095Z',
        negotiationType: 'DEBIT',
        customerKey: '56c8e0cc-aaf1-4f32-b412-d0aa69425600',
        customerName: 'Company Zero',
        accountId: 1,
        items: [
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Clean up',
            price: 1000
          }
        ]
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeGreaterThan(1);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should return validation error', (done) => {
    server
      .post('/api/entries')
      .send({
        date: '2023-05-23T14:51:37.095Z',
        negotiationType: 'ANY',
        discount: 20,
        customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
        customerName: 'John Wick',
        accountId: 1,
        items: [
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Mouse Microsoft',
            price: 200.5
          },
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Mouse Microsoft',
            price: 200.5
          }
        ]
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.status).toBe(400);
        expect(res.body.message).toBe('Error body object');
        expect(res.body.errors.negotiationType._errors.at(0)).toBe(
          // eslint-disable-next-line quotes
          "Invalid enum value. Expected 'CREDIT' | 'DEBIT', received 'ANY'"
        );
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should not found when request an existing entry', (done) => {
    server
      .get('/api/entries/999')
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should list unique entry created yesterday', (done) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    server
      .get('/api/entries')
      .query({
        date: yesterday.toISOString().substring(0, 10)
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body.total).toBe(1);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should error when list entries with error params', (done) => {
    server
      .get('/api/entries')
      .query({ offset: 'x', limit: 'x' })
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  test('should return error when send unknown account id', (done) => {
    server
      .post('/api/entries')
      .send({
        date: '2023-05-23T14:51:37.095Z',
        negotiationType: 'CREDIT',
        discount: 20,
        customerKey: '23c8e0cc-aaf1-4f32-b412-d0aa69425659',
        customerName: 'John Wick',
        accountId: 999,
        items: [
          {
            referenceKey: '12c8e0cc-aaf1-4f32-b412-d0aa69425699',
            title: 'Mouse Microsoft',
            price: 200.5
          }
        ]
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
