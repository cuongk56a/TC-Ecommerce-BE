import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import {validate} from '../../middlewares/validate';
import {authController} from './auth.controller';
import {authValidation} from './auth.validation';
import { checkPermission } from '../../middlewares/checkPermission';
import { PERMISSION_TYPE } from '../role/role.type';

const router = express.Router()

router.route('/register').post(validate(authValidation.register), authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/change-password/:userId').patch(auth(), addUpdatedByIdToBody, validate(authValidation.changePassword), authController.changePassword);
router.route('/forgot-password').post(validate(authValidation.forgotPassword), authController.forgotPassword);
router.route('/login-portal').post(validate(authValidation.loginPortal), authController.loginPortal);
router.route('/send-mail').post(validate(authValidation.sendMail), authController.sendMail);
router.route('/add-member').patch(auth(), checkPermission(PERMISSION_TYPE.USER_UPDATE), addUpdatedByIdToBody, validate(authValidation.addMember),authController.addMember);
router.route('/remove-member').patch(auth(), checkPermission(PERMISSION_TYPE.USER_UPDATE),addUpdatedByIdToBody,validate(authValidation.removeMember),authController.removeMember);

export const authRoute = router;
