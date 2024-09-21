import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import {notificationService} from './notification.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await notificationService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {notificationId} = req.params;
    const {userId, ...body} = req.body;
    try {
        const data = await notificationService.updateOne(
            {_id: notificationId},
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
    const {notificationId} = req.params;
    try {
        const data = await notificationService.updateOne({_id: notificationId}, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {notificationId} = req.params;
    try {
        const data = await notificationService.getOne(
            {_id: notificationId},
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
    const filter = pick(req.query, ['targetId', 'targetOnModel','notiType','entityId','notiFor', 'userId']);
    const options = pick(req.query, ['hasEntity', 'hasCanSeen', 'hasUserSeen']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    try {
        const data = await notificationService.getList(filter, {...queryOptions, ...options});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['targetId', 'targetOnModel','notiType','entityId','notiFor', 'userId']);
    const options = pick(req.query, ['hasEntity', 'hasCanSeen', 'hasUserSeen']);
    try {
        const data = await notificationService.getAll(filter, options);
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const notificationController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
