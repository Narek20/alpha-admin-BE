import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Note } from '../entities/note.entity'

class NoteController {
  private static instance: NoteController

  static get(): NoteController {
    if (!NoteController.instance) {
      NoteController.instance = new NoteController()
    }

    return NoteController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const noteRepository = getRepository(Note)
      const notes = await noteRepository.find()

      const formattedNotes = notes.map((note) => {
        const newDate = new Date(note.createdAt.getTime())

        const formattedDate = newDate.toISOString().split('T')[0]

        return {
          ...note,
          date: formattedDate,
        }
      })

      return res.send({ success: true, data: formattedNotes })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const noteRepository = getRepository(Note)

      const note: Note = Object.assign(new Note(), {
        ...req.body,
      })

      const savedNote = await noteRepository.save(note)

      return res.send({
        success: true,
        data: savedNote,
        message: 'Նշումը ստեղծված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const noteRepository = getRepository(Note)

      const note = await noteRepository.findOneOrFail({
        where: { id },
      })

      const savedNote = await noteRepository.save({
        ...note,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedNote,
        message: 'Նշումը պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const noteRepository = getRepository(Note)

      const noteToRemove = await noteRepository.findOneOrFail({
        where: { id },
      })

      if (!noteToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Նշումը չի գտնվել' })
      }

      await noteRepository.remove(noteToRemove)

      return res.send({ success: true, message: 'Նշումը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const noteController = NoteController.get()
export { noteController as NoteController }
