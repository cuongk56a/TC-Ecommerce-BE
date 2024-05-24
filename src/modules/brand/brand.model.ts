import mongoose from 'mongoose';
import {IBrandDoc} from './brand.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_BRAND} from './brand.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IBrandModelDoc extends IBrandDoc {}
interface IBrandModel extends IDocModel<IBrandModelDoc> {}

const brandSchema = new mongoose.Schema<IBrandModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
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

brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

brandSchema.index({name: 'text'});

/**
 * @typedef Brand
 */
export const BrandModel = mongoose.model<IBrandModelDoc, IBrandModel>(TABLE_BRAND, brandSchema);
