import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { verifyToken } from '../middleware/auth.middleware'

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
      .get(verifyToken, UserController.getAll)

    this.router
      .route('/one')
      /**
       * get single user
       */
      .get(verifyToken, UserController.getOne)

    this.router
      .route('/:phone')
      /**
       * get single user
       */
      .get(UserController.getUserByPhoneNumber)

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
