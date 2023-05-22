import express from 'express';
import { EntryController } from './controllers';
import { Connector } from '../../entities';

/**
 * @swagger
 * tags:
 *   name: Entries
 *   description: Routes to manage your entries.
 * components:
 *   schemas:
 *     EntryResult:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total of entries
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Entry'
 *     Entry:
 *       type: object
 *       required:
 *         - negotiationType
 *         - date
 *         - items
 *         - customerKey
 *         - customerName
 *         - accountId
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
 *         date:
 *           type: string
 *           description: The date of your entry.
 *         negotiationType:
 *           type: string
 *           description: The negotiationType of your entry.
 *           enum:
 *             - DEBIT
 *             - CREDIT
 *         totalPrice:
 *           type: number
 *           description: The totalPrice of your entry.
 *           readOnly: true
 *         discount:
 *           type: number
 *           description: The discount of your entry.
 *         customerKey:
 *           type: string
 *           description: The customerKey of your entry.
 *         customerName:
 *           type: string
 *           description: The customerName of your entry.
 *         accountId:
 *           type: number
 *           description: The accountId of your entry.
 *         previousAccountValue:
 *           type: number
 *           description: The previousAccountValue of your entry.
 *           readOnly: true
 *         items:
 *           type: array
 *           description: The items of your entry.
 *           items:
 *           - $ref: '#/components/schemas/Item'
 *       example:
 *         id: 1
 *         createdAt: '2023-05-22T02:17:34.861Z'
 *         updatedAt: '2023-05-22T02:17:34.861Z'
 *         date: '2023-05-22T02:17:34.675Z'
 *         negotiationType: CREDIT
 *         totalPrice: 14300
 *         discount: 0
 *         customerKey: 23c8e0cc-aaf1-4f32-b412-d0aa69425659
 *         customerName: John Wick
 *         accountId: 1
 *         previousAccountValue: 10000
 *         items:
 *         - id: 1
 *           createdAt: '2023-05-22T02:17:34.861Z'
 *           updatedAt: '2023-05-22T02:17:34.861Z'
 *           referenceKey: 0c637428-b8bc-4112-b4a0-f688e66f581c
 *           entryId: 1
 *           title: Notebook Dell Alienware
 *           price: 8900
 *           discount: 200
 *           comments: Discount by product showcase
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the item.
 *           readOnly: true
 *         createdAt:
 *           type: string
 *           description: The creation date
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           description: The last update date
 *           readOnly: true
 *         referenceKey:
 *           type: string
 *           description: The referenceKey of item
 *         title:
 *           type: string
 *           description: The title of item
 *         price:
 *           type: number
 *           description: The price of item
 *         discount:
 *           type: number
 *           description: The discount of item
 *         comments:
 *           type: string
 *           description: The comments of item
 */

export default function (connector: Connector) {
  const routes = express.Router();

  routes
    /**
     * @swagger
     * /api/entries:
     *   get:
     *     summary: Lists all the entries
     *     tags: [Entries]
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
     *           default: 20
     *       - name: date
     *         description: Entry date
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *           example: 2023-12-01
     *       - name: accountId
     *         description: Entry accountId
     *         in: query
     *         required: false
     *         schema:
     *           type: number
     *           example: 1
     *     responses:
     *       "200":
     *         description: The list of entries.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/EntryResult'
     */
    .get('/', (req, res, next) =>
      new EntryController(connector).getAll({ req, res, next })
    )
    /**
     * @swagger
     * /api/entries:
     *   post:
     *     summary: Create a entry
     *     tags: [Entries]
     *     requestBody:
     *       description: Create a entry
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Entry'
     *           example:
     *             date: '2023-05-23T14:51:37.095Z'
     *             negotiationType: CREDIT
     *             discount: 20
     *             customerKey: 23c8e0cc-aaf1-4f32-b412-d0aa69425659
     *             customerName: John Wick
     *             accountId: 1
     *             items:
     *             - referenceKey: 12c8e0cc-aaf1-4f32-b412-d0aa69425699
     *               title: Mouse Microsoft
     *               price: 203.33
     *     responses:
     *       "201":
     *         description: Create a entry.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/Entry'
     */
    .post('/', (req, res, next) =>
      new EntryController(connector).create({ req, res, next })
    )
    /**
     * @swagger
     * /api/entries/{id}:
     *   get:
     *     summary: Show a single entry
     *     tags: [Entries]
     *     parameters:
     *       - name: id
     *         description: Entry id
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
     *                 - $ref: '#/components/schemas/Entry'
     */
    .get('/:id', (req, res, next) =>
      new EntryController(connector).getOne({ req, res, next })
    );
  return routes;
}
