import mongoose from 'mongoose';
import {IChatDoc} from './chat.type';
import {IDocModel} from '../../../utils/types/entityTypes';
import {TABLE_CHAT} from './chat.configs';
import {paginate, toJSON} from '../../../utils/plugins';
import {TABLE_USER} from '../../user/user.configs';
import {TABLE_ROOM_CHAT} from '../roomChat/roomChat.configs';
import { createNewQueue } from '../../../redis/queue';

export interface IChatModelDoc extends IChatDoc {}
interface IChatModel extends IDocModel<IChatModelDoc> {}

const chatSchema = new mongoose.Schema<IChatModelDoc>(
  {
    roomId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
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

chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

chatSchema.virtual('sender', {
  ref: TABLE_USER,
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasSender}: {hasSender: boolean}) => {
  let pA: any[] = [];
  return pA.concat(
    !!hasSender
      ? {
          path: 'sender',
        }
      : [],
  );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

chatSchema.pre('findOne', preFind);
chatSchema.pre('find', preFind);

async function afterSave(doc: IChatModelDoc, next: any) {
  if (!!doc) {
    const orderQueue = createNewQueue('ChatQueue');
    orderQueue
      .add({
        chat: doc,
      })
      .catch(err => {
        console.error('Model:Chat:afterSave Err ', err);
        next();
      })
      .then(() => {
        next();
      });
  } else {
    next();
  }
  next();
}

chatSchema.post('save', afterSave);

/**
 * @typedef Chat
 */
export const ChatModel = mongoose.model<IChatModelDoc, IChatModel>(TABLE_CHAT, chatSchema);
