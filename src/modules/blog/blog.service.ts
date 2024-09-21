import { QueryOptions } from 'mongoose';
import { BlogModel } from './blog.model';
import { IBlogDoc } from './blog.type';

const createOne = async (body: any): Promise<IBlogDoc | null> => {
  return BlogModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IBlogDoc | null> => {
  return BlogModel.findOneAndUpdate(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  );
};

const deleteOne = async (filter: any): Promise<IBlogDoc | null> => {
  return BlogModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IBlogDoc | null> => {
  return BlogModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IBlogDoc[]> => {
  return BlogModel.paginate(
    {
      ...filter,
      deletedById: { $exists: false },
    },
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IBlogDoc[]> => {
  return BlogModel.find(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

export const blogService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
