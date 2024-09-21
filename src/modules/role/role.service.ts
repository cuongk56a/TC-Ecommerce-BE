import { QueryOptions } from 'mongoose';
import {RoleModel} from './role.model';
import {IRoleDoc} from './role.type';

const createOne = async (body: any): Promise<IRoleDoc | null> => {
  return RoleModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IRoleDoc | null> => {
  return RoleModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IRoleDoc | null> => {
  return RoleModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IRoleDoc | null> => {
  return RoleModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IRoleDoc[]> => {
  return RoleModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IRoleDoc[]> => {
  return RoleModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const roleService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
