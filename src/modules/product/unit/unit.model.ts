import mongoose from 'mongoose';
import {IUnitDoc} from './unit.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import {TABLE_UNIT} from './unit.configs';
import {paginate, toJSON} from '../../../utils/plugins'
import { TABLE_USER } from '../../user/user.configs';

export interface IUnitModelDoc extends IUnitDoc {}
interface IUnitModel extends IDocModel<IUnitModelDoc> {}

const unitSchema = new mongoose.Schema<IUnitModelDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    isActive:{
      type: Boolean,
      default: true
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: {type: Date, required: false},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

unitSchema.plugin(toJSON);
unitSchema.plugin(paginate);

/**
 * @typedef Unit
 */
export const UnitModel = mongoose.model<IUnitModelDoc, IUnitModel>(TABLE_UNIT, unitSchema);
