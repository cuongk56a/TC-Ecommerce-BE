import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {cartService} from './cart.service';
import {productService} from '../product/product/product.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await cartService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send({code: httpStatus.OK, status: 'Success', message: 'Tạo cart thành công!', data: data});
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {cartId} = req.params;
  try {
    const data = await cartService.updateOne({_id: cartId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send({code: httpStatus.OK, status: 'Success', message: 'Cập nhật cart thành công!', data: data});
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {cartId} = req.params;
  try {
    const data = await cartService.updateOne({_id: cartId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {cartId} = req.params;
  const options = pick(req.query, ['hasProduct']);
  try {
    const data = await cartService.getOne({_id: cartId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'createdById']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const options = pick(req.query, ['hasTarget', 'hasProduct']);
  try {
    const data = await cartService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'createdById']);
  const options = pick(req.query, ['hasTarget', 'hasProduct']);
  try {
    const data = await cartService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const createOrUpdate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {productId, qty} = req.body;
  try {
    const product = await productService.getOne({_id: productId});
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    const data = await cartService.updateOne(
      {
        'items.productId': productId,
        targetId: product.targetId,
      },
      {
        $inc: {'items.$.qty': qty},
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const cartController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  createOrUpdate,
};
