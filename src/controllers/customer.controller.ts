import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Order } from '../entities/orders.entity'
import { Customer } from '../entities/customer.entity'

class CustomerController {
  private static instance: CustomerController

  static get(): CustomerController {
    if (!CustomerController.instance) {
      CustomerController.instance = new CustomerController()
    }

    return CustomerController.instance
  }

  async getOne(req: Request, res: Response) {
    try {
      const fullName = req.params.fullName
      const customerRepository = getRepository(Customer)
      const orderRepository = getRepository(Order)

      const customer = await customerRepository.findOne({ where: { fullName } })
      const orders = await orderRepository.find({
        where: { fullName },
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
