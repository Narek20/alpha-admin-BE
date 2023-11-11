import { Request, Response } from 'express'
import { Brackets, ILike, getRepository } from 'typeorm'
import { Customer } from '../entities/customer.entity'
import { Order } from '../entities/orders.entity'
import { getImageUrls } from '../services/images.service'
import { getSearches } from '../utils/getFilterQueries'

class CustomerController {
  private static instance: CustomerController

  static get(): CustomerController {
    if (!CustomerController.instance) {
      CustomerController.instance = new CustomerController()
    }

    return CustomerController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const customerRepository = getRepository(Customer)
      const customers = await customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.orders', 'order')
        .leftJoinAndSelect('order.orderProducts', 'order_product')
        .leftJoinAndSelect('order_product.product', 'product')
        .getMany()

      const formattedCustomers = customers.map((customer) => {
        let totalPrice = 0
        let totalQty = 0

        customer.orders.forEach((order) => {
          order.orderProducts.forEach((orderProduct) => {
            totalPrice += orderProduct.product.price * orderProduct.quantity
            totalQty += orderProduct.quantity
          })
        })

        return {
          id: customer.id,
          fullName: customer.fullName,
          phone: customer.phone,
          totalPrice,
          totalQty,
        }
      })

      return res.send({
        success: true,
        data: formattedCustomers,
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { take = 10, skip = 0 } = req.query
      const searchTerms = getSearches(req.query?.search as string)
      const customerRepository = getRepository(Customer)
      const queryBuilder = customerRepository.createQueryBuilder('customer')
      const columns = ['fullName', 'phone']
      const customers = await queryBuilder
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
        .take(+take)
        .skip(+skip * +take)
        .leftJoinAndSelect('customer.orders', 'order')
        .leftJoinAndSelect('order.orderProducts', 'order_product')
        .leftJoinAndSelect('order_product.product', 'product')
        .getMany()

      const count = await queryBuilder.getCount()

      const formattedCustomers = customers.map((customer) => {
        let totalPrice = 0
        let totalQty = 0

        customer.orders.forEach((order) => {
          order.orderProducts.forEach((orderProduct) => {
            totalPrice += orderProduct.product.price * orderProduct.quantity
            totalQty += orderProduct.quantity
          })
        })

        return {
          id: customer.id,
          fullName: customer.fullName,
          phone: customer.phone,
          totalPrice,
          totalQty,
        }
      })

      return res.send({
        success: true,
        data: formattedCustomers,
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
      const phone = req.params.phone
      const customerRepository = getRepository(Customer)

      const customer = await customerRepository
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.orders', 'order')
        .leftJoinAndSelect('order.orderProducts', 'order_product')
        .leftJoinAndSelect('order_product.product', 'product')
        .where({ phone: phone })
        .getOne()

      let totalPrice = 0
      let totalQty = 0

      const orders: Order[] = []

      for (const order of customer.orders) {
        const orderProducts = []
        for (const orderProduct of order.orderProducts) {
          totalPrice += orderProduct.product.price * orderProduct.quantity
          totalQty += orderProduct.quantity

          orderProducts.push({
            ...orderProduct,
            product: {
              ...orderProduct.product,
              images: await getImageUrls(orderProduct.product.id),
            },
          })
        }
        orders.push({ ...order, orderProducts })
      }

      customer.orders = orders

      const formattedOrders = customer.orders.map((order) => {
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

      return res.send({
        success: true,
        data: { ...customer, orders: formattedOrders, totalPrice, totalQty },
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { fullName, phone } = req.body

      const customerRepository = getRepository(Customer)
      const orderRepository = getRepository(Order)

      const customer = await customerRepository.findOneOrFail({
        where: { id },
      })

      const orders = await orderRepository.find({
        where: { phone: customer.phone, fullName: customer.fullName },
      })

      for (const order of orders) {
        order.fullName = fullName
        order.phone = phone

        await orderRepository.save(order)
      }

      const savedCustomer = await customerRepository.save({
        ...customer,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedCustomer,
        message: 'Տվյալները պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getAddress(req: Request, res: Response) {
    try {
      const { phone, fullName } = req.params

      const customerRepository = getRepository(Customer)

      const customer = await customerRepository.findOneOrFail({
        where: { phone, fullName },
      })

      if (!customer) {
        return res
          .status(400)
          .send({ success: false, message: 'Հաճախորդը չի գտնվել' })
      }

      return res.send({
        success: true,
        data: customer,
        message: 'Տվյալները պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)

      const customerRepository = getRepository(Customer)

      const customer = await customerRepository.findOneOrFail({
        where: { id },
      })

      if (!customer) {
        return res
          .status(400)
          .send({ success: false, message: 'Հաճախորդը չի գտնվել' })
      }

      await customerRepository.remove(customer)

      return res.send({
        success: true,
        data: customer,
        message: 'Հաճախորդը հեռացված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }
}

const customerController = CustomerController.get()
export { customerController as CustomerController }
