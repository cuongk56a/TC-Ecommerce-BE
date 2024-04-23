import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import {activityLogService} from './activityLog.service';

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {activityLogId} = req.params;
    try {
        const data = await activityLogService.getOne(
        {_id: activityLogId},
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
    const filter = pick(req.query, ['createdById', 'isTeacher','isAdmin','search','activityLogId']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    try {
        const data = await activityLogService.getList(filter, {...queryOptions});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'isAdmin', 'isTeacher','search','activityLogId']);
    try {
        const data = await activityLogService.getAll(filter);
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const activityLogController = {
    getOne,
    getAll,
    getList,
};
