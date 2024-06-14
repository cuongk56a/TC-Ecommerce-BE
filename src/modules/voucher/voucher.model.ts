import mongoose from 'mongoose';
import {APPLY_FOR_TYPE, APPLY_FOR_USER_TYPE, DISCOUNT_TYPE, IVoucherDoc, VOUCHER_TYPE} from './voucher.type';
import {IDocModel} from '../../utils/types/entityTypes';
import {TABLE_VOUCHER} from './voucher.configs';
import {paginate, toJSON} from '../../utils/plugins';
import {TABLE_USER} from '../user/user.configs';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';
import {TABLE_PRODUCT} from '../product/product/product.configs';
import {appConfigs} from '../../config/config';
import moment from 'moment-timezone';
import {TABLE_CATEGORY} from '../category/category.configs';

export interface IVoucherModelDoc extends IVoucherDoc {}
interface IVoucherModel extends IDocModel<IVoucherModelDoc> {}

const voucherSchema = new mongoose.Schema<IVoucherModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    voucherType: {
      type: String,
      enum: VOUCHER_TYPE,
    },
    discountType: {
      type: String,
      enum: DISCOUNT_TYPE,
    },
    minDiscountValue: {
      type: Number,
    },
    maxDiscountValue: {
      type: Number,
    },
    totalTurn: {
      type: {
        type: Number,
      },
    },
    userMaxTurn: {
      type: Number,
    },
    applyForUser: {
      type: String,
      enum: APPLY_FOR_USER_TYPE,
    },
    applyFor: {
      type: String,
      enum: APPLY_FOR_TYPE,
    },
    applyUser: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },
    applyProduct: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },
    applyCategory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      default: [],
    },
    usage: {
      type: [
        {
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
      default: [],
    },
    startAt: {
      type: String,
      required: true,
    },
    endAt: {
      type: String,
      required: true,
    },
    startTime: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    isActive: {
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

voucherSchema.virtual('usageCount').get(function () {
  return (this.usage || []).length;
});

voucherSchema.plugin(toJSON);
voucherSchema.plugin(paginate);

voucherSchema.index({targetId: 1});
voucherSchema.index({productId: 1});

async function preSave() {
  this.$locals.wasNew = this.isNew;
  this.startTime = await moment.tz(this.startAt, appConfigs.validation.formatDate, appConfigs.timeZone).unix();
  if (!!this.endAt) {
    this.endTime = await moment.tz(this.endAt, appConfigs.validation.formatDate, appConfigs.timeZone).unix();
  }
}

async function preUpdate() {
  const {startAt, endAt} = this.getUpdate();
  if (!!startAt)
    this.getUpdate().$set.startAtTimestamp = moment
      .tz(startAt, appConfigs.validation.formatDateTime, appConfigs.timeZone)
      .unix();
  if (!!endAt)
    this.getUpdate().$set.endAtTimestamp = moment(endAt, appConfigs.validation.formatDateTime, appConfigs.timeZone).unix();
}

voucherSchema.pre('save', preSave);
voucherSchema.pre('findOneAndUpdate', preUpdate);

voucherSchema.virtual('target', {
  ref: (doc: any) => doc.targetOnModel,
  localField: 'targetId',
  foreignField: '_id',
  justOne: true,
});

voucherSchema.virtual('products', {
  ref: TABLE_PRODUCT,
  localField: 'applyProduct',
  foreignField: '_id',
  justOne: false,
});

voucherSchema.virtual('categories', {
  ref: TABLE_CATEGORY,
  localField: 'applyCategory',
  foreignField: '_id',
  justOne: false,
});

const populateArr = ({
  hasTarget,
  hasProducts,
  hasCategories,
}: {
  hasTarget: boolean;
  hasProducts: boolean;
  hasCategories: boolean;
}) => {
  let pA: any[] = [];
  return pA.concat(
    !!hasTarget
      ? {
          path: 'target',
        }
      : [],
    !!hasProducts
      ? {
          path: 'products',
        }
      : [],
    !!hasCategories
      ? {
          path: 'categories',
        }
      : [],
  );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

voucherSchema.pre('findOne', preFind);
voucherSchema.pre('find', preFind);

// async function afterSave(doc: IVoucherModelDoc, next: any) {
//   if (!!doc) {
//     next();
//   }
//   next();
// }

// voucherSchema.post('save', afterSave);

/**
 * @typedef Voucher
 */
export const VoucherModel = mongoose.model<IVoucherModelDoc, IVoucherModel>(TABLE_VOUCHER, voucherSchema);
