import { Category } from './../entities/category.entity'
import { Request, Response } from 'express'
import { Product } from '../entities/products.entity'
import { Between, Brackets, ILike, In, MoreThan, getRepository } from 'typeorm'
import {
  getFirebaseImages,
  getImageUrls,
  removeReference,
  updateImages,
  uploadImage,
} from '../services/images.service'
import { getSearches, getProductQueries } from '../utils/getFilterQueries'

class ProductController {
  private static instance: ProductController

  static get(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController()
    }

    return ProductController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const { take = 10, skip = 0 } = req.query
      const queries = getProductQueries(req)

      const productRepository = getRepository(Product)
      const products = await productRepository.findAndCount({
        where: queries,
        take: +take,
        skip: +skip * +take,
        relations: ['orders', 'category'],
      })

      const productsWithImages = products[0].map(async (product) => ({
        ...product,
        images: await getImageUrls(product.id),
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

  async getOne(req: Request, res: Response) {
    try {
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
        images: await getImageUrls(product.id),
      }

      return res.send({ success: true, data: productWithImages })
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      let { categories, params } = req.body
      const { take = 10, skip = 0 } = req.query

      if (categories) {
        categories = categories.split(',')
      }

      const searchTerms = getSearches(params?.search)
      const productRepository = getRepository(Product)
      const queryBuilder = productRepository.createQueryBuilder('product')
      const columns = ['title', 'brand', 'color', 'category', 'price']

      const products = await queryBuilder
        .where(
          new Brackets((outerQb) => {
            searchTerms.forEach((searchTerm, index) => {
              if (index === 0) {
                outerQb.where(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (columnIndex === 0) {
                        if (column === 'price') {
                          const between = searchTerm
                            .split(',')
                            .map((num) => +num)
                          if (!between.some((num) => isNaN(num))) {
                            innerQb.where({
                              [column]: Between(between[0], between[1]),
                            })
                          }
                        } else if (
                          column === 'category' &&
                          categories?.length
                        ) {
                          innerQb.where({
                            [column]: In(categories),
                          })
                        } else {
                          innerQb.where({
                            [column]: ILike(`%${searchTerm}%`),
                          })
                        }
                      } else {
                        if (column === 'price') {
                          const between = searchTerm
                            .split(',')
                            .map((num) => +num)
                          if (!between.some((num) => isNaN(num))) {
                            innerQb.orWhere({
                              [column]: Between(between[0], between[1]),
                            })
                          }
                        } else if (
                          column === 'category' &&
                          categories?.length
                        ) {
                          innerQb.orWhere({
                            [column]: In(categories),
                          })
                        } else {
                          innerQb.orWhere({
                            [column]: ILike(`%${searchTerm}%`),
                          })
                        }
                      }
                    })
                  }),
                )
              } else {
                outerQb.andWhere(
                  new Brackets((innerQb) => {
                    columns.forEach((column, columnIndex) => {
                      if (columnIndex === 0) {
                        if (column === 'price') {
                          const between = searchTerm
                            .split(',')
                            .map((num) => +num)
                          if (!between.some((num) => isNaN(num))) {
                            innerQb.where({
                              [column]: Between(between[0], between[1]),
                            })
                          }
                        } else if (
                          column === 'category' &&
                          categories?.length
                        ) {
                          innerQb.where({
                            [column]: In(categories),
                          })
                        } else {
                          innerQb.where({
                            [column]: ILike(`%${searchTerm}%`),
                          })
                        }
                      } else {
                        if (column === 'price') {
                          const between = searchTerm
                            .split(',')
                            .map((num) => +num)
                          if (!between.some((num) => isNaN(num))) {
                            innerQb.orWhere({
                              [column]: Between(between[0], between[1]),
                            })
                          }
                        } else if (
                          column === 'category' &&
                          categories?.length
                        ) {
                          innerQb.orWhere({
                            [column]: In(categories),
                          })
                        } else {
                          innerQb.orWhere({
                            [column]: ILike(`%${searchTerm}%`),
                          })
                        }
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
        .getMany()

      const count = await queryBuilder.getCount()
      const productsWithImages = await Promise.all(
        products.map(async (product) => ({
          ...product,
          images: await getImageUrls(product.id),
        })),
      )

      return res.send({
        success: true,
        data: productsWithImages,
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

  async create(req: Request, res: Response) {
    try {
      const { title, category, brand, price, purchasePrice } = req.body
      let sizes = null
      let additionalInfo = null

      if (req.body.sizes) {
        sizes = JSON.parse(req.body.sizes)
      }

      if (req.body.additionalInfo) {
        additionalInfo = JSON.parse(req.body.additionalInfo)
      }

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
        return res.status(400).send({ message: 'Պարամետրերը բացակայում են' })
      }

      const product: Product = Object.assign(new Product(), {
        ...req.body,
        sizes,
        additionalInfo,
      })

      const savedProduct = await productRepository.save(product)

      for (let i = 0; i < +req.files.length; i++) {
        uploadImage(req.files[i].buffer, savedProduct.id)
      }

      return res.send({
        message: 'Ապրանքները սարքված են',
        success: true,
        data: { savedProduct },
      })
    } catch (err: any) {
      return res.status(500).send({ message: err.message, result: false })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const productRepository = getRepository(Product)
      const categoryRepository = getRepository(Category)
      const product: Product = await productRepository.findOneOrFail({
        where: { id: +id },
      })

      const selectedCategory = await categoryRepository.findOne({
        where: { title: req.body.category },
      })

      let sizes = product.sizes
      let additionalInfo = product.additionalInfo

      if (req.body.sizes) {
        sizes = JSON.parse(req.body.sizes)
      }

      if (req.body.additionalInfo) {
        additionalInfo = JSON.parse(req.body.additionalInfo)
      }

      additionalInfo = additionalInfo.filter(({ title }) =>
        selectedCategory.fields.find((field) => field.title === title),
      )

      const imageBuffers: ArrayBuffer[] = []

      for (let i = 0; i < +req.files.length; i++) {
        imageBuffers.push(req.files[i].buffer)
      }

      if (req.body.images || +req.files.length) {
        await updateImages(id, req.body.images, imageBuffers)
      }

      const savedProduct = await productRepository.save({
        ...product,
        ...req.body,
        sizes,
        additionalInfo,
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

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const productRepository = getRepository(Product)
      let productToRemove = await productRepository.findOneBy({ id })

      if (!productToRemove) {
        return res.send({
          success: false,
          message: 'Ապրանքը չի գտնվել',
        })
      }
      
      await removeReference(id)
      await productRepository.remove(productToRemove)

      return res.send({
        success: true,
        message: 'Ապրանքը Հեռացված է',
      })
    } catch (err) {
      return res.status(500).send({ message: err.message, result: false })
    }
  }

  async storeImagesInServer(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const productRepository = getRepository(Product)
      const products = await productRepository.find({where: {id: MoreThan(id)}})

      for(const product of products) {
        await getFirebaseImages(`${product.id}`)
      }

      return res.send({
        success: true,
        data: []
      })
    } catch (err: any) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}



const productController = ProductController.get()
export { productController as ProductController }
