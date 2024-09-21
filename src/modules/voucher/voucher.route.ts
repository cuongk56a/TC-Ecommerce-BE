import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {voucherController} from './voucher.controller';
import {voucherValidation} from './voucher.validation';

const router = express.Router()

router
    .route('/')
    .post(auth(),addCreatedByIdToBody,validate(voucherValidation.createOne),voucherController.createOne)
    .get(auth(),validate(voucherValidation.getList),voucherController.getList);

router.route('/all').get(auth(),validate(voucherValidation.getAll),voucherController.getAll);
router.route('/can-use').get(validate(voucherValidation.canUse),voucherController.canUse);

router
    .route('/:voucherId')
    .get(auth(),validate(voucherValidation.getOne), voucherController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(voucherValidation.updateOne), voucherController.updateOne)
    .delete(auth(), addDeletedByToBody, validate(voucherValidation.deleteOne), voucherController.deleteOne)

export const voucherRoute = router;

/**
 * @swagger
 * tags:
 *   name: voucher
 *   description: voucher management and retrieval
 */

/**
 * @swagger
 * /voucher:
 *   post:
 *     summary: Create a voucher
 *     description: voucher create a voucher.
 *     tags: [voucher]
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
 *               voucherId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               voucherId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/voucher'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list vouchers
 *     description: Only admins can retrieve all vouchers.
 *     tags: [voucher]
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
 *         description: Maximum number of vouchers
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
 *                     $ref: '#/components/schemas/voucher'
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
 * /voucher/all:
 *   get:
 *     summary: Get all vouchers
 *     description: Only admins can retrieve all vouchers.
 *     tags: [voucher]
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
 *               $ref: '#/components/schemas/voucher'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /voucher/{voucherId}:
 *   get:
 *     summary: get voucher
 *     description:
 *     tags: [voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: get voucher
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/voucher'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a voucher
 *     description: update voucher
 *     tags: [voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: voucherId id
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
 *               voucherId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               voucherName: fake voucherName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               voucherId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/voucher'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a voucher
 *     description: delete voucher.
 *     tags: [voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: voucherId
 *         required: true
 *         schema:
 *           type: string
 *         description: voucher id
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
