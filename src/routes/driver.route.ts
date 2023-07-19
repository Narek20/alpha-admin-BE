import { Router } from 'express'
import { DriverController } from '../controllers/driver.controller'

/**
 * License Routes
 */
class DriverRoutes {
  private static instance: DriverRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all drivers
       */
      .get(DriverController.getAll)

    this.router
      .route('/create')
      /**
       * Create a new driver
       */
      .post(DriverController.create)

    this.router
      .route('/:id')
      /**
       * Update single driver
       */
      .put(DriverController.update)
      /**
       * Remove single driver
       */
      .delete(DriverController.remove)
  }

  /**
   * Singleton getter
   *
   * @returns {DriverRoutes} Routes instance
   */
  static get(): DriverRoutes {
    if (!DriverRoutes.instance) {
      DriverRoutes.instance = new DriverRoutes()
    }

    return DriverRoutes.instance
  }
}

const driverRoutes = DriverRoutes.get()
export { driverRoutes as DriverRoutes }
