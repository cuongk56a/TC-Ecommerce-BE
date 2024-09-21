import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {activityLogController} from './activityLog.controller';
import {activityLogValidation} from './activityLog.validation';

const router = express.Router()

router
    .route('/')
    .get(validate(activityLogValidation.getList),activityLogController.getList);

router.route('/all').get(auth(),validate(activityLogValidation.getAll),activityLogController.getAll);

router
    .route('/:activityLogId')
    .get(validate(activityLogValidation.getOne), activityLogController.getOne);

export const activityLogRoute = router;

/**
 * @swagger
 * tags:
 *   name: activityLog
 *   description: activityLog management and retrieval
 */

/**
 * @swagger
 * /activityLog:
 *   post:
 *     summary: Create a activityLog
 *     description: activityLog create a activityLog.
 *     tags: [activityLog]
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
 *               activityLogId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               activityLogId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/activityLog'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list activityLogs
 *     description: Only admins can retrieve all activityLogs.
 *     tags: [activityLog]
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
 *         description: Maximum number of activityLogs
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
 *                     $ref: '#/components/schemas/activityLog'
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
 * /activityLog/all:
 *   get:
 *     summary: Get all activityLogs
 *     description: Only admins can retrieve all activityLogs.
 *     tags: [activityLog]
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
 *               $ref: '#/components/schemas/activityLog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /activityLog/{activityLogId}:
 *   get:
 *     summary: get activityLog
 *     description:
 *     tags: [activityLog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityLogId
 *         required: true
 *         schema:
 *           type: string
 *         description: get activityLog
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/activityLog'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a activityLog
 *     description: update activityLog
 *     tags: [activityLog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityLogId
 *         required: true
 *         schema:
 *           type: string
 *         description: activityLogId id
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
 *               activityLogId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               activityLogName: fake activityLogName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               activityLogId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/activityLog'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a activityLog
 *     description: delete activityLog.
 *     tags: [activityLog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityLogId
 *         required: true
 *         schema:
 *           type: string
 *         description: activityLog id
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
