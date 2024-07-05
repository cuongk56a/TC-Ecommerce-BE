import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import {catchAsync} from '../../../utils/core/catchAsync';
import {pick} from '../../../utils/core/pick';
import {roomChatService} from './roomChat.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await roomChatService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roomChatId} = req.params;
  try {
    const data = await roomChatService.updateOne({_id: roomChatId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roomChatId} = req.params;
  try {
    const data = await roomChatService.updateOne({_id: roomChatId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {roomChatId} = req.params;
  try {
    const data = await roomChatService.getOne({_id: roomChatId});
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['roomId', 'targerId', 'targetOnModel', 'userId']);
  const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
  const options = pick(req.query, ['hasUser', 'hasTarget','hasMessage']);
  try {
    const data = await roomChatService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['roomId', 'targerId', 'targetOnModel', 'userId']);
  const options = pick(req.query, ['hasUser', 'hasTarget','hasMessage']);
  try {
    const data = await roomChatService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const createOrUpdate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {targerId, userId, ...body} = req.body;
  try {
    const data = await roomChatService.updateOne(
      {
        targerId,
        userId,
      },
      {
        ...body,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const roomChatController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  createOrUpdate,
};
