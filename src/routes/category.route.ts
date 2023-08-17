import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller'

/**
 * License Routes
 */
class CategoryRoutes {
  private static instance: CategoryRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all categories
       */
      .get(CategoryController.getAll)
      /**
       * Update single category
       */
      .put(CategoryController.update)

    this.router
      .route('/create')
      /**
       * Create a new category
       */
      .post(CategoryController.create)

    this.router
      .route('/:title')
      /**
       * Remove single category
       */
      .delete(CategoryController.remove)
  }

  /**
   * Singleton getter
   *
   * @returns {CategoryRoutes} Routes instance
   */
  static get(): CategoryRoutes {
    if (!CategoryRoutes.instance) {
      CategoryRoutes.instance = new CategoryRoutes()
    }

    return CategoryRoutes.instance
  }
}

const categoryRoutes = CategoryRoutes.get()
export { categoryRoutes as CategoryRoutes }
