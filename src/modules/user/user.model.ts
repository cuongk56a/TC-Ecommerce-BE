import mongoose from 'mongoose';
import { IUserDoc, UserGender } from './user.type';
import { IDocModel } from '../../utils/types/entityTypes';
import { TABLE_USER } from './user.configs';
import { paginate, toJSON } from '../../utils/plugins';
import { TABLE_ADDRESS } from '../address/address.configs';
import { getImageUriFromFilename } from '../../utils/core/stringUtil';
import { TABLE_ROLE } from '../role/role.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export async function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let CODE = '';

  // Lặp lại quá trình sinh code cho đến khi có một code duy nhất
  while (true) {
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      CODE += characters[randomIndex];
    }

    // Kiểm tra xem code đã tồn tại trong cơ sở dữ liệu chưa
    const existingDocument = await UserModel.findOne({CODE});
    if (!existingDocument) {
      return CODE; // Nếu không tồn tại, trả về code mới
    }

    // Nếu tồn tại, đặt lại code và lặp lại quá trình sinh
    CODE = '';
  }
}

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
      required: true,
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
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    organizationIds: {
      type: [
        mongoose.Schema.Types.ObjectId
      ],
      default: []
    },
    isAdmin: {
      type: Boolean,
      default: false,
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

userSchema.virtual('avatarUri').get(function () {
  return getImageUriFromFilename(this.avatar || '');
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.pre('save', async function (next) {
  if (!this.CODE) {
    this.CODE = await generateUniqueCode();
  }
  next();
});

userSchema.virtual('address', {
  ref: TABLE_ADDRESS,
  localField: 'addressId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

userSchema.virtual('role', {
  ref: TABLE_ROLE,
  localField: 'userIds', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

userSchema.virtual('organizations', {
  ref: TABLE_ORGANIZATION,
  localField: 'organizationIds', 
  foreignField: '_id',
  justOne: false,
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasAddress, hasRole, hasOrganization, organizationIds}: {hasAddress: boolean, hasRole: boolean, hasOrganization: boolean, organizationIds: string}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasAddress
        ? {
            path: 'address',
            options: {hasLocation: true}
          }
        : [],
    )
    .concat(
      !!hasRole && !!organizationIds
        ? {
            path: 'role',
            match: {targetId: organizationIds}
          }
        : [],
    )
    .concat(
      !!hasOrganization
        ? {
            path: 'organizations',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr({...this.getOptions(), ...this._conditions}));
  next();
}

userSchema.pre('findOne', preFind);
userSchema.pre('find', preFind);

userSchema.index({CODE: 1});
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ fullName: 'text' });

/**
 * @typedef User
 */
export const UserModel = mongoose.model<IUserModelDoc, IUserModel>(TABLE_USER, userSchema);
