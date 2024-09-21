import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IBlogDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  title: string;
  thumbnail: string;
  content: string;
  isActive?: boolean;
}
