import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entities/orders.entity";
import { Product } from "../entities/products.entity";

class OrderController {
  private static instance: OrderController;

  static get(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController();
    }

    return OrderController.instance;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({ relations: ["products"] });

    return res.send(orders);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      return "unregistered order";
    }
    return res.send(order);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const orderRepository = getRepository(Order);
    const productRepository = getRepository(Product);

    const products = await productRepository.findByIds(req.body.productIDs);

    const order = new Order();
    order.products = products;

    const createdOrder = await orderRepository.save(order);

    return res.send(createdOrder);
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const orderRepository = getRepository(Order);
    let orderToRemove = await orderRepository.findOneBy({ id });

    if (!orderToRemove) {
      return "this Order not exist";
    }

    await orderRepository.remove(orderToRemove);

    return "Order has been removed";
  }
}

const orderController = OrderController.get();
export { orderController as OrderController };
