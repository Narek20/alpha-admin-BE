import { Request, Response } from 'express'
import { Between, Brackets, getRepository, ILike } from 'typeorm'
import { getSearches } from '../utils/getFilterQueries'
import { Order } from '../entities/orders.entity'
import { Product } from '../entities/products.entity'

class CommonController {
  private static instance: CommonController

  static get(): CommonController {
    if (!CommonController.instance) {
      CommonController.instance = new CommonController()
    }

    return CommonController.instance
  }

  async searchAll(req: Request, res: Response) {
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
                        innerQb.where({ [column]: ILike(`%${searchTerm}%`) })
                      } else {
                        innerQb.orWhere({ [column]: ILike(`%${searchTerm}%`) })
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
                        innerQb.where({ [column]: ILike(`%${searchTerm}%`) })
                      } else {
                        innerQb.orWhere({ [column]: ILike(`%${searchTerm}%`) })
                      }
                    })
                  }),
                )
              }
            })
          }),
        )
        .take(10)
        .getMany()

      if (orders.length <= 10) {
        const productRepository = getRepository(Product)
        const queryBuilder = productRepository.createQueryBuilder('product')
        const columns = ['title', 'brand', 'color', 'category', 'price']

        const products = await queryBuilder
          .leftJoinAndSelect('product.category', 'category')
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
          .take(10 - orders.length)
          .getMany()

        return res.send({
          success: true,
          data: {
            orders,
            products,
          },
        })
      }

      return res.send({ success: true, data: { orders, products: [] } })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }
}

const commonController = CommonController.get()
export { commonController as CommonController }
