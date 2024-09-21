import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';

export interface IRoomChatDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  roomId: string;
  userId: mongoose.Schema.Types.ObjectId;
}
