import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {voucherService} from './voucher.service';
import {IVoucherModelDoc} from './voucher.model';
import {orderService} from '../order/order.service';
import {APPLY_FOR_TYPE, APPLY_FOR_USER_TYPE} from './voucher.type';
import moment from 'moment-timezone';
import {appConfigs} from '../../config/config';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await voucherService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send({code: httpStatus.OK, status: 'Success', message: 'Tạo voucher thành công!', data: data});
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {voucherId} = req.params;
  const {endAt, ...body} = req.body;
  try {
    let data: IVoucherModelDoc | null;
    if (!!endAt && endAt == '') {
      data = await voucherService.updateOne(
        {_id: voucherId},
        {
          $unset: {endTime: ''},
          ...body,
        },
      );
    } else {
      data = await voucherService.updateOne({_id: voucherId}, req.body);
    }
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send({code: httpStatus.OK, status: 'Success', message: 'Cập nhật voucher thành công!', data: data});
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {voucherId} = req.params;
  try {
    const data = await voucherService.updateOne({_id: voucherId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {voucherId} = req.params;
  const options = pick(req.query, ['hasProduct']);
  try {
    const data = await voucherService.getOne({_id: voucherId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {check, userId, ...filter} = pick(req.query, ['targetId', 'search', 'check', 'isActive', 'voucherType', 'userId']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const options = pick(req.query, ['hasTarget', 'hasProducts', 'hasCategories']);
  try {
    let filterCheck = {};
    const currentTime = moment().tz(appConfigs.timeZone).unix();
    if (check) {
      filterCheck = {
        ...filterCheck,
        $and: [
          {
            isActive: true,
          },
          {
            ...(!!userId
              ? {
                  $or: [
                    {
                      applyUser: {$ne: userId},
                      applyForUser: APPLY_FOR_USER_TYPE.SOME,
                    },
                    {
                      applyForUser: APPLY_FOR_USER_TYPE.ALL,
                    },
                    {
                      applyForUser: APPLY_FOR_USER_TYPE.NEW,
                    },
                  ],
                }
              : {}),
          },
          {
            $or: [
              {
                startTime: {$gte: currentTime},
                endTime: {$lte: currentTime},
              },
              {
                startTime: {$gte: currentTime},
                endTime: {$exists: false},
              },
            ],
          },
        ],
      };
    }
    const data = await voucherService.getList({...filter, ...filterCheck}, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {check,userId, ...filter} = pick(req.query, ['targetId', 'search', 'check', 'isActive', 'voucherType', 'userId']);
  const options = pick(req.query, ['hasTarget', 'hasProducts', 'hasCategories']);
  try {
    let filterCheck = {};
    const currentTime = moment().tz(appConfigs.timeZone).unix();
    if (check) {
      filterCheck = {
        ...filterCheck,
        $and: [
          {
            isActive: true,
          },
          {
            ...(!!userId
              ? {
                  $or: [
                    {
                      applyUser: {$ne: userId},
                      applyForUser: APPLY_FOR_USER_TYPE.SOME,
                    },
                    {
                      applyForUser: APPLY_FOR_USER_TYPE.ALL,
                    },
                    {
                      applyForUser: APPLY_FOR_USER_TYPE.NEW,
                    },
                  ],
                }
              : {}),
          },
          {
            $or: [
              {
                startTime: {$gte: currentTime},
                endTime: {$lte: currentTime},
              },
              {
                startTime: {$gte: currentTime},
                endTime: {$exists: false},
              },
            ],
          },
        ],
      };
    }
    const data = await voucherService.getAll({...filter, ...filterCheck}, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const canUse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {voucherType, targetId, userId, productIds, categoryIds} = pick(req.query, [
    'voucherType',
    'targetId',
    'userId',
    'productIds',
    'categoryIds',
  ]);
  try {
    const productArray = productIds.split(',') || [];
    const categoryArray = categoryIds.split(',') || [];
    const currentTime = moment().tz(appConfigs.timeZone).unix();
    const [vouchers, order] = await Promise.all([
      voucherService.getAll({
        voucherType,
        targetId,
        isActive: true,
        $or: [
          {
            startTime: {$gte: currentTime},
            endTime: {$lte: currentTime},
          },
          {
            startTime: {$gte: currentTime},
            endTime: {$exists: false},
          },
        ],
      }),
      orderService.getOne({createdById: userId}),
    ]);
    const voucherSuccess = await Promise.all(
      vouchers.map(async (voucher: any) => {
        const userTurn = voucher.usage.filter((item: any) => item.userId == userId).length;
        if (voucher.userMaxTurn == userTurn || voucher.totalTurn == voucher.usageCount) {
          return null;
        }
        if (
          (voucher.applyForUser == APPLY_FOR_USER_TYPE.NEW && !order) ||
          voucher.applyForUser == APPLY_FOR_USER_TYPE.ALL ||
          (voucher.applyForUser == APPLY_FOR_USER_TYPE.SOME && voucher.applyUser.includes(userId))
        ) {
          if (voucher.applyFor == APPLY_FOR_TYPE.ALL) {
            return voucher;
          }
          if (voucher.applyFor == APPLY_FOR_TYPE.CATEGORY  && categoryArray.some((category:any) => voucher.applyCategory.includes(category))) {
            return voucher;
          }
          if (voucher.applyFor == APPLY_FOR_TYPE.PRODUCT && productArray.some((product:any) => voucher.applyCategory.includes(product))) {
            return voucher;
          }
          return null;
        }
      }),
    );
    const voucherFilter = voucherSuccess.filter((item: any) => item != null);
    res.send(voucherFilter);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const voucherController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  canUse,
};
