import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Customer } from '../entities/customer.entity'

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

  async getOne(req: Request, res: Response) {
    try {
      const phone = req.params.phone
      const customerRepository = getRepository(Customer)

      const customer = await customerRepository.findOne({
        where: { phone },
        relations: ['orders'],
      })

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
        data: { ...customer, orders: formattedOrders },
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }
}

const customerController = CustomerController.get()
export { customerController as CustomerController }
