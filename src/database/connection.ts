import { DataSourceOptions, createConnection } from 'typeorm'
import { DatabaseConfig } from '../configs/database.config'

export const databaseConnection = async () => {
  try {
    const connection = await createConnection(
      DatabaseConfig as DataSourceOptions
    )
    console.log('Connected to the database')
    // Add your code here
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}
