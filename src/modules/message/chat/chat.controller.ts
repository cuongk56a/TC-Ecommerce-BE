import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import { catchAsync } from '../../../utils/core/catchAsync';
import { pick } from '../../../utils/core/pick';
import {chatService} from './chat.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await chatService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId} = req.params;
    const {userId, ...body} = req.body;
    try {
        const data = await chatService.updateOne(
            {_id: chatId},
            req.body
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
    const {chatId} = req.params;
    try {
        const data = await chatService.updateOne({_id: chatId}, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId} = req.params;
    const options = pick(req.query, ['hasSender']);
    try {
        const data = await chatService.getOne(
            {_id: chatId},
            options
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
    const filter = pick(req.query, ['roomId']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    const options = pick(req.query, ['hasSender']);
    try {
        const data = await chatService.getList(filter, {...queryOptions, options});
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['roomId']);
    const options = pick(req.query, ['hasSender']);
    try {
        const data = await chatService.getAll(filter, options);
        res.send(data);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const chatController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
