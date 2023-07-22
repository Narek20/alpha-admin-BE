import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Category } from '../entities/category.entity'

class CategoryController {
  private static instance: CategoryController

  static get(): CategoryController {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController()
    }

    return CategoryController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const categoryRepository = getRepository(Category)
      const categories = await categoryRepository.find()

      return res.send({ success: true, data: categories })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const categoryRepository = getRepository(Category)

      const category: Category = Object.assign(new Category(), {
        ...req.body,
      })

      const savedCategory = await categoryRepository.save(category)

      return res.send({
        success: true,
        data: savedCategory,
        message: 'Կատեգորիան ստեղծված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const categoryRepository = getRepository(Category)

      const category = await categoryRepository.findOneOrFail({
        where: { id },
      })

      const savedCategory = await categoryRepository.save({
        ...category,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedCategory,
        message: 'Կատեգորիան պահպանված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const categoryRepository = getRepository(Category)

      const categoryToRemove = await categoryRepository.findOneOrFail({
        where: { id },
      })

      if (!categoryToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Կատեգորիան չի գտնվել' })
      }

      await categoryRepository.remove(categoryToRemove)

      return res.send({ success: true, message: 'Կատեգորիան հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const categoryController = CategoryController.get()
export { categoryController as CategoryController }
