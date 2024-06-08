import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {userService} from './user.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.params;
  const {email, phone} = req.body;
  try {
    const user = await userService.getOne({
      $or: [{phone: phone}, {email: email}],
    });
    if (!!user) {
      res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message: 'User Already Exists!'});
    } else {
      const data = await userService.updateOne({_id: userId}, req.body);
      if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
      res.send(data);
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.params;
  try {
    const data = await userService.deleteOne({_id: userId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.params;
  const options = pick(req.query, ['hasAddress', 'hasRole','hasOrganization']);
  try {
    const data = await userService.getOne({_id: userId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['search', 'phone', 'email']);
  const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
  const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
  try {
    const data = await userService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['organizationIds', 'search', 'phone', 'email']);
  const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
  try {
    const data = await userService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const userController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
