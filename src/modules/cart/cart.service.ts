import { QueryOptions } from 'mongoose';
import {CartModel} from './cart.model';
import {ICartDoc} from './cart.type';

const createOne = async (body: any): Promise<ICartDoc | null> => {
  return CartModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<ICartDoc | null> => {
  return CartModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<ICartDoc | null> => {
  return CartModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<ICartDoc | null> => {
  return CartModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<ICartDoc[]> => {
  return CartModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<ICartDoc[]> => {
  return CartModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const cartService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
