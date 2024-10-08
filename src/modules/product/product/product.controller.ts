import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import { catchAsync } from '../../../utils/core/catchAsync';
import { pick } from '../../../utils/core/pick';
import { productService } from './product.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await productService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
        const data = await productService.updateOne({ _id: productId }, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    try {
        const data = await productService.deleteOne({ _id: productId });
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const options = pick(req.query, ['hasUnit', 'hasCategory', 'hasBrand']);
    try {
        const data = await productService.getOne(
            { _id: productId },
            { ...options },
        );
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById','targetId' ,'search', 'categoryId', 'brandId','isActive']);
    const queryOptions = pick(req.query, ['limit', 'page']);
    const options = pick(req.query, ['hasUnit','hasCategory','hasBrand']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await productService.getList(filter, { ...queryOptions, options }, sortOptions);
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById','targetId' ,'search', 'categoryId', 'brandId','isActive']);
    const options = pick(req.query, ['hasUnit','hasCategory','hasBrand']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await productService.getAll(filter, options, sortOptions);
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const productController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
