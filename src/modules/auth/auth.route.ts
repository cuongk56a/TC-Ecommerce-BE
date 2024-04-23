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

const router = express.Router()

router.route('/register').post(validate(authValidation.register), authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/change-password').patch(auth(), addUpdatedByIdToBody, validate(authValidation.changePassword), authController.changePassword);
router.route('/forget-password').post(validate(authValidation.forgetPassword), authController.forgetPassword);
router.route('/login-portal').post(validate(authValidation.loginPortal), authController.loginPortal);
router.route('/send-mail').post(validate(authValidation.sendMail), authController.sendMail);

export const authRoute = router;
