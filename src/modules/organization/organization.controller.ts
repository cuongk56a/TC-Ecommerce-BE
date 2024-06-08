import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {organizationService} from './organization.service';
import { userService } from '../user/user.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {hotline, email} = req.body;
  try {
    const organization = await organizationService.getOne({
      $or: [{hotline: hotline}, {email: email}],
    });
    if (!!organization) {
      res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Hotline hoặc Email đã tồn tại!'});
    } else {
      const data = await organizationService.createOne(req.body);
      await userService.updateOne({_id: req.body.createdById}, {$push: {organizationIds: data?._id}});
      res.send({code: httpStatus.OK, status: 'Success', message: 'Tạo cửa hàng thành công!'});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {organizationId} = req.params;
  const {hotline, email} = req.body;
  try {
    const organization = await organizationService.getOne({
        $or: [{hotline: hotline}, {email: email}],
      });
      if (!!organization) {
        res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Hotline hoặc Email đã tồn tại!'});
      } else {
        const data = await organizationService.updateOne({_id: organizationId}, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send({code: httpStatus.OK, status: 'Success', message: 'Cập nhật cửa hàng thành công!'});
      }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {organizationId} = req.params;
  try {
    const data = await organizationService.deleteOne({_id: organizationId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {organizationId} = req.params;
  try {
    const data = await organizationService.getOne({_id: organizationId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['name', 'hotline', 'search']);
  const options = pick(req.query, ['hasAddress']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  try {
    const data = await organizationService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['name', 'hotline']);
  const options = pick(req.query, ['hasAddress']);
  try {
    const data = await organizationService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const organizationController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
