import { Request, Response } from 'express'
import { Brackets, Like, getRepository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { Driver } from '../entities/driver.entity'
import { Product } from '../entities/products.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import { getImageUrls } from '../services/firbase.service'
import { getOrderQueries, getSearches } from '../utils/getFilterQueries'
import { DriverStatus } from '../types/types/driver.types'
import { OrderStatuses } from '../types/types/order.types'
import { DateTimeFormatOptions } from '../types/interfaces/TimeDateOptions.interface'
import { Customer } from '../entities/customer.entity'

class OrderController {
  private static instance: OrderController

  static get(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController()
    }

    return OrderController.instance
  }

  async getAll(req: Request, res: Response) {
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

      const formattedOrders = orders.map((order) => {
        let deliveryDate: string | Date = order.deliveryDate
        if (deliveryDate) {
          const deliveryNewDate = new Date(
            order.deliveryDate.getTime() + 24 * 1000 * 60 * 60,
          )

          deliveryDate = deliveryNewDate.toISOString().split('T')[0]
        }

        const createdAtDate = new Date(
          order.createdAt.getTime() + 24 * 1000 * 60 * 60,
        )

        const createdAt = createdAtDate.toISOString().split('T')[0]
        return { ...order, createdAt, deliveryDate }
      })

      return res.send({ success: true, data: formattedOrders })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async searchOrders(req: Request, res: Response) {
    try {
      const searchTerms = getSearches(req)
      const orderRepository = getRepository(Order)
      const queryBuilder = orderRepository.createQueryBuilder('order')
      const order = await orderRepository.find()
      const columns = Object.keys(order[0]).slice(1)

      const orders = await queryBuilder
        .where(
          new Brackets((outerQb) => {
            searchTerms.forEach((searchTerm, index) => {
              if (index === 0) {
                outerQb.where(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (
                        column === 'isSpecial' ||
                        column === 'createdAt' ||
                        column === 'updatedAt' ||
                        column === 'deliveryDate'
                      ) {
                        return
                      }

                      if (columnIndex === 0) {
                        innerQb.where({ [column]: Like(`%${searchTerm}%`) })
                      } else {
                        innerQb.orWhere({ [column]: Like(`%${searchTerm}%`) })
                      }
                    })
                  }),
                )
              } else {
                outerQb.andWhere(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (
                        column === 'isSpecial' ||
                        column === 'createdAt' ||
                        column === 'updatedAt' ||
                        column === 'deliveryDate'
                      ) {
                        return
                      }

                      if (columnIndex === 0) {
                        innerQb.where({ [column]: Like(`%${searchTerm}%`) })
                      } else {
                        innerQb.orWhere({ [column]: Like(`%${searchTerm}%`) })
                      }
                    })
                  }),
                )
              }
            })
          }),
        )
        .getMany()

      const formattedOrders = orders.map((order) => {
        let deliveryDate: string | Date = order.deliveryDate
        if (deliveryDate) {
          const deliveryNewDate = new Date(order.deliveryDate.getTime())

          deliveryDate = deliveryNewDate.toISOString().split('T')[0]
        }

        const createdAtDate = new Date(order.createdAt.getTime())

        const createdAt = createdAtDate.toISOString().split('T')[0]
        return { ...order, createdAt, deliveryDate }
      })

      return res.send({ success: true, data: formattedOrders })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)
      const order = await orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .select([
          'order',
          'product',
          'orderProduct.id',
          'orderProduct.quantity',
          'orderProduct.size',
          'category',
        ])
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
          `products/${order.orderProducts[i].product.id}`,
        )

        orderProducts.push({
          id: order.orderProducts[i].id,
          quantity: order.orderProducts[i].quantity,
          size: order.orderProducts[i].size,
          product: { ...order.orderProducts[i].product, images: productImages },
        })
      }

      let deliveryDate: string | Date = order.deliveryDate
      if (deliveryDate) {
        const deliveryNewDate = new Date(order.deliveryDate.getTime())

        deliveryDate = deliveryNewDate.toISOString().split('T')[0]
      }

      const createdAtDate = new Date(order.createdAt.getTime())

      const createdAt = createdAtDate.toISOString().split('T')[0]

      return res.send({
        success: true,
        data: { ...order, createdAt, deliveryDate, orderProducts },
      })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      let { fullName, deliveryDate, phone, driver, address, productIDs } =
        req.body

      const orderRepository = getRepository(Order)
      const driverRepository = getRepository(Driver)
      const productRepository = getRepository(Product)
      const customerRepository = getRepository(Customer)

      const order: Order = Object.assign(new Order(), {
        ...req.body,
      })

      let totalPrice = 0
      let orderProducts = []

      for (let i = 0; i < productIDs.length; i++) {
        const product = await productRepository.findOneOrFail({
          where: { id: productIDs[i].id },
        })

        const orderProduct = new OrderProduct()
        orderProduct.product = product
        orderProduct.quantity = productIDs[i].quantity
        orderProduct.size = productIDs[i].size
        orderProduct.orderId = order.id
        orderProduct.productId = product.id

        totalPrice += product.price

        orderProducts.push(orderProduct)
      }

      if (deliveryDate) {
        deliveryDate = +new Date(deliveryDate)
      } else {
        deliveryDate = order.createdAt
      }

      order.orderProducts = orderProducts

      if (fullName && phone) {
        const customer = await customerRepository.findOne({
          where: { phone, fullName },
        })

        if (!customer) {
          const customer: Customer = Object.assign(new Customer(), {
            fullName,
            phone,
          })

          customer.address = order.address
          customer.address2 = order.address2

          const savedCustomer = await customerRepository.save(customer)

          order.customer = savedCustomer
        } else {
          order.customer = customer

          if (customer.cashback) {
            const cashbackMoney = (totalPrice * customer.cashback) / 100
            
            customer.cashback_money = customer.cashback_money
              ? customer.cashback_money + cashbackMoney
              : cashbackMoney

            await customerRepository.save(customer)
          }
        }
      }

      if (driver) {
        const orderDriver = await driverRepository.findOne({
          where: { fullName: driver },
        })

        if (!orderDriver) {
          return res.status(400).send({ message: 'Առաքիչը բացակայում է' })
        }

        await driverRepository.save(orderDriver)
      }

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
      const createdAt = date.toLocaleString('en-GB', options)

      return res.send({
        success: true,
        data: { ...createdOrder, createdAt },
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      let { status, fullName, phone } = req.body
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Order)
      const driverRepository = getRepository(Driver)
      const orderProductRepository = getRepository(OrderProduct)
      const customerRepository = getRepository(Customer)
      const order = await orderRepository.findOneOrFail({
        where: { id },
      })

      if (fullName && phone) {
        const customer = await customerRepository.findOne({
          where: { fullName: order.fullName, phone: order.phone },
        })

        customer.phone = phone
        customer.fullName = fullName

        await customerRepository.save(customer)
      }

      if (status && order.driver && status === OrderStatuses.COMPLETED) {
        const driver = await driverRepository.findOne({
          where: {
            fullName: order.driver,
          },
        })
        order.driver = null

        await driverRepository.save(driver)
      }

      let deliveryDate: Date | string
      if (req.body.deliveryDate?.includes('/')) {
        const [day, month, year] = req.body.deliveryDate.split('/')
        deliveryDate = new Date(`${month}/${day}/${year}`)
      } else {
        deliveryDate = new Date(req.body.deliveryDate)
      }

      const savedOrder = await orderRepository.save({
        ...order,
        ...req.body,
        status,
        createdAt: req.body.createdAt
          ? new Date(req.body.createdAt)
          : order.createdAt,
        deliveryDate: req.body.deliveryDate ? deliveryDate : order.deliveryDate,
        orderProducts: order.orderProducts,
      })

      if (deliveryDate) {
        const deliveryNewDate = new Date(savedOrder.deliveryDate.getTime())

        deliveryDate = deliveryNewDate.toISOString().split('T')[0]
      }

      const createdAtDate = new Date(savedOrder.createdAt.getTime())

      const createdAt = createdAtDate.toISOString().split('T')[0]

      if (req.body.orderProducts) {
        const orderProducts: OrderProduct[] = []

        await Promise.all(
          req.body.orderProducts?.map(async (orderProduct: OrderProduct) => {
            try {
              const data: Partial<OrderProduct> = {
                orderId: order.id,
                productId: orderProduct.product.id,
                quantity: orderProduct.quantity,
                size: orderProduct.size,
              }

              if (orderProduct.id) {
                data.id = orderProduct.id
              }

              await orderProductRepository.save(data)

              if (!data.id) {
                data.id = (
                  await orderProductRepository.findOne({ where: data })
                ).id
              }

              const savedOrderProduct = {
                ...orderProduct,
                id: data.id,
              }

              orderProducts.unshift(savedOrderProduct)
            } catch (error) {
              throw error
            }
          }),
        )

        const orderProductList = await orderProductRepository.find({
          where: { orderId: order.id },
        })

        await Promise.all(
          orderProductList.map(
            async (el) =>
              !orderProducts.some((oP) => oP.id === el.id) &&
              (await orderProductRepository.delete({ id: el.id })),
          ),
        )

        return res.send({
          success: true,
          data: { ...savedOrder, orderProducts, createdAt, deliveryDate },
          message: 'Պատվերը հաջողությամբ թարմացված է',
        })
      }

      return res.send({
        success: true,
        data: savedOrder,
        message: 'Պատվերը հաջողությամբ թարմացված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
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
