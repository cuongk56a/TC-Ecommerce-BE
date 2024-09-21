import { QueryOptions } from 'mongoose';
import {BrandModel} from './brand.model';
import {IBrandDoc} from './brand.type';

const createOne = async (body: any): Promise<IBrandDoc | null> => {
  return BrandModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IBrandDoc | null> => {
  return BrandModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IBrandDoc | null> => {
  return BrandModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IBrandDoc | null> => {
  return BrandModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?:any): Promise<IBrandDoc[]> => {
  return BrandModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {...sortOptions, createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any, sortOptions?:any): Promise<IBrandDoc[]> => {
  return BrandModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {...sortOptions,createdAt: -1}, ...options},
  );
};

export const brandService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
