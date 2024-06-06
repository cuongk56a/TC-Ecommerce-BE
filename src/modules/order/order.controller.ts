import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import {orderService} from './order.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await orderService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
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
                ...(!!userId ? 
                    {
                        $addToSet: {seen: userId}
                    }: {}),
                ...body
            }
        );
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
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
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {orderId} = req.params;
    const options = pick(req.query, ['hasCreatedBy','hasItems','hasShippingAddress', 'hasVouchers'])
    try {
        const data = await orderService.getOne(
            {_id: orderId},
            {...options}
        );
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'CODE','paymentMethod','targetId', 'status']);
    const queryOptions = pick(req.query, ['limit', 'page']);
    const options = pick(req.query, ['hasCreatedBy','hasItems','hasShippingAddress', 'hasVouchers']);
    try {
        const data = await orderService.getList(filter, {...queryOptions, ...options});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'CODE','paymentMethod','targetId', 'status']);
    const options = pick(req.query, ['hasCreatedBy','hasItems','hasShippingAddress', 'hasVouchers']);
    try {
        const data = await orderService.getAll(filter, options);
        res.send(data);
    } catch (error:any) {
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
