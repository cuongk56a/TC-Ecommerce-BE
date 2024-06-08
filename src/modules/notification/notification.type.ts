import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';
import { TABLE_ORDER } from '../order/order.configs';
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ROLE } from '../role/role.configs';

export enum NOTIFICATION_FOR {
  ALL = 'ALL',
  SELECT = 'SELECT',
}

export enum NOTIFICATION_TYPE {
  'FROM_ADMIN' = 'FROM_ADMIN',
  'USER' = 'USER',
  'ROLE' = 'ROLE',
  'ORDER' = 'ORDER',
  'COMMENT' = 'COMMENT',
  'BLOG' = 'BLOG',
  'LIKE' = 'LIKE',
}

export const entityModelObj: any = {
  [NOTIFICATION_TYPE.ORDER]: TABLE_ORDER,
  [NOTIFICATION_TYPE.USER]: TABLE_USER,
  [NOTIFICATION_TYPE.ROLE]: TABLE_ROLE,
};

export interface INotificationDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  notiType: NOTIFICATION_TYPE;
  title: string;
  content: string;
  entityId: mongoose.Schema.Types.ObjectId;
  notiFor: NOTIFICATION_FOR;
  users: mongoose.Schema.Types.ObjectId[];
  seen: mongoose.Schema.Types.ObjectId[];
}
