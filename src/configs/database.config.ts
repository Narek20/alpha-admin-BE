import "reflect-metadata"
import { User } from "../entities/users.entity"
import { Order } from "../entities/orders.entity"
import { Product } from "../entities/products.entity"

export const DatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "alpha23",
    database: "postgres",
    entities: [User, Product, Order],
    synchronize: true,
    migrations: ["src/migrations"],
}
