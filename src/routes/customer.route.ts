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
      .route('/')
      /**
       * Get customers
       */
      .get(CustomerController.getAll)

    this.router
      .route('/search')
      /**
       * Get all customers
       */
      .get(CustomerController.search)

    this.router
      .route('/:phone')
      /**
       * Get single customer
       */
      .get(CustomerController.getOne)

    this.router
      .route('/:id')
      /**
       * Update customer
       */
      .put(CustomerController.update)

    this.router
      .route('/:id')
      /**
       * Delete customer
       */
      .delete(CustomerController.remove)

    this.router
      .route('/address/:phone/')
      /**
       * Get customer address
       */
      .get(CustomerController.getAddress)
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
