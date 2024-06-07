import mongoose from 'mongoose';
import {IBlogDoc} from './blog.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_BLOG} from './blog.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { getImageUriFromFilename } from '../../utils/core/stringUtil';

export interface IBlogModelDoc extends IBlogDoc {}
interface IBlogModel extends IDocModel<IBlogModelDoc> {}

const blogSchema = new mongoose.Schema<IBlogModelDoc>(
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
    title: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
    },
    content: {
      type: String,
    },
    isActive: {
      type: Boolean,
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

blogSchema.virtual('thumbnailUri').get(function () {
  return getImageUriFromFilename(this.thumbnail || '');
});

blogSchema.plugin(toJSON);
blogSchema.plugin(paginate);

blogSchema.index({title: 'text'});
blogSchema.index({content: 'text'});

/**
 * @typedef Blog
 */
export const BlogModel = mongoose.model<IBlogModelDoc, IBlogModel>(TABLE_BLOG, blogSchema);
