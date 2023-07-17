import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { Product } from '../entities/products.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import { getImageUrls } from '../services/firbase.service'
import { getOrderQueries } from '../utils/getFilterQueries'
import { DateTimeFormatOptions } from '../types/interfaces/TimeDateOptions.interface'
import { OrderStatuses } from '../types/types/order.types'

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
      const { take = 10, skip = 0 } = req.query
      const queries = getOrderQueries(req)

      const orderRepository = getRepository(Order)
      const orders = await orderRepository.find({
        where: queries,
        skip: +skip,
        take: +take,
        order: {
          createdAt: 'DESC',
        },
      })

      const options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }

      const formattedOrders = orders.map((order) => {
        const date = new Date(order.createdAt)
        const formattedDate = date.toLocaleString('en-GB', options)

        return { ...order, formattedDate }
      })

      return res.send({ success: true, data: formattedOrders })
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

      if (!order) {
        return res
          .status(400)
          .send({ success: false, message: "Order wasn't found" })
      }

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

      const options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }

      const date = new Date(order.createdAt)
      const formattedDate = date.toLocaleString('en-GB', options)

      return res.send({
        success: true,
        data: { ...order, formattedDate, orderProducts },
      })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, phone, address, productIDs } = req.body

      const orderRepository = getRepository(Order)
      const productRepository = getRepository(Product)

      const order: Order = Object.assign(new Order(), {
        ...req.body,
      })

      let orderProducts = []

      if (!(fullName && phone && address && productIDs.length)) {
        return res.status(400).send({ message: 'Պարամետրերը բացակայում են' })
      }

      for (let i = 0; i < productIDs.length; i++) {
        const product = await productRepository.findOneOrFail({
          where: { id: productIDs[i].id },
        })

        const orderProduct = new OrderProduct()
        orderProduct.product = product
        orderProduct.quantity = productIDs[i].quantity

        orderProducts.push(orderProduct)
      }

      order.orderProducts = orderProducts
      order.status = OrderStatuses.RECEIVED

      const createdOrder = await orderRepository.save(order)

      const options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }

      const date = new Date(createdOrder.createdAt)
      const formattedDate = date.toLocaleString('en-GB', options)

      return res.send({
        success: true,
        data: { ...createdOrder, formattedDate },
      })
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

      return res.send({
        success: true,
        data: savedProduct,
        message: 'Ապրանքը հաջողությամբ թարմացված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)

      const orderToRemove = await orderRepository.findOneOrFail({
        where: { id },
      })

      if (!orderToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Ապրանքը չի գտնվել' })
      }

      await orderRepository.remove(orderToRemove)

      return res.send({ success: true, message: 'Ապրանքը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const orderController = OrderController.get()
export { orderController as OrderController }
