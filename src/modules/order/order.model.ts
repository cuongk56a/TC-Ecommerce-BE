import mongoose from 'mongoose';
import { IOrderDoc, PAYMENT_METHOD_TYPE, STATUS_ORDER_TYPE } from './order.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ORDER} from './order.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

export interface IOrderModelDoc extends IOrderDoc {}
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
      default: TABLE_ORGANIZATION
    },
    CODE: {
      type: String,
      unique: true,
      required: true,
    },
    cart: {
      type: [
        {
          type: {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
            qty: {
              type: Number,
              required: true
            },
            unitPrice: {
              type: Number,
              required: true
            },
            amount: {
              type: Number,
              required: true
            }
          }
        }
      ]
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
      type: [
        mongoose.Schema.Types.ObjectId,
      ],
      default: []
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
      enum: PAYMENT_METHOD_TYPE
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

/**
 * @typedef Order
 */
export const OrderModel = mongoose.model<IOrderModelDoc, IOrderModel>(TABLE_ORDER, orderSchema);
