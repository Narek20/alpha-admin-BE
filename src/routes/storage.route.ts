import { Router } from 'express'
import { StorageController } from '../controllers/storage.controller'

/**
 * License Routes
 */
class StorageRoutes {
  private static instance: StorageRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all storages
       */
      .get(StorageController.getAll)

      this.router
      .route('/imports')
      /**
       * Get all storages
       */
      .get(StorageController.getImports)

    this.router
      .route('/create')
      /**
       * Create a new storage
       */
      .post(StorageController.create)

    this.router
      .route('/:id')
      /**
       * Update single storage
       */
      .put(StorageController.update)
      /**
       * Remove single storage
       */
      .delete(StorageController.remove)
  }

  /**
   * Singleton getter
   *
   * @returns {StorageRoutes} Routes instance
   */
  static get(): StorageRoutes {
    if (!StorageRoutes.instance) {
      StorageRoutes.instance = new StorageRoutes()
    }

    return StorageRoutes.instance
  }
}

const storageRoutes = StorageRoutes.get()
export { storageRoutes as StorageRoutes }
