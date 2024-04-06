import mongoose from 'mongoose';
import {IOrganizationDoc} from './organization.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ORGANIZATION} from './organization.configs';
import {paginate, toJSON} from '../../utils/plugins'
import {getImageUriFromFilename} from '../../utils/stringUtil';
import { hashPassword } from '../../utils/hashUtil';
import { genCode } from '../../utils/core/genCode';
import { TABLE_USER } from '../user/user.configs';

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
    banner: {
      type: String,
    },
    address: {
      type: String,
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

function formatPhoneNumber(phoneNumber: any) {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (numericPhoneNumber.startsWith('0')) {
    const formattedPhoneNumber = `+84${numericPhoneNumber.substr(1)}`;
    return formattedPhoneNumber;
  } else {
    return `+${numericPhoneNumber}`;
  }
}

organizationSchema.pre('save', async function (next) {
  // console.log(getNewToken({id: this._id}));
  next();
});

function preUpdate() {
  const { phone } = this.getUpdate();
  if (!!phone) {
    this.getUpdate().$set.phone = formatPhoneNumber(phone);
  }
}

organizationSchema.pre('findOneAndUpdate', preUpdate);

// OrganizationSchema.index({CODE: 1});
organizationSchema.index({phone: 1});
organizationSchema.index({email: 1});
organizationSchema.index({fullName: 'text'});

/**
 * @typedef Organization
 */
export const OrganizationModel = mongoose.model<IOrganizationModelDoc, IOrganizationModel>(TABLE_ORGANIZATION, organizationSchema);
