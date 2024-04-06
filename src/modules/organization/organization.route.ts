import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {organizationController} from './organization.controller';
import {organizationValidation} from './organization.validation';

const router = express.Router()

router
    .route('/')
    .post(auth(),addCreatedByIdToBody,validate(organizationValidation.createOne),organizationController.createOne)
    .get(validate(organizationValidation.getList),organizationController.getList);

router.route('/all').get(auth(),validate(organizationValidation.getAll),organizationController.getAll);

router
    .route('/:organizationId')
    .get(validate(organizationValidation.getOne), organizationController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(organizationValidation.updateOne), organizationController.updateOne)
    .delete(auth(), addDeletedByToBody, validate(organizationValidation.deleteOne), organizationController.deleteOne)

export const organizationRoute = router;

/**
 * @swagger
 * tags:
 *   name: organization
 *   description: organization management and retrieval
 */

/**
 * @swagger
 * /organization:
 *   post:
 *     summary: Create a organization
 *     description: organization create a organization.
 *     tags: [organization]
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
 *               organizationId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               organizationId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/organization'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list organizations
 *     description: Only admins can retrieve all organizations.
 *     tags: [organization]
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
 *         description: Maximum number of organizations
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
 *                     $ref: '#/components/schemas/organization'
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
 * /organization/all:
 *   get:
 *     summary: Get all organizations
 *     description: Only admins can retrieve all organizations.
 *     tags: [organization]
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
 *               $ref: '#/components/schemas/organization'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /organization/{organizationId}:
 *   get:
 *     summary: get organization
 *     description:
 *     tags: [organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: get organization
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/organization'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a organization
 *     description: update organization
 *     tags: [organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: organizationId id
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
 *               organizationId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               organizationName: fake organizationName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               organizationId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/organization'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a organization
 *     description: delete organization.
 *     tags: [organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *         description: organization id
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
