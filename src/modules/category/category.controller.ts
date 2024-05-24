import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { categoryService } from './category.service';
import { uniq } from '../../utils/stringUtil';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {categoryId} = req.params;
  try {
    const data = await categoryService.updateOne({_id: categoryId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {categoryId} = req.params;
  try {
    const data = await categoryService.updateOne({_id: categoryId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {categoryId} = req.params;
  const options = pick(req.query, ['hasChild']);
  try {
    const data = await categoryService.getOne({_id: categoryId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {parentId, ...filter} = pick(req.query, [
    'parentId',
    'search',
    'targetId',
    'targetOnModel',
    'categoryType',
    'isActive',
    'inHome',
  ]);
  const options = pick(req.query, ['hasChild']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const sortOptions = pick(req.query, ['sort']);
  try {
    const data = await categoryService.getList(
      {...filter, ...(!!parentId ? {parentId} : {parentId: {$exists: false}})},
      {...queryOptions, options},
      {...sortOptions}
    );
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {parentId, ids, ...filter} = pick(req.query, [
    'parentId',
    'ids',
    'search',
    'targetId',
    'targetOnModel',
    'categoryType',
    'isActive',
    'inHome',
  ]);
  const options = pick(req.query, ['hasChild']);
  const sortOptions = pick(req.query, ['sort']);
  try {
    const data = await categoryService.getAll(
      {
        ...filter,
        ...(!!ids ? {_id: {$in: uniq(ids.split(','))}} : {}),
        ...(!!parentId ? {parentId} : {parentId: {$exists: false}}),
      },
      options,
      {...sortOptions}
    );
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const categoryController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getList,
  getAll,
};
