import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export enum NOTIFICATION_FOR {
  ALL = 'ALL',
  SELECT = 'SELECT',
}

export enum NOTIFICATION_TYPE {
  'FROM_ADMIN' = 'FROM_ADMIN',
  'MEMBERSHIP' = 'MEMBERSHIP',
  'ORDER' = 'ORDER',
  'COMMENT' = 'COMMENT',
  'BLOG' = 'BLOG',
  'LIKE' = 'LIKE',
}

export const entityModelObj: any = {
  // [NotiTypes.ORDER]: TABLE_ORDER,
  // [NotiTypes.VOUCHER]: TABLE_VOUCHER,
  // [NotiTypes.REVIEW]: TABLE_COMMENT,
  // [NotiTypes.MEMBERSHIP]: TABLE_MEMBERSHIP,
  // [NotiTypes.TICKET]: TABLE_TICKET,
  // [NotiTypes.BOOK_CAR]: TABLE_BOOK_CAR,
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
