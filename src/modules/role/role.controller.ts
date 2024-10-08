import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {roleService} from './role.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await roleService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roleId} = req.params;
  try {
    const data = await roleService.updateOne({_id: roleId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roleId} = req.params;
  try {
    const data = await roleService.deleteOne({_id: roleId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roleId} = req.params;
  try {
    const data = await roleService.getOne({_id: roleId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'search', 'isActive']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  try {
    const data = await roleService.getList(filter, {...queryOptions});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'search', 'isActive']);
  try {
    const data = await roleService.getAll(filter);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const addUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roleId} = req.params;
  const {userId, targetId} = req.body;
  try {
    await roleService.updateOne(
      {
        targetId: targetId,
        userIds: {
          $in: [userId],
        },
      },
      {
        $pull: {userIds: userId},
      },
    );
    const role = await roleService.updateOne(
      {
        _id: roleId,
      },
      {
        $addToSet: {userIds: userId},
      },
    );
    if (!role) {
      res.status(httpStatus.BAD_REQUEST).send({status: 'Error', message: 'Role Not Found Or Add User Not Success!'});
    } else {
      res.send({status: 'Success', message: 'Add User Success!'});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const removeUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {roleId} = req.params;
    const {userId} = req.body;
    try {
      const role = await roleService.updateOne(
        {
          _id: roleId,
        },
        {
          $pull: {userIds: userId},
        },
      );
      if (!role) {
        res.status(httpStatus.BAD_REQUEST).send({status: 'Error', message: 'Role Not Found Or Remove User Not Success!'});
      } else {
        res.send({status: 'Success', message: 'Remove User Success!'});
      }
    } catch (error: any) {
      return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const roleController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  addUser,
  removeUser,
};
