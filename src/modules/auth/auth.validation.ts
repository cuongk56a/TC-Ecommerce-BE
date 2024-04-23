import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    code: Joi.string().required(),
  }),
};

const login = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}

const changePassword = {
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
  cfNewPassword: Joi.string().required(),
  userId: Joi.string().custom(customValidations.objectId).required(),
}

const forgetPassword = {
  email: Joi.string().email().required(),
  code: Joi.string().required(),
}

const loginPortal = {
  userId: Joi.string().custom(customValidations.objectId).required(),
  targetId: Joi.string().custom(customValidations.objectId).required(),
}

const sendMail = {
  email: Joi.string().email().required(),
}

export const authValidation = {
  register,
  login,
  changePassword,
  forgetPassword,
  loginPortal,
  sendMail,
};
