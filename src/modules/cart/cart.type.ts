import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';



export interface ICartDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  items: {
    productId: mongoose.Schema.Types.ObjectId;
    qty: number;
  }[];
}
