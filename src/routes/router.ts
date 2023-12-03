import { IRouter as RouterInstance, Router as ExpressRouter } from 'express'
import { UserRoutes } from './user.route'
import { NoteRoutes } from './note.route'
import { OrderRoutes } from './order.route'
import { DriverRoutes } from './driver.route'
import { ProductRoutes } from './product.route'
import { StorageRoutes } from './storage.route'
import { CustomerRoutes } from './customer.route'
import { CategoryRoutes } from './category.route'
import { CommonRoutes } from './common.route'
import { StoreRoutes } from './store.route'

/**
 * Router Middleware
 */
class Router {
  private static instance: Router
  public middleware: RouterInstance

  constructor() {
    // Initialize router
    this.middleware = ExpressRouter()

    this.map([
      { segment: '/users', handler: UserRoutes.router },
      { segment: '/notes', handler: NoteRoutes.router },
      { segment: '/orders', handler: OrderRoutes.router },
      { segment: '/drivers', handler: DriverRoutes.router },
      { segment: '/storages', handler: StorageRoutes.router },
      { segment: '/products', handler: ProductRoutes.router },
      { segment: '/common', handler: CommonRoutes.router },
      { segment: '/customers', handler: CustomerRoutes.router },
      { segment: '/categories', handler: CategoryRoutes.router },
      { segment: '/store', handler: StoreRoutes.router },
    ])
  }

  /**
   * Singleton getter
   *
   * @returns {Router} Router instance
   */
  static get(): Router {
    if (!Router.instance) {
      Router.instance = new Router()
    }

    return Router.instance
  }

  /**
   * Map route handlers
   *
   * @param {IRoute[]} routes Route configs
   * @returns {void}
   */
  map(routes: any): void {
    routes.forEach((route: { segment: string; handler: any }) => {
      this.middleware.use(route.segment, route.handler)
    })
  }
}

const router = Router.get()
export { router as Router }
