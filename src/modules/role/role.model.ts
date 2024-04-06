import mongoose from 'mongoose';
import {IRoleDoc} from './role.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ROLE} from './role.configs';
import {paginate, toJSON} from '../../utils/plugins'
import {getImageUriFromFilename} from '../../utils/stringUtil';
import { hashPassword } from '../../utils/hashUtil';
import { genCode } from '../../utils/core/genCode';
import { TABLE_USER } from '../user/user.configs';

export interface IRoleModelDoc extends IRoleDoc {}
interface IRoleModel extends IDocModel<IRoleModelDoc> {}

const roleSchema = new mongoose.Schema<IRoleModelDoc>(
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

roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

// RoleSchema.virtual('avatarUri').get(function () {
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

roleSchema.pre('save', async function (next) {
  // console.log(getNewToken({id: this._id}));
  next();
});

function preUpdate() {
  const { phone } = this.getUpdate();
  if (!!phone) {
    this.getUpdate().$set.phone = formatPhoneNumber(phone);
  }
}

roleSchema.pre('findOneAndUpdate', preUpdate);

// RoleSchema.index({CODE: 1});
roleSchema.index({phone: 1});
roleSchema.index({email: 1});
roleSchema.index({fullName: 'text'});

/**
 * @typedef Role
 */
export const RoleModel = mongoose.model<IRoleModelDoc, IRoleModel>(TABLE_ROLE, roleSchema);
