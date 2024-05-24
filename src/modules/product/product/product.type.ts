import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';

export interface IProductDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  barcode: string;
  name: string;
  thumbnail: string;
  attachments: string[];
  categoryId: mongoose.Schema.Types.ObjectId;
  brandId: mongoose.Schema.Types.ObjectId; 
  capitalPrice: number;
  salePrice: number;
  price: number;
  priceByWeight: boolean; 
  quantity: number;
  weight: number;
  unitId: mongoose.Schema.Types.ObjectId;
  isActive?: boolean;
}
