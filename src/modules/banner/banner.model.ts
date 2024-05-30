import mongoose from 'mongoose';
import {BANNER_ACTION_TYPE, IBannerDoc} from './banner.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_BANNER} from './banner.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IBannerModelDoc extends IBannerDoc {}
interface IBannerModel extends IDocModel<IBannerModelDoc> {}

const bannerSchema = new mongoose.Schema<IBannerModelDoc>(
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
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: BANNER_ACTION_TYPE,
    },
    entityId: {
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

bannerSchema.plugin(toJSON);
bannerSchema.plugin(paginate);

// bannerSchema.virtual('thumbnailUri').get(function () {
//   return getImageUriFromFilename(this.thumbnail || "");
// });

const populateArr = ({hasUnit, hasCategory}: {hasUnit: boolean, hasCategory: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasUnit
        ? {
            path: 'unit',
          }
        : [],
    )
    .concat(
      !!hasCategory
        ? {
            path: 'category',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

bannerSchema.pre('findOne', preFind);
bannerSchema.pre('find', preFind);

/**
 * @typedef Banner
 */
export const BannerModel = mongoose.model<IBannerModelDoc, IBannerModel>(TABLE_BANNER, bannerSchema);
