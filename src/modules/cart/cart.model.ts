import mongoose from 'mongoose';
import {ICartDoc} from './cart.type';
import {IDocModel} from '../../utils/types/entityTypes';
import {TABLE_CART} from './cart.configs';
import {paginate, toJSON} from '../../utils/plugins';
import {TABLE_USER} from '../user/user.configs';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';
import {TABLE_PRODUCT} from '../product/product/product.configs';
import {cartService} from './cart.service';

export interface ICartModelDoc extends ICartDoc {}
interface ICartModel extends IDocModel<ICartModelDoc> {}

const cartSchema = new mongoose.Schema<ICartModelDoc>(
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
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          qty: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
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
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

cartSchema.index({targetId: 1});
cartSchema.index({productId: 1});

cartSchema.virtual('target', {
  ref: (doc: any) => doc.targetOnModel,
  localField: 'targetId',
  foreignField: '_id',
  justOne: true,
});

cartSchema.virtual('items.product', {
  ref: TABLE_PRODUCT,
  localField: 'items.productId',
  foreignField: '_id',
  justOne: true,
  match: {deletedAt: {$exists: false}},
});

const populateArr = ({hasTarget, hasProduct}: {hasTarget: boolean; hasProduct: boolean}) => {
  let pA: any[] = [];
  return pA.concat(
    !!hasTarget
      ? {
          path: 'target',
        }
      : [],
    !!hasProduct
      ? {
          path: 'items.product',
        }
      : [],
  );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

cartSchema.pre('findOne', preFind);
cartSchema.pre('find', preFind);

async function afterSave(doc: ICartModelDoc, next: any) {
  if (!!doc && (!doc.deletedAt || !doc.deletedById)) {
    if (!!doc.items && doc.items.length == 0) {
      const now = new Date();
      await cartService.updateOne({
        _id: doc._id
      }, {deletedAt: now, deletedById: doc?.updatedById});
      next();
    }
    next();
  }
  next();
}

cartSchema.post('findOneAndUpdate', afterSave);

/**
 * @typedef Cart
 */
export const CartModel = mongoose.model<ICartModelDoc, ICartModel>(TABLE_CART, cartSchema);
