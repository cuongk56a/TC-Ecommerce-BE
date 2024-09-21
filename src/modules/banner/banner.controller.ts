import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { bannerService } from './banner.service';
import { brandService } from '../brand/brand.service';
import { BANNER_ACTION_TYPE } from './banner.type';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await bannerService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bannerId } = req.params;
    const { entityId, ...body } = req.body;
    try {
        const data = await brandService.updateOne(
            {
                _id: bannerId
            },
            {
                ...body,
                ...(
                    entityId == ''  ? { entityId, entityType: BANNER_ACTION_TYPE.NAV_DEFAULT} : {entityId}
                )
            }
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
    const { bannerId } = req.params;
    try {
        const data = await bannerService.deleteOne({ _id: bannerId });
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { bannerId } = req.params;
    try {
        const data = await bannerService.getOne(
            { _id: bannerId },
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
    const filter = pick(req.query, ['isActive', 'targetId', 'targetOnModel']);
    const queryOptions = pick(req.query, ['limit', 'page']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await bannerService.getList(filter, { ...queryOptions }, { ...sortOptions });
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['isActive', 'targetId', 'targetOnModel']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await bannerService.getAll(filter, undefined, { ...sortOptions });
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const bannerController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};

