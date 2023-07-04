import "reflect-metadata"
import { User } from "../entity/users.entity"

export const DatabaseConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "alpha23",
    database: "postgres",
    entities: [User],
    synchronize: true,
    migrations: ["src/migrations"],
}
