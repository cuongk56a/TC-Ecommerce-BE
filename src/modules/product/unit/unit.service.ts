import { QueryOptions } from 'mongoose';
import {UnitModel} from './unit.model';
import {IUnitDoc} from './unit.type';

const createOne = async (body: any): Promise<IUnitDoc | null> => {
  return UnitModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IUnitDoc | null> => {
  return UnitModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IUnitDoc | null> => {
  return UnitModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IUnitDoc | null> => {
  return UnitModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IUnitDoc[]> => {
  return UnitModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IUnitDoc[]> => {
  return UnitModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const unitService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
