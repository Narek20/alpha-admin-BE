import { Router } from 'express'
import { NoteController } from '../controllers/note.controller'

/**
 * License Routes
 */
class NoteRoutes {
  private static instance: NoteRoutes
  public router: Router

  constructor() {
    // Initialize router
    this.router = Router()

    this.router
      .route('/')
      /**
       * Get all notes
       */
      .get(NoteController.getAll)

    this.router
      .route('/create')
      /**
       * Create a new note
       */
      .post(NoteController.create)

    this.router
      .route('/:id')
      /**
       * Update single note
       */
      .put(NoteController.update)
      /**
       * Remove single note
       */
      .delete(NoteController.remove)
  }

  /**
   * Singleton getter
   *
   * @returns {NoteRoutes} Routes instance
   */
  static get(): NoteRoutes {
    if (!NoteRoutes.instance) {
      NoteRoutes.instance = new NoteRoutes()
    }

    return NoteRoutes.instance
  }
}

const noteRoutes = NoteRoutes.get()
export { noteRoutes as NoteRoutes }
