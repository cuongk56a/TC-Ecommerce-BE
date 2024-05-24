import { QueryOptions } from 'mongoose';
import {OrderModel} from './order.model';
import {IOrderDoc} from './order.type';

const createOne = async (body: any): Promise<IOrderDoc | null> => {
  return OrderModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.paginate(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.find(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const orderService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
