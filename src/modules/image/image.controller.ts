import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { imageService } from './image.service';
import { MulterFile } from './image.type';

const createOrUpdateMany = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    try {
        console.log(req.files);
        // const images = await Promise.all(
        //     (req.files as MulterFile[]).map(async (image) => {
        //         return await imageService.createOne({
        //             originalName: image.originalname,
        //             fileName: image.filename.split('/')[1],
        //             path: image.path,
        //             size: image.size,
        //             mimetype: image.mimetype,
        //             fileExtension: image.mimetype.split('/')[1],
        //             fileType: image.mimetype.split('/')[0],
        //         });
        //     })
        // );

        // res.status(201).json(images);
    } catch (error:any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {fileName} = pick(req.params, ['fileName']);
    try {
        const data = await imageService.getOne({originalName: fileName});
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
    createOrUpdateMany,
    getOne,
    getAll,
};

