import mongoose from 'mongoose';
import {IRoomChatDoc} from './roomChat.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import {TABLE_ROOM_CHAT} from './roomChat.configs';
import {paginate, toJSON} from '../../../utils/plugins'
import { TABLE_USER } from '../../user/user.configs';
import { TABLE_ORGANIZATION } from '../../organization/organization.configs';
import { TABLE_CHAT } from '../chat/chat.configs';

export interface IRoomChatModelDoc extends IRoomChatDoc {}
interface IRoomChatModel extends IDocModel<IRoomChatModelDoc> {}

const roomChatSchema = new mongoose.Schema<IRoomChatModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    roomId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

roomChatSchema.plugin(toJSON);
roomChatSchema.plugin(paginate);

roomChatSchema.virtual('roomId').get(function(){
  return '${this.targetId}_+${this.userId}';
});

roomChatSchema.virtual('user', {
  ref: TABLE_USER,
  localField: 'userId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

roomChatSchema.virtual('target', {
  ref: TABLE_ORGANIZATION,
  localField: 'targetId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

roomChatSchema.virtual('message', {
  ref: TABLE_CHAT,
  localField: 'roomId', 
  foreignField: 'roomId',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasUser, hasTarget, hasMessage}: {hasUser: boolean, hasTarget: boolean, hasMessage: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasUser
        ? {
            path: 'user',
          }
        : [],
    )
    .concat(
      !!hasTarget
        ? {
            path: 'target',
          }
        : [],
    )
    .concat(
      !!hasMessage
        ? {
            path: 'message',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

roomChatSchema.pre('findOne', preFind);
roomChatSchema.pre('find', preFind);

/**
 * @typedef RoomChat
 */
export const RoomChatModel = mongoose.model<IRoomChatModelDoc, IRoomChatModel>(TABLE_ROOM_CHAT, roomChatSchema);
