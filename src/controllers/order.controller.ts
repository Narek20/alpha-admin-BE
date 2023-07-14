import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { Product } from '../entities/products.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import { getImageUrls } from '../services/firbase.service'

class OrderController {
  private static instance: OrderController

  static get(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController()
    }

    return OrderController.instance
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = getRepository(Order)
      const orders = await orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .select(['order', 'product', 'orderProduct.quantity'])
        .getMany()

      return res.send({ success: true, data: orders })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)
      const order = await orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .select(['order', 'product', 'orderProduct.quantity'])
        .where('order.id = :id', { id })
        .getOne()

      let orderProducts = []

      for (let i = 0; i < order.orderProducts.length; i++) {
        const productImages = await getImageUrls(
          `products/${order.orderProducts[i].product.id}`
        )

        orderProducts.push({
          quantity: order.orderProducts[0].quantity,
          product: { ...order.orderProducts[i].product, images: productImages },
        })
      }

      if (!order) {
        return res
          .status(400)
          .send({ success: false, message: "Order wasn't found" })
      }

      return res.send({ success: true, data: { ...order, orderProducts } })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { productIDs } = req.body
      const orderRepository = getRepository(Order)
      const productRepository = getRepository(Product)

      const order: Order = Object.assign(new Order(), {
        ...req.body,
      })

      let orderProducts = []

      for (const { productId, quantity } of productIDs) {
        const product = await productRepository.findOneOrFail({
          where: { id: productId },
        })

        const orderProduct = new OrderProduct();
        orderProduct.product = product;
        orderProduct.quantity = quantity;
  
        orderProducts.push(orderProduct);
      }


      order.orderProducts = orderProducts

      const createdOrder = await orderRepository.save(order)

      return res.send({ success: false, data: createdOrder })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)

      const order = await orderRepository.findOneOrFail({
        where: { id },
      })

      const savedProduct = await orderRepository.save({
        ...order,
        ...req.body,
      })

      return res.send({ success: false, data: savedProduct })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)

      const orderToRemove = await orderRepository.findOneBy({ id })

      if (!orderToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Ապրանքը չի գտնվել' })
      }

      await orderRepository.remove(orderToRemove)

      return res
        .status(500)
        .send({ success: true, message: 'Ապրանքը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const orderController = OrderController.get()
export { orderController as OrderController }
