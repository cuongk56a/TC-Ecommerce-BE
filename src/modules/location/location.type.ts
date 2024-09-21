import mongoose from 'mongoose';

export enum LOCATION_TYPE  {
  PROVINCE = 'PROVINCE',
  DISTRICT = 'DISTRICT',
  WARD = 'WARD',
}

export interface ILocationDoc extends mongoose.Document {
  locationType: LOCATION_TYPE;
  name: string;
  prefix: string;
  parentId: mongoose.Schema.Types.ObjectId;
  latitude?:number;
  longitude?:number;
  vtpId?: number;
}
