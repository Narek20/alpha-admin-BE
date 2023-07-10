import { NextFunction, Request, Response } from 'express'
import { Product } from '../entities/products.entity'
import { getRepository } from 'typeorm'
import { getImageUrls, uploadImage } from '../services/firbase.service'
import { getQueries } from '../utils/getFilterQueries'

class ProductController {
  private static instance: ProductController

  static get(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController()
    }

    return ProductController.instance
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { take = 10, skip = 0 } = req.query
      const queries = getQueries(req)

      const productRepository = getRepository(Product)
      const products = await productRepository.findAndCount({
        where: queries,
        take: +take,
        skip: +skip * +take,
      })

      const productsWithImages = products[0].map(async (product) => ({
        ...product,
        images: await getImageUrls(`products/${product.id}`),
      }))

      return res.send({
        success: true,
        data: await Promise.all(productsWithImages),
        pagination: {
          count: products[1],
          take,
          skip,
        },
      })
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id)
    const productRepository = getRepository(Product)
    const product = await productRepository.findOne({
      where: { id },
    })

    if (!product) {
      return res
        .status(400)
        .send({ success: false, message: "Product wasn't found" })
    }

    const productWithImages = {
      ...product,
      images: await getImageUrls(`products/${product.id}`),
    }

    return res.send({ success: true, data: productWithImages })
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, category, brand, price, purchasePrice } = req.body
      const sizes = JSON.parse(req.body.sizes)

      const productRepository = getRepository(Product)

      if (
        !(
          title &&
          category &&
          brand &&
          price &&
          purchasePrice &&
          req.files.length
        )
      ) {
        return res.status(400).send('Պարամետրերը բացակայում են')
      }

      const product: Product = Object.assign(new Product(), {
        ...req.body,
        sizes,
      })

      const savedProduct = await productRepository.save(product)

      for (let i = 0; i < +req.files.length; i++) {
        await uploadImage(
          req.files[i].buffer,
          `products/${savedProduct.id}/${i}`
        )
      }

      return res.send({
        message: 'Ապրանքները սարքված են',
        success: true,
        data: savedProduct,
      })
    } catch (err: any) {
      return res.status(500).send({ message: err.message, result: false })
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const productRepository = getRepository(Product)
      const product: Product = await productRepository.findOneOrFail({
        where: { id: +id },
      })

      const savedProduct = await productRepository.save({
        ...product,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedProduct,
        message: 'Ապրանքը փոփոխված է',
      })
    } catch (err: any) {
      return res.status(500).send({ message: err.message, result: false })
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id)
    const productRepository = getRepository(Product)
    let productToRemove = await productRepository.findOneBy({ id })

    if (!productToRemove) {
      return 'this product not exist'
    }

    await productRepository.remove(productToRemove)

    return 'product has been removed'
  }
}

const productController = ProductController.get()
export { productController as ProductController }
