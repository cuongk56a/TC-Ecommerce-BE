import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface ICategoryDoc extends IDoc {
  targetId: mongoose.Types.ObjectId;
  targetOnModel: string;
  name: string;
  thumbnail: string;
  description: string;
  parentId: mongoose.Types.ObjectId;

  inHome: boolean;
  isActive: boolean;

  child: ICategoryDoc[];
}
