import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {categoryController} from './category.controller';
import {categoryValidation} from './category.validation';
import { authIfHas } from '../../middlewares/authIfHas';

const router = express.Router();

router
  .route('/')
  .post(auth(), addCreatedByIdToBody, validate(categoryValidation.createOne), categoryController.createOne)
  .get(authIfHas(),validate(categoryValidation.getList), categoryController.getList);

router.route('/all').get(authIfHas(),validate(categoryValidation.getAll), categoryController.getAll);

router
  .route('/:categoryId')
  .get(authIfHas(),validate(categoryValidation.getOne), categoryController.getOne)
  .patch(auth(), addUpdatedByIdToBody, validate(categoryValidation.updateOne), categoryController.updateOne)
  .delete(auth(), addDeletedByToBody, validate(categoryValidation.deleteOne), categoryController.deleteOne);

export const categoryRoute = router;

/**
 * @swagger
 * tags:
 *   name: Ecommerce/Category
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a Category
 *     description: User create a category.
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *               - targetOnModel
 *               - name
 *               - description
 *               - thumbnail
 *               - parentId
 *             properties:
 *               targetId:
 *                 type: string
 *               targetOnModel:
 *                 type: number
 *                 enum: [vttool_user, vttool_organization]
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               parentId:
 *                 type: string
 *             example:
 *               targetId: abcd123abcd123abcd123
 *               name: Bài viết đơn giản
 *               description: 1 bài viết đơn giản chỉ làm em vui, 1 bài viết đơn giản k có đặc biệt gì
 *               thumbnail: .pmg
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list Categorys
 *     description: Only admins can retrieve all users.
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetId
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetOnModel
 *         schema:
 *           type: string
 *           enum: [vttool_user, vttool_organization]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Maximum number of users
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
 *                     $ref: '#/components/schemas/Category'
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
 * /category/all:
 *   get:
 *     summary: Get all Categorys
 *     description: Only admins can retrieve all users.
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: parentId
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetId
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetOnModel
 *         schema:
 *           type: string
 *           enum: [vttool_user, vttool_organization]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /category/{categoryId}:
 *   get:
 *     summary: Get category by id
 *     description:
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: category
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a category
 *     description: update category
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: string
 *               name:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               name: Bài viết đơn giản
 *               description: 1 bài viết đơn giản chỉ làm em vui, 1 bài viết đơn giản k có đặc biệt gì
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Category'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a category
 *     description: delete category.
 *     tags: [Ecommerce/Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: category id
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
