import { QueryOptions } from 'mongoose';
import { BannerModel } from './banner.model';
import { IBannerDoc } from './banner.type';

const createOne = async (body: any): Promise<IBannerDoc | null> => {
  return BannerModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IBannerDoc | null> => {
  return BannerModel.findOneAndUpdate(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  );
};

const deleteOne = async (filter: any): Promise<IBannerDoc | null> => {
  return BannerModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IBannerDoc | null> => {
  return BannerModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IBannerDoc[]> => {
  return BannerModel.paginate(
    {
      ...filter,
      deletedById: { $exists: false },
    },
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IBannerDoc[]> => {
  return BannerModel.find(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  );
};

export const bannerService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
