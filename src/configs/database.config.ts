import 'reflect-metadata'
import { User } from '../entities/users.entity'
import { Order } from '../entities/orders.entity'
import { Product } from '../entities/products.entity'
import env from '../env/env.variables'
import { OrderProduct } from '../entities/orderProducts.entity'

export const DatabaseConfig = {
  host: env.databaseHost,
  port: env.databasePort,
  type: env.databaseType,
  database: env.databaseName,
  password: env.databasePassword,
  username: env.databaseUsername,
  entities: [Product, Order, OrderProduct],
  synchronize: false,
  migrations: ['src/migrations'],
}
