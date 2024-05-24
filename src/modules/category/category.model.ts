import mongoose from 'mongoose';
import {ICategoryDoc} from './category.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_CATEGORY} from './category.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { getImageUriFromFilename } from '../../utils/stringUtil';

export interface ICategoryModelDoc extends ICategoryDoc {}
interface ICategoryModel extends IDocModel<ICategoryModelDoc> {}

const categorySchema = new mongoose.Schema<ICategoryModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      //model of targetId
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    inHome: {
      type: Boolean,
      default: false,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: false,
    },
    deletedAt: {type: Date, required: false},
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: false,
    },
  },
  {
    timestamps: true,

    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

categorySchema.virtual('child', {
  ref: TABLE_CATEGORY, // The model to use, conditional on the doc
  localField: '_id', // Find people or organizations where `localField`
  foreignField: 'parentId', // is equal to `foreignField`
  justOne: false, // and return only one
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasChild}: {hasChild: boolean}) => {
  let pA: any[] = [];
  return pA.concat(
    !!hasChild
      ? {
          path: 'child',
          options: {hasChild: true},
        }
      : [],
  );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

categorySchema.pre('findOne', preFind);
categorySchema.pre('find', preFind);

categorySchema.virtual('thumbnailUri').get(function () {
  return getImageUriFromFilename(this.thumbnail || '');
});

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

categorySchema.index({targetId: 1});
categorySchema.index({targetOnModel: 1});
categorySchema.index({parentId: 1});
categorySchema.index({isActive: 1});
categorySchema.index({inHome: 1});
categorySchema.index({name: 'text'});

/**
 * @typedef Categorys
 */
export const CategoryModel = mongoose.model<ICategoryModelDoc, ICategoryModel>(TABLE_CATEGORY, categorySchema);
