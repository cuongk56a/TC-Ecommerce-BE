import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import {locationService} from './location.service';

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {locationId} = req.params;
    try {
        const data = await locationService.updateOne({_id: locationId}, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {locationId} = req.params;
    try {
        const data = await locationService.getOne(
        {_id: locationId},
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
    const filter = pick(req.query, ['createdById', 'isTeacher','isAdmin','search','locationId']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    try {
        const data = await locationService.getList(filter, {...queryOptions});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'isAdmin', 'isTeacher','search','locationId']);
    try {
        const data = await locationService.getAll(filter);
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const locationController = {
    updateOne,
    getOne,
    getAll,
    getList,
};
