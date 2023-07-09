import { Router } from 'express'
import { validate } from '../middleware/validate.middleware'
import { UserController } from '../controllers/user.controller'

/**
 * License Routes
 */
class UserRoutes {
  private static instance: UserRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * get all users
       */
      .get(UserController.getAll)

    this.router
      .route('/create')
      /**
       * Create a new user
       */
      .post(UserController.create)
  }

  /**
   * Singleton getter
   *
   * @returns {UserRoutes} Routes instance
   */
  static get(): UserRoutes {
    if (!UserRoutes.instance) {
      UserRoutes.instance = new UserRoutes()
    }

    return UserRoutes.instance
  }
}

const userRoutes = UserRoutes.get()
export { userRoutes as UserRoutes }
