import AbstractQueueProcessor from '../../../redis/queue';
import {productService} from '../../product/product/product.service';
import {userService} from '../../user/user.service';
import {IOrderModelDoc, genCODE} from '../order.model';
import {orderService} from '../order.service';
import {STATUS_ORDER_TYPE} from '../order.type';

export class OrderQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        order: IOrderModelDoc;
        isNew: boolean;
      };
    },
    done: any,
  ) => {
    const {order, isNew} = job.data;
    const {cart, createdById, shippingAddressId, shippingAddress, status} = order;
    if (isNew) {
      Promise.all([
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
        }),
        new Promise(async (resolve: any) => {
          if (!createdById) {
            const [user, CODE] = await Promise.all([userService.getOne({phone: shippingAddress?.phone}), genCODE()]);
            if (!user) {
              await userService.createOne({
                CODE,
                name: shippingAddress?.name,
                phone: shippingAddress?.phone,
                address: shippingAddressId,
              });
            }
          }
          resolve();
        }),
      ]).finally(() => {
        console.log('DONE');
        done();
      });
    } else {
      new Promise(async (resove: any) => {
        if (status == STATUS_ORDER_TYPE.CANCELLED || status == STATUS_ORDER_TYPE.REJECT) {
          await Promise.all([
            cart.map(async(detail: any) => {
              await productService.updateOne({_id: detail.productId}, {$inc: {quantity: detail.qty}})
            })
          ])
        }
      }).finally(() => {
        console.log('DONE');
        done();
      });
    }
  };
}
