import mongoose from 'mongoose';
import {IProductDoc} from './product.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import {TABLE_PRODUCT} from './product.configs';
import {paginate, toJSON} from '../../../utils/plugins'
import { TABLE_USER } from '../../user/user.configs';
import { TABLE_ORGANIZATION } from '../../organization/organization.configs';
import { TABLE_UNIT } from '../unit/unit.configs';
import { TABLE_CATEGORY } from '../../category/category.configs';
import { getImageUriFromFilename } from '../../../utils/core/stringUtil';
import { TABLE_BRAND } from '../../brand/brand.configs';
import { TABLE_ORDER } from '../../order/order.configs';

export interface IProductModelDoc extends IProductDoc {}
interface IProductModel extends IDocModel<IProductModelDoc> {}

const productSchema = new mongoose.Schema<IProductModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    barcode: {
      type: String
    },
    name: {
      type: String
    },
    thumbnail: {
      type: String
    },
    attachments: {
      type: [
        String
      ]
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    capitalPrice: {
      type: Number
    },
    salePrice: {
      type: Number
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number
    },
    weight: {
      type: Number
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true
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

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.index({targetId: 1});
productSchema.index({categoryId: 1});
productSchema.index({brandId: 1});
productSchema.index({name: 'text'});

productSchema.virtual('thumbnailUri').get( async function () {
  return await getImageUriFromFilename(this.thumbnail || '');
});

productSchema.virtual('unit', {
  ref: TABLE_UNIT,
  localField: 'unitId', 
  foreignField: '_id', 
  justOne: true,
  match: {deletedById: {$exists: false}},
});

productSchema.virtual('category', {
  ref: TABLE_CATEGORY,
  localField: 'categoryId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

productSchema.virtual('brand', {
  ref: TABLE_BRAND,
  localField: 'brandId', 
  foreignField: '_id',
  justOne: true,
  match: {deletedById: {$exists: false}},
});

productSchema.virtual('countOrder', {
  ref: TABLE_ORDER,
  localField: '_id', 
  foreignField: 'cart.productId',
  justOne: false,
  match: {deletedById: {$exists: false}},
  count: true,
});

const populateArr = ({hasUnit, hasCategory, hasBrand}: {hasUnit: boolean, hasCategory: boolean, hasBrand: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasUnit
        ? {
            path: 'unit',
          }
        : [],
    )
    .concat(
      !!hasCategory
        ? {
            path: 'category',
          }
        : [],
    )
    .concat(
      !!hasBrand
        ? {
            path: 'brand',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

productSchema.pre('findOne', preFind);
productSchema.pre('find', preFind);

/**
 * @typedef Product
 */
export const ProductModel = mongoose.model<IProductModelDoc, IProductModel>(TABLE_PRODUCT, productSchema);
