import { NextFunction, Request, Response } from "express";
import { Product } from "../entities/products.entity";
import { getRepository } from "typeorm";

class ProductController {
  private static instance: ProductController;

  static get(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }

    return ProductController.instance;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const productRepository = getRepository(Product);
    const products = await productRepository.find()

    return res.send(products)
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne({
      where: { id },
    });

    if (!product) {
      return "unregistered product";
    }
    return res.send(product);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // const { firstName, lastName, age } = req.body;
    const productRepository = getRepository(Product);
    const product = Object.assign(new Product(), {
      title: 'Koshik',
      sizes: '25, 26',
      price: 500
    });

    const savedProduct = productRepository.save(product)

    return res.send(savedProduct)
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const productRepository = getRepository(Product);
    let productToRemove = await productRepository.findOneBy({ id });

    if (!productToRemove) {
      return "this product not exist";
    }

    await productRepository.remove(productToRemove);

    return "product has been removed";
  }
}

const productController = ProductController.get();
export { productController as ProductController };
