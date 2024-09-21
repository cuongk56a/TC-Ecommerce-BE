import { QueryOptions } from 'mongoose';
import { ImageModel } from './image.model';
import { IImageDoc } from './image.type';

const createOne = async (body: any): Promise<IImageDoc | null> => {
  return ImageModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IImageDoc | null> => {
  return ImageModel.findOneAndUpdate(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  );
};

const deleteOne = async (filter: any): Promise<IImageDoc | null> => {
  return ImageModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IImageDoc | null> => {
  return ImageModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IImageDoc[]> => {
  return ImageModel.paginate(
    {
      ...filter,
      deletedById: { $exists: false },
    },
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IImageDoc[]> => {
  return ImageModel.find(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

export const imageService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
