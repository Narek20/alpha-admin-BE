import 'reflect-metadata'
import { Order } from '../entities/orders.entity'
import { Product } from '../entities/products.entity'
import { Driver } from '../entities/driver.entity'
import { Storage } from '../entities/storage.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import env from '../env/env.variables'

export const DatabaseConfig = {
  host: env.databaseHost,
  port: env.databasePort,
  type: env.databaseType,
  database: env.databaseName,
  password: env.databasePassword,
  username: env.databaseUsername,
  entities: [Product, Order, OrderProduct, Driver, Storage],
  synchronize: false,
  migrations: ['src/migrations'],
}
