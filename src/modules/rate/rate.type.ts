import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IRateDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  productId: mongoose.Schema.Types.ObjectId;
  star: number;
  comment: string;
  attachments: string[];
}
