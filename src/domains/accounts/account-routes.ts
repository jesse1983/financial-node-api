import express from 'express';
import { AccountController } from './controllers';
import { Connector } from '../../entities';

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Routes to manage your accounts.
 * components:
 *   schemas:
 *     AccountResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of accounts
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Account'
 *     Account:
 *       type: object
 *       required:
 *         - title
 *         - currentValue
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the entry.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: The creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: The last update date
 *           readOnly: true
 *         title:
 *           type: string
 *           description: The title of your entry.
 *         currentValue:
 *           type: number
 *           description: The currentValue of your entry.
 *       example:
 *         id: 1
 *         createdAt: '2023-05-22T02:17:34.768Z'
 *         updatedAt: '2023-05-22T02:17:34.768Z'
 *         title: Main account
 *         currentValue: 4300
 *     DailyReport:
 *       type: object
 *       properties:
 *         currentDailyValue:
 *           type: integer
 *           description: Total of day
 *           example: 96300.20
 *         entries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Entry'
 */

export default function (connector: Connector) {
  const routes = express.Router();

  routes
    /**
     * @swagger
     * /api/accounts:
     *   get:
     *     summary: Lists all the accounts
     *     tags: [Accounts]
     *     parameters:
     *       - name: offset
     *         description: Offset pagination
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *           default: 0
     *       - name: limit
     *         description: Limit pagination
     *         in: query
     *         required: false
     *         schema:
     *           type: integer
     *           default: 10
     *     responses:
     *       "200":
     *         description: The list of accounts.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/AccountResult'
     */
    .get('/', (req, res, next) =>
      new AccountController(connector).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /api/accounts:
     *   post:
     *     summary: Create a entry
     *     tags: [Accounts]
     *     requestBody:
     *       description: Create a entry
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Account'
     *           example:
     *             firstName: Callie
     *             lastName: Stewart
     *             email: vel2@protonmail.edu
     *     responses:
     *       "201":
     *         description: Create a entry.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Account'
     */
    .post('/', (req, res, next) =>
      new AccountController(connector).create({ req, res, next })
    )
    /**
     * @swagger
     * /api/accounts/{id}:
     *   get:
     *     summary: Show a single entry
     *     tags: [Accounts]
     *     parameters:
     *       - name: id
     *         description: Account id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       "200":
     *         description: Show a single entry.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Account'
     */
    .get('/:id', (req, res, next) =>
      new AccountController(connector).getOne({ req, res, next })
    )
    /**
     * @swagger
     * /api/accounts/{id}/daily-report/{day}:
     *   get:
     *     summary: Show a single entry
     *     tags: [Accounts]
     *     parameters:
     *       - name: id
     *         description: Account id
     *         in: path
     *         required: true
     *         schema:
     *           type: integer
     *       - name: day
     *         description: Account day
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *           example: 2023-12-01
     *     responses:
     *       "200":
     *         description: Show a single entry.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/DailyReport'
     */
    .get('/:id/daily-report/:day', (req, res, next) =>
      new AccountController(connector).dailyReport({ req, res, next })
    );

  return routes;
}
