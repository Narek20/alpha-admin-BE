import { Request } from 'express'
import { Between, FindOptionsWhere, ILike } from 'typeorm'
import { Product } from '../entities/products.entity'
import { OrderStatuses } from '../types/types/order.types'

export const getProductQueries = (
  req: Request,
): FindOptionsWhere<Product> | FindOptionsWhere<Product>[] => {
  const filterKeys = Object.keys(req.query)

  const filter = filterKeys.reduce((acc, key) => {
    if (key === 'title' || key === 'brand') {
      return { ...acc, [key]: ILike(`%${req.query[key]}%`) }
    } else if (key === 'price') {
      const priceFilter = req.query[key] as string
      return {
        ...acc,
        [key]: Between(priceFilter.split(',')[0], priceFilter.split(',')[1]),
      }
    } else if (key === 'skip' || key === 'take') {
      return acc
    }

    return { ...acc, [key]: req.query[key] }
  }, {})

  return filter
}

export const getOrderQueries = (
  req: Request,
): FindOptionsWhere<Product> | FindOptionsWhere<Product>[] => {
  const filterKeys = Object.keys(req.query)

  const filter = filterKeys.reduce((acc, key) => {
    if (key === 'type') {
      if (req.query[key] === 'delivery') {
        return { ...acc, status: OrderStatuses.DELIVERY }
      }
      return { ...acc }
    } else if (key === 'price') {
      const priceFilter = req.query[key] as string
      return {
        ...acc,
        [key]: Between(priceFilter.split(',')[0], priceFilter.split(',')[1]),
      }
    } else if (
      key === 'skip' ||
      key === 'take' ||
      (key === 'status' && req.query[key] === 'Բոլորը')
    ) {
      return acc
    }

    return { ...acc, [key]: req.query[key] }
  }, {})

  return filter
}

export const getSearches = (search: string): string[] => {
  if (search) {
    const searchValues = search.split(' ')

    return searchValues
  }

  return []
}
