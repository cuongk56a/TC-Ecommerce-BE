import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { imageService } from './image.service';

const createOrUpdateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await imageService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const createOrUpdateMulti = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await imageService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['fileName']);
    const queryOptions = pick(req.query, ['limit', 'page']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await imageService.getList(filter, { ...queryOptions }, { ...sortOptions });
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['fileName']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await imageService.getAll(filter, undefined, { ...sortOptions });
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const imageController = {
    createOrUpdateOne,
    getAll,
    getList,
    createOrUpdateMulti,
};

