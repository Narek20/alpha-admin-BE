import { Request, Response } from 'express'
import { Brackets, ILike, In, getRepository } from 'typeorm'
import { Store } from '../entities/store.entity'
import { Product } from '../entities/products.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import { getImageUrls } from '../services/images.service'
import { getOrderQueries, getSearches } from '../utils/getFilterQueries'
import { DateTimeFormatOptions } from '../types/interfaces/TimeDateOptions.interface'
import { Customer } from '../entities/customer.entity'
// import { insertData } from '../../lol'

class StoreController {
  private static instance: StoreController

  static get(): StoreController {
    if (!StoreController.instance) {
      StoreController.instance = new StoreController()
    }

    return StoreController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const { take = 10, skip = 0 } = req.query
      const queries = getOrderQueries(req)

      const storeRepository = getRepository(Store)
      const [orders, count] = await storeRepository.findAndCount({
        where: queries,
        take: +take,
        skip: +skip * +take,
        order: {
          createdAt: 'DESC',
        },
      })

      const formattedOrders = orders.map((order) => {
        const createdAtDate = new Date(
          order.createdAt.getTime() + 24 * 1000 * 60 * 60,
        )

        const createdAt = createdAtDate.toISOString().split('T')[0]
        return { ...order, createdAt }
      })

      return res.send({
        success: true,
        data: formattedOrders,
        pagination: {
          count,
          take: +take,
          skip: +skip,
        },
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async searchOrders(req: Request, res: Response) {
    try {
      const { take = 10, skip = 0 } = req.query
      const searchTerms = getSearches(req.query?.search as string)
      const orderRepository = getRepository(Store)
      const queryBuilder = orderRepository.createQueryBuilder('order')
      const columns = [
        'id',
        'fullName',
        'phone',
        'address',
        'notes',
        'paymentMethod',
      ]

      const orders = await queryBuilder
        .where(
          new Brackets((outerQb) => {
            searchTerms.forEach((searchTerm, index) => {
              if (index === 0) {
                outerQb.where(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (column === 'id' && isNaN(+searchTerm)) {
                        return
                      }

                      if (columnIndex === 0) {
                        innerQb.where({
                          [column]:
                            column === 'id'
                              ? +searchTerm
                              : ILike(`%${searchTerm}%`),
                        })
                      } else {
                        innerQb.orWhere({
                          [column]:
                            column === 'id'
                              ? +searchTerm
                              : ILike(`%${searchTerm}%`),
                        })
                      }
                    })
                  }),
                )
              } else {
                outerQb.andWhere(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (column === 'id' && isNaN(+searchTerm)) {
                        return
                      }

                      if (columnIndex === 0) {
                        innerQb.where({
                          [column]:
                            column === 'id'
                              ? +searchTerm
                              : ILike(`%${searchTerm}%`),
                        })
                      } else {
                        innerQb.orWhere({
                          [column]:
                            column === 'id'
                              ? +searchTerm
                              : ILike(`%${searchTerm}%`),
                        })
                      }
                    })
                  }),
                )
              }
            })
          }),
        )
        .orderBy({ id: 'DESC' })
        .take(+take)
        .skip(+skip * +take)
        .getMany()

      const count = await queryBuilder.getCount()

      const formattedOrders = orders.map((order) => {
        const createdAtDate = new Date(order.createdAt.getTime())

        const createdAt = createdAtDate.toISOString().split('T')[0]
        return { ...order, createdAt }
      })

      return res.send({
        success: true,
        data: formattedOrders,
        pagination: {
          count,
          take: +take,
          skip: +skip,
        },
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const orderRepository = getRepository(Store)
      const order = await orderRepository
        .createQueryBuilder('store')
        .leftJoin('store.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .select([
          'store',
          'product',
          'orderProduct.id',
          'orderProduct.quantity',
          'orderProduct.size',
          'category',
        ])
        .where('store.id = :id', { id })
        .getOne()

      if (!order) {
        return res
          .status(400)
          .send({ success: false, message: "Order wasn't found" })
      }

      let orderProducts = []

      for (let i = 0; i < order.orderProducts.length; i++) {
        const productImages = await getImageUrls(
          order.orderProducts[i].product.id,
        )

        orderProducts.push({
          id: order.orderProducts[i].id,
          quantity: order.orderProducts[i].quantity,
          size: order.orderProducts[i].size,
          product: { ...order.orderProducts[i].product, images: productImages },
        })
      }

      const createdAtDate = new Date(order.createdAt.getTime())

      const createdAt = createdAtDate.toISOString().split('T')[0]

      return res.send({
        success: true,
        data: { ...order, createdAt, orderProducts },
      })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      let { fullName, phone, address, usedCashback, productIDs } = req.body

      const orderRepository = getRepository(Store)
      const productRepository = getRepository(Product)
      const customerRepository = getRepository(Customer)

      const order: Store = Object.assign(new Store(), {
        ...req.body,
      })

      let totalPrice = 0
      let orderProducts = []

      for (let i = 0; i < productIDs.length; i++) {
        const product = await productRepository.findOneOrFail({
          where: { id: productIDs[i].id },
        })

        // const updatedSizes = product.sizes.map(({ size, smSize, quantity }) =>
        //   size === productIDs[i].size
        //     ? { size, smSize, quantity: quantity - productIDs[i].quantity }
        //     : { size, smSize, quantity },
        // )

        // await productRepository.save({ ...product, sizes: updatedSizes })

        const orderProduct = new OrderProduct()
        orderProduct.product = product
        orderProduct.quantity = productIDs[i].quantity
        orderProduct.size = productIDs[i].size
        orderProduct.orderId = order.id
        orderProduct.productId = product.id

        totalPrice += product.price * productIDs[i].quantity

        orderProducts.push(orderProduct)
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

          const savedCustomer = await customerRepository.save(customer)

          order.customer = savedCustomer
        } else {
          order.customer = customer

          if (usedCashback && customer.cashback) {
            const cashbackMoney = Math.floor(
              ((totalPrice - usedCashback) * customer.cashback) / 100,
            )

            customer.cashback_money = customer.cashback_money
              ? customer.cashback_money - usedCashback + cashbackMoney
              : cashbackMoney

            await customerRepository.save(customer)

            order.cashback = cashbackMoney
          } else if (customer.cashback) {
            const cashbackMoney = Math.floor(
              (totalPrice * customer.cashback) / 100,
            )

            customer.cashback_money = customer.cashback_money
              ? customer.cashback_money + cashbackMoney
              : cashbackMoney

            await customerRepository.save(customer)

            order.cashback = cashbackMoney
          }
        }
      }

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

      const { id, notes } = createdOrder

      const sheetsData = [
        id,
        fullName,
        phone,
        address,
        notes,
        totalPrice + '֏',
        createdAt,
        createdOrder.orderProducts
          .map(
            ({ product, quantity, size }) =>
              `${product.title}(${size}, ${quantity})`,
          )
          .join(', '),
      ]

      // await insertData([sheetsData])

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
      const orderRepository = getRepository(Store)
      const orderProductRepository = getRepository(OrderProduct)
      const customerRepository = getRepository(Customer)
      const order = await orderRepository.findOneOrFail({
        where: { id },
        relations: {
          orderProducts: {
            product: true,
          },
        },
      })

      if (fullName && phone) {
        const customer = await customerRepository.findOne({
          where: { fullName: order.fullName, phone: order.phone },
        })

        customer.phone = phone
        customer.fullName = fullName

        await customerRepository.save(customer)
      }

      const savedOrder = await orderRepository.save({
        ...order,
        ...req.body,
        status,
        createdAt: req.body.createdAt
          ? new Date(req.body.createdAt)
          : order.createdAt,
        orderProducts: order.orderProducts,
      })

      const createdAtDate = new Date(savedOrder.createdAt.getTime())

      const createdAt = createdAtDate.toISOString().split('T')[0]

      if (req.body.orderProducts) {
        let totalPrice = 0
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

                totalPrice += orderProduct.product.price * orderProduct.quantity
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

        if (totalPrice) {
          const customer = await customerRepository.findOne({
            where: { fullName: order.fullName, phone: order.phone },
          })

          if (customer.cashback) {
            const cashbackMoney = Math.floor(
              (totalPrice * customer.cashback) / 100,
            )

            customer.cashback_money = customer.cashback_money
              ? customer.cashback_money + cashbackMoney
              : cashbackMoney

            await customerRepository.save(customer)

            order.cashback = cashbackMoney

            await orderRepository.save(order)
          }
        }

        return res.send({
          success: true,
          data: { ...savedOrder, orderProducts, createdAt },
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
      const orderRepository = getRepository(Store)
      const customerRepository = getRepository(Customer)

      const orderToRemove = await orderRepository
        .createQueryBuilder('store')
        .leftJoin('store.orderProducts', 'orderProduct')
        .leftJoinAndSelect('orderProduct.product', 'product')
        .select([
          'store',
          'product',
          'orderProduct.id',
          'orderProduct.quantity',
          'orderProduct.size',
          'category',
        ])
        .where('store.id = :id', { id })
        .getOne()

      if (!orderToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Ապրանքը չի գտնվել' })
      }
      const customer = await customerRepository.findOne({
        where: { fullName: orderToRemove.fullName, phone: orderToRemove.phone },
      })

      if (
        customer.cashback &&
        customer.cashback_money &&
        orderToRemove.cashback
      ) {
        customer.cashback_money -= orderToRemove.cashback

        await customerRepository.save(customer)
      }

      await orderRepository.remove(orderToRemove)

      return res.send({ success: true, message: 'Ապրանքը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const storeController = StoreController.get()
export { storeController as StoreController }
