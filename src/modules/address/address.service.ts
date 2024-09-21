import { QueryOptions } from 'mongoose';
import {AddressModel} from './address.model';
import {IAddressDoc} from './address.type';

const createOne = async (body: any): Promise<IAddressDoc | null> => {
  return AddressModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IAddressDoc | null> => {
  return AddressModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IAddressDoc | null> => {
  return AddressModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IAddressDoc | null> => {
  return AddressModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IAddressDoc[]> => {
  return AddressModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {...sortOptions, createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IAddressDoc[]> => {
  return AddressModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {...sortOptions,createdAt: -1}, ...options},
  );
};

export const addressService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
