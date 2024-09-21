import mongoose from 'mongoose';
import {IOrderDoc, PAYMENT_METHOD_TYPE, STATUS_ORDER_TYPE} from './order.type';
import {IDocModel} from '../../utils/types/entityTypes';
import {TABLE_ORDER} from './order.configs';
import {paginate, toJSON} from '../../utils/plugins';
import {TABLE_USER} from '../user/user.configs';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';
import {TABLE_ADDRESS} from '../address/address.configs';
import {TABLE_PRODUCT} from '../product/product/product.configs';
import {createNewQueue} from '../../redis/queue';
import {OrderQueue} from './queue/OrderQueue';

export const genCODE = async function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let CODE = '';
  while (true) {
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      CODE += characters[randomIndex];
    }

    const existingDocument = await OrderModel.findOne({CODE});
    if (!existingDocument) {
      return CODE;
    }
    CODE = '';
  }
};

export interface IOrderModelDoc extends IOrderDoc, mongoose.Document {}
interface IOrderModel extends IDocModel<IOrderModelDoc> {}

const orderSchema = new mongoose.Schema<IOrderModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION,
    },
    CODE: {
      type: String,
      unique: true,
      required: true,
    },
    cart: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          qty: {
            type: Number,
            required: true,
          },
          unitPrice: {
            type: Number,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    shippingCode: {
      type: String,
    },
    shippingService: {
      type: String,
    },
    shippingFee: {
      type: Number,
    },
    ghtkId: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    voucherIds: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    totalDiscount: {
      type: Number,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: STATUS_ORDER_TYPE,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD_TYPE,
    },
    totalPayment: {
      type: Number,
      required: true,
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

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.index({CODE: 1});
orderSchema.index({targetId: 1});

orderSchema.pre('save', async function (next) {
  if (!this.CODE) {
    this.CODE = await genCODE();
  }

  this.$locals.wasNew = this.isNew;
  next();
});

orderSchema.virtual('shippingAddress', {
  ref: TABLE_ADDRESS,
  localField: 'shippingAddressId',
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

orderSchema.virtual('cart.item', {
  ref: TABLE_PRODUCT,
  localField: 'cart.productId',
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

orderSchema.virtual('createdBy', {
  ref: TABLE_USER,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

// orderSchema.virtual('vouchers', {
//   ref: TABLE_VOUCHER,
//   localField: 'voucherIds',
//   foreignField: '_id',
//   justOne: false,
//   // match: {deletedById: {$exists: false}},
// });

const populateArr = ({
  hasShippingAddress,
  hasItems,
  hasCreatedBy,
}: {
  hasShippingAddress: boolean;
  hasItems: boolean;
  hasCreatedBy: boolean;
}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasShippingAddress
        ? {
            path: 'shippingAddress',
            options: {hasLocation: true},
          }
        : [],
    )
    .concat(
      !!hasItems
        ? {
            path: 'cart.item',
          }
        : [],
    )
    .concat(
      !!hasCreatedBy
        ? {
            path: 'createdBy',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

orderSchema.pre('findOne', preFind);
orderSchema.pre('find', preFind);

function afterSave(doc: IOrderModelDoc, next: any) {
  if (!!doc) {
    doc
      .populate([
        {
          path: 'shippingAddress',
          options: {hasLocation: true},
        },
        {
          path: 'cart.item',
        },
        {
          path: 'createdBy',
        },
      ])
      .then(() => {
        const orderQueue = createNewQueue('OrderQueue');
        orderQueue
          .add({
            order: doc,
            isNew: !!doc.$locals.wasNew,
          })
          .catch(err => {
            console.error('Model:Order:afterSave Err ', err);
            next();
          })
          .then(() => {
            next();
          });
      })
      .catch((err: any) => {
        console.error('Error populating document:', err);
        next(err);
      });
  }else {
    next();
  }
}

orderSchema.post('save', afterSave);
orderSchema.post('findOneAndUpdate', afterSave);

/**
 * @typedef Order
 */
export const OrderModel = mongoose.model<IOrderModelDoc, IOrderModel>(TABLE_ORDER, orderSchema);
