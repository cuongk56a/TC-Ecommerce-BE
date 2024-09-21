import { QueryOptions } from 'mongoose';
import {OrganizationModel} from './organization.model';
import {IOrganizationDoc} from './organization.type';

const createOne = async (body: any): Promise<IOrganizationDoc | null> => {
  return OrganizationModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IOrganizationDoc | null> => {
  return OrganizationModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IOrganizationDoc | null> => {
  return OrganizationModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IOrganizationDoc | null> => {
  return OrganizationModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IOrganizationDoc[]> => {
  return OrganizationModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IOrganizationDoc[]> => {
  return OrganizationModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const organizationService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
