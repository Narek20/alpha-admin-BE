import { Router } from 'express'
import { CustomerController } from '../controllers/customer.controller'

/**
 * License Routes
 */
class CustomerRoutes {
  private static instance: CustomerRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/:fullName')
      /**
       * Get single customer
       */
      .get(CustomerController.getOne)
  }

  /**
   * Singleton getter
   *
   * @returns {CustomerRoutes} Routes instance
   */
  static get(): CustomerRoutes {
    if (!CustomerRoutes.instance) {
      CustomerRoutes.instance = new CustomerRoutes()
    }

    return CustomerRoutes.instance
  }
}

const customerRoutes = CustomerRoutes.get()
export { customerRoutes as CustomerRoutes }
