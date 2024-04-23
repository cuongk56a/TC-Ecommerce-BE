import { QueryOptions } from 'mongoose';
import {ActivityLogModel} from './activityLog.model';
import {IActivityLogDoc} from './activityLog.type';

const getOne = async (filter: any, options?: any): Promise<IActivityLogDoc | null> => {
  return ActivityLogModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IActivityLogDoc[]> => {
  return ActivityLogModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IActivityLogDoc[]> => {
  return ActivityLogModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const activityLogService = {
  getOne,
  getAll,
  getList,
};
