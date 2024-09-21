import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {orderService} from './order.service';
import {genCODE} from './order.model';
import {productService} from '../product/product/product.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {cart, ...body} = req.body;
  try {
    const [CODE, checkQuantity] = await Promise.all([
        genCODE(),
        Promise.all(
          cart.map(async (item: any) => {
            const product = await productService.getOne({ _id: item?.productId });
            return product && product?.quantity >= item.qty;
          }),
        ),
      ]);
    if (checkQuantity.includes(false)) {
      res.send({code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Sản phẩm đã hết hàng!'});
    } else {
      const data = await orderService.createOne({CODE, cart, ...body});
      if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
      res.send({code: httpStatus.OK, status: 'Success', message: 'Đặt hàng thành công', data: data});
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  const {userId, ...body} = req.body;
  try {
    const data = await orderService.updateOne(
      {_id: orderId},
      {
        ...(!!userId
          ? {
              $addToSet: {seen: userId},
            }
          : {}),
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

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  try {
    const data = await orderService.updateOne({_id: orderId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  const options = pick(req.query, ['hasCreatedBy', 'hasItems', 'hasShippingAddress', 'hasVouchers']);
  try {
    const data = await orderService.getOne({_id: orderId}, {...options});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['createdById', 'CODE', 'paymentMethod', 'targetId', 'status']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const options = pick(req.query, ['hasCreatedBy', 'hasItems', 'hasShippingAddress', 'hasVouchers']);

  try {
    const data = await orderService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['createdById', 'CODE', 'paymentMethod', 'targetId', 'status']);
  const options = pick(req.query, ['hasCreatedBy', 'hasItems', 'hasShippingAddress', 'hasVouchers']);
  try {
    const data = await orderService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const orderController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
