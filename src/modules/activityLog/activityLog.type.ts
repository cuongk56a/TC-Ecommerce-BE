import mongoose from 'mongoose';

export enum MODEL_TYPE {
  PRODUCT = 'PRODUCT',
  BLOG = 'BLOG',
  ORDER = 'ORDER',
}

export enum METHOD_TYPE {
  GET = 'GET',
  POST = 'POST',
  UPDATE = 'UPDATE',
}

export interface IActivityLogDoc extends mongoose.Document {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  userId?: mongoose.Schema.Types.ObjectId;
  methodType: METHOD_TYPE;
  modelType: MODEL_TYPE;
  timeLog: Date;
}
