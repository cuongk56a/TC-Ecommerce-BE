import mongoose from 'mongoose';
import {IRateDoc} from './rate.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_RATE} from './rate.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { TABLE_PRODUCT } from '../product/product/product.configs';
import { productService } from '../product/product/product.service';
import { notificationService } from '../notification/notification.service';
import { NOTIFICATION_FOR, NOTIFICATION_TYPE, titleObj } from '../notification/notification.type';

export interface IRateModelDoc extends IRateDoc {}
interface IRateModel extends IDocModel<IRateModelDoc> {}

const rateSchema = new mongoose.Schema<IRateModelDoc>(
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
  
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    star: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
    },
    attachments: {
      type: [
        String
      ],
      default: []
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

rateSchema.plugin(toJSON);
rateSchema.plugin(paginate);

rateSchema.index({targetId: 1});
rateSchema.index({productId: 1});

rateSchema.virtual('product', {
  ref: TABLE_PRODUCT,
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

const populateArr = ({hasProduct}: {hasProduct: boolean;}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasProduct
        ? {
            path: 'product',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

rateSchema.pre('findOne', preFind);
rateSchema.pre('find', preFind);

async function afterSave(doc: IRateModelDoc, next: any){
  if(!!doc){
    await Promise.all([
      new Promise(async ()=> {
        const product = await productService.getOne({_id: doc.productId});

      if (!!product) {
        const newStar = (product.star + doc.star) / 2;
        await productService.updateOne(
          {
            _id: doc.productId,
          },
          {
            star: newStar,
          }
        );
      }
      }),
      new Promise(async ()=> {
        await notificationService.createOne({
          targetId: doc.targetId,
          notiType: NOTIFICATION_TYPE.RATE,
          title: titleObj[NOTIFICATION_TYPE.RATE],
          content: 'Đánh giá sản phẩm' + doc?.product?.name,
          entityId: doc.productId,
          notiFor: NOTIFICATION_FOR.ADMIN,
        });
      })
      
    ])
    next();
  }
  next();
}

rateSchema.post('save', afterSave);

/**
 * @typedef Rate
 */
export const RateModel = mongoose.model<IRateModelDoc, IRateModel>(TABLE_RATE, rateSchema);
