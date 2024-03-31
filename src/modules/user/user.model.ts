import mongoose from 'mongoose';
import {IUserDoc, UserGender} from './user.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_USER} from './user.configs';
import {paginate, toJSON} from '../../utils/plugins'
import {getImageUriFromFilename} from '../../utils/stringUtil';
import { hashPassword } from '../../utils/hashUtil';
import { genCode } from '../../utils/core/genCode';

export interface IUserModelDoc extends IUserDoc {}
interface IUserModel extends IDocModel<IUserModelDoc> {}

const userSchema = new mongoose.Schema<IUserModelDoc>(
  {
    CODE: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: false,
      index: {unique: true, sparse: true},
    },
    email: {
      type: String,
      required: false,
      index: {unique: true, sparse: true},
    },
    fullName: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: false,
      private: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: UserGender,
    },
    country: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    // organizationId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: TABLE_ORGANIZATION,
    // },
    // các giáo viên quản trị
    importCode: {
      type: String,
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

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// userSchema.virtual('avatarUri').get(function () {
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

userSchema.pre('save', async function (next) {
  // if (!this.CODE) {
  //   // Sinh code mới nếu chưa có
  //   this.CODE = await generateUniqueCode();
  // }

  if (!this.hashedPassword) {
    this.hashedPassword = await hashPassword('12345679');
  }

  if(!!this.phone) {
    this.phone = await formatPhoneNumber(this.phone)
  }
  // console.log(getNewToken({id: this._id}));
  next();
});

function preUpdate() {
  const { phone } = this.getUpdate();
  if (!!phone) {
    this.getUpdate().$set.phone = formatPhoneNumber(phone);
  }
}

userSchema.pre('findOneAndUpdate', preUpdate);

// userSchema.index({CODE: 1});
userSchema.index({phone: 1});
userSchema.index({email: 1});
userSchema.index({fullName: 'text'});

/**
 * @typedef user
 */
export const UserModel = mongoose.model<IUserModelDoc, IUserModel>(TABLE_USER, userSchema);
