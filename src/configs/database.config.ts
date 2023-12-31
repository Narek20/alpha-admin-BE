import 'reflect-metadata'
import { Note } from '../entities/note.entity'
import { User } from '../entities/users.entity'
import { Order } from '../entities/orders.entity'
import { Store } from '../entities/store.entity'
import { Product } from '../entities/products.entity'
import { Driver } from '../entities/driver.entity'
import { Storage } from '../entities/storage.entity'
import { Category } from '../entities/category.entity'
import { Customer } from '../entities/customer.entity'
import { OrderProduct } from '../entities/orderProducts.entity'
import { StoreProduct } from '../entities/storeProducts.entity'
import { StorageProduct } from '../entities/storageProduct.entity'
import env from '../env/env.variables'

export const DatabaseConfig = {
  host: env.databaseHost,
  port: env.databasePort,
  type: env.databaseType,
  database: env.databaseName,
  password: env.databasePassword,
  username: env.databaseUsername,
  entities: [
    User,
    Note,
    Order,
    Store,
    Driver,
    Product,
    Storage,
    Category,
    Customer,
    OrderProduct,
    StoreProduct,
    StorageProduct,
  ],
  synchronize: false,
  migrations: ['src/migrations'],
}
