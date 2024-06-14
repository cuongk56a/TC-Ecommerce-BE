import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';
import { IAddressModelDoc } from '../address/address.model';
import { IUserModelDoc } from '../user/user.model';

export enum STATUS_ORDER_TYPE {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  INPROGESS = 'INPROGESS',
  READY_TO_DELIVERY = 'READY_TO_DELIVERY',
  COMPLETED = 'COMPLETED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECT = 'REJECT',
  REFUND = 'REFUND',
  ACCEPTED_REFUND = 'ACCETED_REFUND',
  DRAFT = 'DRAFT',
}

export const OrderStatusObj = {
  PENDING: 'Đã đặt hàng',
  ACCEPTED: 'Đã Nhận đơn',
  INPROGESS: 'Đang xử lý',
  READY_TO_DELIVERY: 'Chờ vận chuyển',
  COMPLETED: 'Hoàn thành',
  SHIPPING: 'Đang vận chuyển',
  DELIVERED: 'Đã chuyển hàng',
  CANCELLED: 'Đã hủy',
  REJECT: 'Đã từ chối',
  REFUND : 'Đơn hoàn',
  ACCEPTED_REFUND: 'Hoàn thành công',
  DRAFT: 'Đơn nháp',
};

export enum PAYMENT_METHOD_TYPE {
  COD = 'COD',
  ZALOPAY = 'ZALOPAY',
  MOMO = 'MOMO',
  BANK = 'BANK'
}

export type CartItem = {
  productId: mongoose.Schema.Types.ObjectId;
  name: string;
  qty: number;
  unitPrice: number;
  amount: number;
} 

export interface IOrderDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  CODE: string;
  cart: CartItem[];
  shippingAddressId: mongoose.Schema.Types.ObjectId;
  shippingAddress?: IAddressModelDoc;
  shippingCode?: string; //For ghtk: none or xteam
  shippingService?: string;
  shippingFee?: number;
  ghtkId?: string;
  total: number;
  voucherIds?: mongoose.Schema.Types.ObjectId[];
  totalDiscount: number;
  note?: string;
  status: STATUS_ORDER_TYPE;
  paymentMethod: PAYMENT_METHOD_TYPE;
  totalPayment: number;
  createdBy?: IUserModelDoc;
}
