import mongoose from 'mongoose';
import { IUserDoc, UserGender } from './user.type';
import { IDocModel } from '../../utils/types/entityTypes';
import { TABLE_USER } from './user.configs';
import { paginate, toJSON } from '../../utils/plugins';

export interface IUserModelDoc extends IUserDoc { }
interface IUserModel extends IDocModel<IUserModelDoc> { }

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
      index: { unique: true, sparse: true },
    },
    email: {
      type: String,
      required: false,
      index: { unique: true, sparse: true },
    },
    fullName: {
      type: String,
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
    address: {
      type: String,
      required: false,
    },
    organizationIds: {
      type: [
        mongoose.Schema.Types.ObjectId
      ],
      default: []
    },
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
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// userSchema.virtual('avatarUri').get(function () {
//   return getImageUriFromFilename(this.avatar);
// });

userSchema.index({CODE: 1});
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ fullName: 'text' });

/**
 * @typedef User
 */
export const UserModel = mongoose.model<IUserModelDoc, IUserModel>(TABLE_USER, userSchema);
