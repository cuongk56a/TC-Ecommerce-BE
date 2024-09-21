import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { addressService } from './address.service';
import { AddressModel } from './address.model';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await addressService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;
    const { isDefault, createdById, ...body } = req.body;
    try {
        if (!!isDefault && isDefault === true) {
            await AddressModel.updateMany({ createdById }, { isDefault: false })
        }
        const data = await addressService.updateOne({ _id: addressId }, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;
    try {
        const data = await addressService.deleteOne({ _id: addressId });
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;
    const options = pick(req.query, ['hasLocation']);
    try {
        const data = await addressService.getOne(
            { _id: addressId },
            options
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
    const filter = pick(req.query, ['createdById', 'isDefault']);
    const options = pick(req.query, ['hasLocation']);
    const queryOptions = pick(req.query, ['limit', 'page']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await addressService.getList(filter, { ...queryOptions, options }, sortOptions);
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['createdById', 'isDefault']);
    const options = pick(req.query, ['hasLocation']);
    const sortOptions = pick(req.query, ['sort'])
    try {
        const data = await addressService.getAll(filter, options, sortOptions);
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const addressController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
