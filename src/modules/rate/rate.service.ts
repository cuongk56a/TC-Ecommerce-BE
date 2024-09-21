import { QueryOptions } from 'mongoose';
import {RateModel} from './rate.model';
import {IRateDoc} from './rate.type';

const createOne = async (body: any): Promise<IRateDoc | null> => {
  return RateModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IRateDoc | null> => {
  return RateModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IRateDoc | null> => {
  return RateModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IRateDoc | null> => {
  return RateModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IRateDoc[]> => {
  return RateModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IRateDoc[]> => {
  return RateModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const rateService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
