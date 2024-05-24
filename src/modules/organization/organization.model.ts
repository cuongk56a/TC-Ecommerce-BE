import mongoose from 'mongoose';
import {IOrganizationDoc} from './organization.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ORGANIZATION} from './organization.configs';
import {paginate, toJSON} from '../../utils/plugins'
import {getImageUriFromFilename} from '../../utils/stringUtil';
import { hashPassword } from '../../utils/hashUtil';
import { genCode } from '../../utils/core/genCode';
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ADDRESS } from '../address/address.configs';

export interface IOrganizationModelDoc extends IOrganizationDoc {}
interface IOrganizationModel extends IDocModel<IOrganizationModelDoc> {}

const organizationSchema = new mongoose.Schema<IOrganizationModelDoc>(
  {
    name: {
      type: String,
      require: true,
    },
    hotline: {
      type: String,
      required: false,
      index: {unique: true, sparse: true},
    },
    email: {
      type: String,
      required: false,
      index: {unique: true, sparse: true},
    },
    webUrl: {
      type: String,
    },
    thumbnail: {
      type: String,
      required: true
    },
    slogan: {
      type: String,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
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

organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

// OrganizationSchema.virtual('avatarUri').get(function () {
//   return getImageUriFromFilename(this.avatar);
// });

organizationSchema.virtual('address', {
  ref: TABLE_ADDRESS,
  localField: 'addressId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasAddress}: {hasAddress: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasAddress
        ? {
            path: 'address',
            options: {hasLocation: true}
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

organizationSchema.pre('findOne', preFind);
organizationSchema.pre('find', preFind);

// OrganizationSchema.index({CODE: 1});
organizationSchema.index({phone: 1});
organizationSchema.index({email: 1});
organizationSchema.index({hotline: 1});
organizationSchema.index({name: 'text'});

/**
 * @typedef Organization
 */
export const OrganizationModel = mongoose.model<IOrganizationModelDoc, IOrganizationModel>(TABLE_ORGANIZATION, organizationSchema);
