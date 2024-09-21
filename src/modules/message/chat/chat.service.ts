import { QueryOptions } from 'mongoose';
import {ChatModel} from './chat.model';
import {IChatDoc} from './chat.type';

const createOne = async (body: any): Promise<IChatDoc | null> => {
  return ChatModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IChatDoc | null> => {
  return ChatModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IChatDoc | null> => {
  return ChatModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IChatDoc | null> => {
  return ChatModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IChatDoc[]> => {
  return ChatModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IChatDoc[]> => {
  return ChatModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const chatService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
