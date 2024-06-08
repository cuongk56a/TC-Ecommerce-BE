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
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
}

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
    cfNewPassword: Joi.string().required(),
  }),
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
  })
}

const loginPortal = {
  body: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
    targetId: Joi.string().custom(customValidations.objectId).required(),
  })
}

const sendMail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  })
}

const addMember = {
  body: {
    userId: Joi.string().custom(customValidations.objectId).required(),
    targetId: Joi.string().custom(customValidations.objectId).required(),
  }
}

const removeMember = {
  body: {
    userId: Joi.string().custom(customValidations.objectId).required(),
    targetId: Joi.string().custom(customValidations.objectId).required(),
  }
}

export const authValidation = {
  register,
  login,
  changePassword,
  forgotPassword,
  loginPortal,
  sendMail,
  addMember,
  removeMember,
};
