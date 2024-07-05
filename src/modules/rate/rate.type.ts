import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';
import { IProductDoc } from '../product/product/product.type';

export interface IRateDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  productId: mongoose.Schema.Types.ObjectId;
  product: IProductDoc;
  star: number;
  comment: string;
  attachments: string[];
}
