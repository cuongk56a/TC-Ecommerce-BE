import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {userService} from '../user/user.service';
import nodemailer from 'nodemailer';
import {getRedisCode, setRedisCode} from '../../redis/redisCode';
import {appConfigs} from '../../config/config';
import {checkPassword, hashPassword} from '../../utils/hashUtil';
import {getNewToken} from '../../config/passport';
import {IUserDoc} from '../user/user.type';
import {genCODE, genCode} from '../../utils/core/genCode';
import {IRoleDoc} from '../role/role.type';
import {roleService} from '../role/role.service';
import {UserModel} from '../user/user.model';

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, password, confirmPassword, fullName, phone, code} = req.body;
  try {
    const confirmCode = await getRedisCode(email);
    const user: IUserDoc | null = await userService.getOne({
      $or: [{email: email}, {phone: phone}],
    });
    if (!!user) {
      res.send({code: httpStatus.BAD_REQUEST, status:'Error', message:'User Already Exists!'});
    } else if (password !== confirmPassword) {
      res.send({code: httpStatus.BAD_REQUEST, status:'Error', message:'Pass And confirmPassword Not Same!'});
    } else if (confirmCode !== code) {
      res.send({code: httpStatus.BAD_REQUEST, status:'Error', message:'Code And ConfirmCode Not Same!'});
    } else {
      const [hashedPassword, CODE] = await Promise.all([hashPassword(password), genCODE(UserModel)]);
      const data: IUserDoc | null = await userService.createOne({
        CODE,
        fullName,
        email,
        phone,
        hashedPassword,
      });
      if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
      const access_token = getNewToken({userId: data.id});
      res.send({access_token, data});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  try {
    const user: IUserDoc | null = await userService.getOne({email});
    if (!user) {
      res.send({code: httpStatus.NOT_FOUND, status: 'Error', message:'Not Found User!'});
    } else if (!checkPassword(password, user.hashedPassword)) {
      res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message:'Email Or Password Not Incorrect!'});
    } else {
      const access_token = getNewToken({userId: user.id});
      res.send({access_token, user});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {password, newPassword, cfNewPassword, userId, ...body} = req.body;
  try {
    if (newPassword !== cfNewPassword) {
      res.status(httpStatus.BAD_REQUEST).send('NewPassword And cfNewPassword Not Same!');
    }
    const [user, checkPassword, hashedPassword] = await Promise.all([
      userService.getOne({_id: userId}),
      hashPassword(password),
      hashPassword(newPassword),
    ]);
    if (!user) {
      res.status(httpStatus.NOT_FOUND).send('Not Found User!');
    } else {
      if (user.hashedPassword !== checkPassword) {
        res.status(httpStatus.BAD_REQUEST).send('Password Not Incorrect!');
      } else {
        await userService.updateOne(
          {
            _id: userId,
          },
          {
            hashedPassword,
            ...body,
          },
          {
            new: true,
          },
        );
        const access_token = getNewToken({userId: userId});
        res.send(access_token);
      }
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email, code} = req.body;
  try {
    const [confirmCode, newPassword] = await Promise.all([getRedisCode(email), genCode(4)]);
    if (confirmCode !== code) {
      res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Mã xác thực không đúng!'});
    } else {
      const hashedPassword = await hashPassword('newPassword');
      await userService.updateOne(
        {
          email,
        },
        {
          hashedPassword,
        },
        {
          new: true,
        },
      );
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: appConfigs.google.email,
          pass: appConfigs.google.pass,
        },
      });
      const received = {
        from: appConfigs.google.email,
        to: email,
        subject: 'Cấp Mật Khẩu Mới',
        html: `<p>- Mật khẩu mới đã được khởi tạo.</p><p>- Mật khẩu của bạn: <span style="font-weight: bold">${newPassword}</span></p><p>- Vui lòng đổi lại mật khẩu mới để bảo mật tài khoản!</p>`,
      };
      await transporter.sendMail(received, (error: any, info: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Send Email Success! ' + info.response);
        }
      });
      res.send({code: httpStatus.OK, status: 'Success!', message: 'Mật khẩu mới đã được gửi tới email của bạn!'});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const loginPortal = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId, targetId} = req.body;
  try {
    const role: IRoleDoc | null = await roleService.getOne({targetId, userIds: userId});
    if (!role) {
      const access_token = getNewToken({userId: userId});
      res.send(access_token);
    } else {
      const access_token = getNewToken({userId: userId, roleId: role.id});
      res.send(access_token);
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const sendMail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {email} = req.body;
  try {
    const confirmCode = await getRedisCode(email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: appConfigs.google.email,
        pass: appConfigs.google.pass,
      },
    });
    const received = {
      from: appConfigs.google.email,
      to: email,
      subject: 'Mã Xác Thực',
      html: `<p>- Chào mừng bạn đã đến với hệ thống.</p><p>- Mã xác nhận của bạn: <span style="font-weight: bold">${confirmCode}</span></p><p>- Mã xác thực chỉ tồn tại trong vòng ${appConfigs.jwt.verifyEmailExpirationMinutes} phút!</p>`,
    };
    await transporter.sendMail(received, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Send Email Success! ' + info.response);
      }
    });
    res.send('Send Email Success!');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const addMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId, targetId, ...body} = req.body;
  try {
    const data = await userService.updateOne(
      {
        _id: userId,
      },
      {
        $addToSet: {organizationIds: targetId},
        ...body,
      },
    );
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const removeMember = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId, targetId, ...body} = req.body;
  try {
    const [data] = await Promise.all([
      userService.updateOne(
        {
          _id: userId,
        },
        {
          $pull: {organizationIds: targetId},
          ...body,
        },
      ),
      roleService.updateOne(
        {
          targetId: targetId,
          userIds: {
            $in: [userId],
          },
        },
        {
          $pull: {userIds: userId},
          ...body,
        },
      ),
    ]);
    if (!data) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'NOT FOUND!');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const authController = {
  register,
  login,
  changePassword,
  forgotPassword,
  loginPortal,
  sendMail,
  addMember,
  removeMember,
};
