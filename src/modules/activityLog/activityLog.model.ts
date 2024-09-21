import mongoose from 'mongoose';
import {IActivityLogDoc} from './activityLog.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ACTIVITY_LOG} from './activityLog.configs';
import {paginate, toJSON} from '../../utils/plugins';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IActivityLogModelDoc extends IActivityLogDoc {}
interface IActivityLogModel extends IDocModel<IActivityLogModelDoc> {}

const activityLogSchema = new mongoose.Schema<IActivityLogModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    userId:{
      type: Number
    },
    methodType:{
      type: String,
    },
    modelType: {
      type: String,
    },
    timeLog: {
      type: Date,
    }
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

activityLogSchema.plugin(toJSON);
activityLogSchema.plugin(paginate);

/**
 * @typedef ActivityLog
 */
export const ActivityLogModel = mongoose.model<IActivityLogModelDoc, IActivityLogModel>(TABLE_ACTIVITY_LOG, activityLogSchema);
