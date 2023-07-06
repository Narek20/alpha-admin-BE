import { Request } from 'express'
import { Like, Between, FindOptionsWhere } from 'typeorm'
import { Product } from '../entities/products.entity'

export const getQueries = (
  req: Request
): FindOptionsWhere<Product> | FindOptionsWhere<Product>[] => {
  const filterKeys = Object.keys(req.query)

  const filter = filterKeys.reduce((acc, key) => {
    if (key === 'title') {
      return { ...acc, [key]: Like(`%${req.query[key]}%`) }
    } else if (key === 'price') {
      const priceFilter = req.query[key] as string
      return {
        ...acc,
        [key]: Between(priceFilter.split(',')[0], priceFilter.split(',')[1]),
      }
    }

    return { ...acc, [key]: req.query[key] }
  }, {})

  return filter
}
