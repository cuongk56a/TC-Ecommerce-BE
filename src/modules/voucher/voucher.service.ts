import { QueryOptions } from 'mongoose';
import {VoucherModel} from './voucher.model';
import {IVoucherDoc} from './voucher.type';

const createOne = async (body: any): Promise<IVoucherDoc | null> => {
  return VoucherModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IVoucherDoc | null> => {
  return VoucherModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IVoucherDoc | null> => {
  return VoucherModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IVoucherDoc | null> => {
  return VoucherModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IVoucherDoc[]> => {
  return VoucherModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IVoucherDoc[]> => {
  return VoucherModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const voucherService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
