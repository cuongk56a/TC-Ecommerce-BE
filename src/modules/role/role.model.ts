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
    isActice: {
      type: Boolean,
      default: true,
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

roleSchema.index({name: 'text'});

/**
 * @typedef Role
 */
export const RoleModel = mongoose.model<IRoleModelDoc, IRoleModel>(TABLE_ROLE, roleSchema);
