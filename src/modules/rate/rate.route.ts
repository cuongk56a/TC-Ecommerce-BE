import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {rateController} from './rate.controller';
import {rateValidation} from './rate.validation';

const router = express.Router()

router
    .route('/')
    .post(auth(),addCreatedByIdToBody,validate(rateValidation.createOne),rateController.createOne)
    .get(validate(rateValidation.getList),rateController.getList);

router.route('/all').get(auth(),validate(rateValidation.getAll),rateController.getAll);

router
    .route('/:rateId')
    .get(validate(rateValidation.getOne), rateController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(rateValidation.updateOne), rateController.updateOne)
    .delete(auth(), addDeletedByToBody, validate(rateValidation.deleteOne), rateController.deleteOne)

export const rateRoute = router;

/**
 * @swagger
 * tags:
 *   name: rate
 *   description: rate management and retrieval
 */

/**
 * @swagger
 * /rate:
 *   post:
 *     summary: Create a rate
 *     description: rate create a rate.
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - classId
 *             properties:
 *               CODE:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatar:
 *                 type: string
 *               birthday:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               rateId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               rateId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/rate'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list rates
 *     description: Only admins can retrieve all rates.
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of rates
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/rate'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /rate/all:
 *   get:
 *     summary: Get all rates
 *     description: Only admins can retrieve all rates.
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/rate'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /rate/{rateId}:
 *   get:
 *     summary: get rate
 *     description:
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rateId
 *         required: true
 *         schema:
 *           type: string
 *         description: get rate
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rate'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a rate
 *     description: update rate
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rateId
 *         required: true
 *         schema:
 *           type: string
 *         description: rateId id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatar:
 *                 type: string
 *               birthday:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               rateId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               rateName: fake rateName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               rateId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/rate'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a rate
 *     description: delete rate.
 *     tags: [rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rateId
 *         required: true
 *         schema:
 *           type: string
 *         description: rate id
 *     responses:
 *       "200":
 *         description: successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
