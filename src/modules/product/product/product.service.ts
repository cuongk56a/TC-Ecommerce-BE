import { QueryOptions } from 'mongoose';
import {ProductModel} from './product.model';
import {IProductDoc} from './product.type';

const createOne = async (body: any): Promise<IProductDoc | null> => {
  return ProductModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IProductDoc | null> => {
  return ProductModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IProductDoc | null> => {
  return ProductModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IProductDoc | null> => {
  return ProductModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IProductDoc[]> => {
  return ProductModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {...sortOptions,createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IProductDoc[]> => {
  return ProductModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {...sortOptions, createdAt: -1}, ...options},
  );
};

export const productService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
