import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import { catchAsync } from '../../../utils/core/catchAsync';
import { pick } from '../../../utils/core/pick';
import {unitService} from './unit.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await unitService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {unitId} = req.params;
    const {userId, ...body} = req.body;
    try {
        const data = await unitService.updateOne(
            {_id: unitId},
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
    const {unitId} = req.params;
    try {
        const data = await unitService.updateOne({_id: unitId}, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {unitId} = req.params;
    try {
        const data = await unitService.getOne(
            {_id: unitId},
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
    const filter = pick(req.query, ['createdById', 'isTeacher','isAdmin','search','unitId']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    try {
        const data = await unitService.getList(filter, {...queryOptions});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'isAdmin', 'isTeacher','search','unitId']);
    try {
        const data = await unitService.getAll(filter);
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const unitController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
