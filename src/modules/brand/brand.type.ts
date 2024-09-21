import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export interface IBrandDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  name: string;
  description: string;
  logo: string;
}
