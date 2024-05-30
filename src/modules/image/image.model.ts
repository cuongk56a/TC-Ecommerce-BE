import mongoose from 'mongoose';
import {IImageDoc} from './image.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_IMAGE} from './image.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IImageModelDoc extends IImageDoc {}
interface IImageModel extends IDocModel<IImageModelDoc> {}

const imageSchema = new mongoose.Schema<IImageModelDoc>(
  {
    fileName: {
      type: String,
      required: true
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

imageSchema.plugin(toJSON);
imageSchema.plugin(paginate);

imageSchema.index({title: 'text'});
imageSchema.index({content: 'text'});

/**
 * @typedef Image
 */
export const ImageModel = mongoose.model<IImageModelDoc, IImageModel>(TABLE_IMAGE, imageSchema);
