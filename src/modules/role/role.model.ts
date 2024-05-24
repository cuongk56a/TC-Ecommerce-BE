import mongoose from 'mongoose';
import {IRoleDoc} from './role.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ROLE} from './role.configs';
import {paginate, toJSON} from '../../utils/plugins'
import {getImageUriFromFilename} from '../../utils/stringUtil';
import { hashPassword } from '../../utils/hashUtil';
import { genCode } from '../../utils/core/genCode';
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IRoleModelDoc extends IRoleDoc {}
interface IRoleModel extends IDocModel<IRoleModelDoc> {}

const roleSchema = new mongoose.Schema<IRoleModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOneModel',
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
    permissions: {
      type: [String],
      default: []
    },
    userIds: {
      type: [mongoose.Schema.Types.ObjectId],
      default: []
    },
    isActice: {
      type: Boolean,
      default: true,
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

roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

roleSchema.index({name: 'text'});

roleSchema.virtual('users', {
  ref: TABLE_USER,
  localField: 'userIds', // Find people or organizations where `localField`
  foreignField: '_id', // is equal to `foreignField`
  justOne: false, // and return only one
  match: {deletedById: {$exists: false}},
});

const populateArr = ({hasUser}: {hasUser: boolean;}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasUser
        ? {
            path: 'users',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

roleSchema.pre('findOne', preFind);
roleSchema.pre('find', preFind);

/**
 * @typedef Role
 */
export const RoleModel = mongoose.model<IRoleModelDoc, IRoleModel>(TABLE_ROLE, roleSchema);
