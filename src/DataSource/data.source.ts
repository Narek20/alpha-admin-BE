import { DataSource } from 'typeorm'
import env from '../env/env.variables'

const DatabaseConfigs = new DataSource({
  type: 'postgres',
  host: env.databaseHost,
  port: +env.databasePort || 5432,
  username: env.databaseUsername,
  password: env.databasePassword,
  database: env.databaseName,
  entities: ['./src/entities/*.ts'],
  migrations: ['./src/migrations/**.ts'],
  synchronize: false,
  logging: false,
})

export default DatabaseConfigs
