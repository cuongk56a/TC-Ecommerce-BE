import mongoose from 'mongoose';
import {ILocationDoc, LOCATION_TYPE} from './location.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_LOCATION} from './location.configs';
import {paginate, toJSON} from '../../utils/plugins';

export interface ILocationModelDoc extends ILocationDoc {}
interface ILocationModel extends IDocModel<ILocationModelDoc> {}

const locationSchema = new mongoose.Schema<ILocationModelDoc>(
  {
    locationType: {
      type: String,
      enum: LOCATION_TYPE
    },
    name: {
      type: String,
    },
    prefix: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_LOCATION
    },
    latitude:{
      type: Number
    },
    longitude:{
      type: Number
    },
    vtpId: {
      type: Number
    }
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);

locationSchema.index({name: 'text'});

/**
 * @typedef Location
 */
export const LocationModel = mongoose.model<ILocationModelDoc, ILocationModel>(TABLE_LOCATION, locationSchema);
