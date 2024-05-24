import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';
import { ILocationModelDoc } from '../location/location.model';

export interface IAddressDoc extends IDoc {
  name?: string;
  phone?: string;
  email?: string;
  isDefault: boolean,
  note: string,
  provinceId: mongoose.Schema.Types.ObjectId;
  province: ILocationModelDoc;
  districtId: mongoose.Schema.Types.ObjectId;
  district: ILocationModelDoc;
  wardId: mongoose.Schema.Types.ObjectId;
  ward: ILocationModelDoc;
}
