import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';
import { IUserModelDoc } from '../../user/user.model';

export interface IChatDoc extends IDoc {
  roomId: string; 
  senderId: mongoose.Schema.Types.ObjectId;
  sender: IUserModelDoc;
  content: string;
}
