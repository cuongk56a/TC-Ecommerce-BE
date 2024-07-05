import express from 'express';
import { auth } from '../../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../../middlewares/addUserToBody'
import {validate} from '../../../middlewares/validate';
import {roomChatController} from './roomChat.controller';
import {roomChatValidation} from './roomChat.validation';

const router = express.Router()

router
    .route('/')
    .post(auth(),addCreatedByIdToBody,validate(roomChatValidation.createOne),roomChatController.createOne)
    .get(validate(roomChatValidation.getList),roomChatController.getList);

router
    .route('/create-or-update')
    .post(auth(),addCreatedByIdToBody,validate(roomChatValidation.createOrUpdate),roomChatController.createOrUpdate);

router.route('/all').get(auth(),validate(roomChatValidation.getAll),roomChatController.getAll);

router
    .route('/:roomChatId')
    .get(validate(roomChatValidation.getOne), roomChatController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(roomChatValidation.updateOne), roomChatController.updateOne)
    .delete(auth(), addDeletedByToBody, validate(roomChatValidation.deleteOne), roomChatController.deleteOne)

export const roomChatRoute = router;

/**
 * @swagger
 * tags:
 *   name: roomChat
 *   description: roomChat management and retrieval
 */

/**
 * @swagger
 * /roomChat:
 *   post:
 *     summary: Create a roomChat
 *     description: roomChat create a roomChat.
 *     tags: [roomChat]
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
 *               roomChatId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               roomChatId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/roomChat'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list roomChats
 *     description: Only admins can retrieve all roomChats.
 *     tags: [roomChat]
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
 *         description: Maximum number of roomChats
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
 *                     $ref: '#/components/schemas/roomChat'
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
 * /roomChat/all:
 *   get:
 *     summary: Get all roomChats
 *     description: Only admins can retrieve all roomChats.
 *     tags: [roomChat]
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
 *               $ref: '#/components/schemas/roomChat'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /roomChat/{roomChatId}:
 *   get:
 *     summary: get roomChat
 *     description:
 *     tags: [roomChat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomChatId
 *         required: true
 *         schema:
 *           type: string
 *         description: get roomChat
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/roomChat'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a roomChat
 *     description: update roomChat
 *     tags: [roomChat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomChatId
 *         required: true
 *         schema:
 *           type: string
 *         description: roomChatId id
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
 *               roomChatId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               roomChatName: fake roomChatName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               roomChatId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/roomChat'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a roomChat
 *     description: delete roomChat.
 *     tags: [roomChat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomChatId
 *         required: true
 *         schema:
 *           type: string
 *         description: roomChat id
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
