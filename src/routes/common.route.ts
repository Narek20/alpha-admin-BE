import { Router } from 'express'
import { CommonController } from '../controllers/common.controller'

/**
 * License Routes
 */
class CommonRoutes {
  private static instance: CommonRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all drivers
       */
      .get(CommonController.searchAll)
  }

  /**
   * Singleton getter
   *
   * @returns {CommonRoutes} Routes instance
   */
  static get(): CommonRoutes {
    if (!CommonRoutes.instance) {
      CommonRoutes.instance = new CommonRoutes()
    }

    return CommonRoutes.instance
  }
}

const commonRoutes = CommonRoutes.get()
export { commonRoutes as CommonRoutes }
