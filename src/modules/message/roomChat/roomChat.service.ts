import { QueryOptions } from 'mongoose';
import {RoomChatModel} from './roomChat.model';
import {IRoomChatDoc} from './roomChat.type';

const createOne = async (body: any): Promise<IRoomChatDoc | null> => {
  return RoomChatModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IRoomChatDoc | null> => {
  return RoomChatModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IRoomChatDoc | null> => {
  return RoomChatModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IRoomChatDoc | null> => {
  return RoomChatModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IRoomChatDoc[]> => {
  return RoomChatModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IRoomChatDoc[]> => {
  return RoomChatModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const roomChatService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
