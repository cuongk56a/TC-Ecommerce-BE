import { QueryOptions } from 'mongoose';
import {LocationModel} from './location.model';
import {ILocationDoc} from './location.type';

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<ILocationDoc | null> => {
  return LocationModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const getOne = async (filter: any, options?: any): Promise<ILocationDoc | null> => {
  return LocationModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<ILocationDoc[]> => {
  return LocationModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<ILocationDoc[]> => {
  return LocationModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const locationService = {
  updateOne,
  getOne,
  getAll,
  getList,
};
