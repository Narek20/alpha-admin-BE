import { Router } from 'express'
import { StoreController } from '../controllers/store.controller'

/**
 * License Routes
 */
class StoreRoutes {
  private static instance: StoreRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all orders
       */
      .get(StoreController.getAll)

    this.router
      .route('/search')
      /**
       * Get all orders
       */
      .get(StoreController.searchOrders)

    this.router
      .route('/create')
      /**
       * Create a new order
       */
      .post(StoreController.create)

    this.router
      .route('/:id')
      /**
       * Get single order
       */
      .get(StoreController.getOne)
      /**
       * Update single order
       */
      .put(StoreController.update)
      /**
       * Remove single order
       */
      .delete(StoreController.remove)
  }

  /**
   * Singleton getter
   *
   * @returns {StoreRoutes} Routes instance
   */
  static get(): StoreRoutes {
    if (!StoreRoutes.instance) {
      StoreRoutes.instance = new StoreRoutes()
    }

    return StoreRoutes.instance
  }
}

const storeRoutes = StoreRoutes.get()
export { storeRoutes as StoreRoutes }
