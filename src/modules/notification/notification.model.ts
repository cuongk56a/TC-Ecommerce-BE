import mongoose from 'mongoose';
import {INotificationDoc, NOTIFICATION_FOR, NOTIFICATION_TYPE, entityModelObj} from './notification.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_NOTIFICATION} from './notification.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface INotificationModelDoc extends INotificationDoc {}
interface INotificationModel extends IDocModel<INotificationModelDoc> {}

const notificationSchema = new mongoose.Schema<INotificationModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOneModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    notiType: {
      type: String,
      enum: NOTIFICATION_TYPE
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'entityOnModel', 
    },
    notiFor: {
      type: String,
      enum: NOTIFICATION_FOR
    }, 
    users: {
      type: [
        mongoose.Schema.Types.ObjectId
      ],
      default: []
    },
    seen: {
      type: [
        mongoose.Schema.Types.ObjectId
      ],
      default: []
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: {type: Date, required: false},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

notificationSchema.index({title: 'text'});
notificationSchema.index({content: 'text'});

notificationSchema.virtual('entity', {
  ref: (doc: any) => entityModelObj[doc.notiType],
  localField: 'entityId',
  foreignField: '_id',
  justOne: true,
});

notificationSchema.virtual('userCanSeen', {
  ref: TABLE_USER,
  localField: 'users',
  foreignField: '_id',
  justOne: false,
  match: {deletedById: {$exists: false}},
});

notificationSchema.virtual('userSeen', {
  ref: TABLE_USER,
  localField: 'seen',
  foreignField: '_id',
  justOne: false,
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasEntity}: {hasEntity: boolean;}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasEntity
        ? {
            path: 'entity',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

notificationSchema.pre('findOne', preFind);
notificationSchema.pre('find', preFind);

/**
 * @typedef Notification
 */
export const NotificationModel = mongoose.model<INotificationModelDoc, INotificationModel>(TABLE_NOTIFICATION, notificationSchema);
