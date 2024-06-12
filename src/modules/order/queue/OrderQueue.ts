import AbstractQueueProcessor from '../../../redis/queue';
import {productService} from '../../product/product/product.service';
import {IOrderModelDoc} from '../order.model';
import {orderService} from '../order.service';
import {STATUS_ORDER_TYPE} from '../order.type';

export class OrderQueue extends AbstractQueueProcessor {
  processQueue = async (job: {
    data: {
      order: IOrderModelDoc;
      isNew: boolean;
    };
    done: any;
  }) => {
    const {order, isNew} = job.data;
    const {cart} = order;
    if(isNew){
      new Promise(async (resolve: any) => {
        const checkQuantity = await Promise.all(
          cart.map((detail: any) => {
            if (!detail?.item || detail?.qty > detail?.item?.quantity) {
              return false;
            } else {
              return true;
            }
          }),
        );
        if (checkQuantity.includes(false)) {
          await orderService.updateOne({_id: order._id}, {status: STATUS_ORDER_TYPE.DRAFT});
        } else {
          await Promise.all(
            cart.map(async (detail: any) => {
              await productService.updateOne({_id: detail?.productId}, {$inc: {quantity: -detail.qty}});
            }),
          );
        }
        resolve();
      });
    }
  };
}
