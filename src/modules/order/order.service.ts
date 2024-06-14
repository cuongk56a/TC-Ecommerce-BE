import { QueryOptions } from 'mongoose';
import {OrderModel} from './order.model';
import {IOrderDoc, STATUS_ORDER_TYPE} from './order.type';
import moment from 'moment-timezone';
import { appConfigs } from '../../config/config';

const createOne = async (body: any): Promise<IOrderDoc | null> => {
  return OrderModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.paginate(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.find(
    {
      deletedById: {$exists: false},
      deletedAt: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

const cronJobOrder = async (filter?: any, options?: any, sortOptions?: any): Promise<IOrderDoc[]> => {
  const orders = await OrderModel.find(
    {
      deletedById: {$exists: false},
      status: STATUS_ORDER_TYPE.PENDING,
      createdAt: {
        $gte: moment().tz(appConfigs.timeZone).subtract(5, 'days').unix(),
        $lte: moment().tz(appConfigs.timeZone).unix(),
      }
    },
    undefined,
    {sort: {...sortOptions, createdAt: -1}, ...options},
  );
  await Promise.all([
    orders.map(async(order:any)=>{
      OrderModel.findOneAndUpdate({_id: order?._id}, {status: STATUS_ORDER_TYPE.REJECT}, { new: true});
    })
  ])
  return orders
};


export const orderService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  cronJobOrder,
};
