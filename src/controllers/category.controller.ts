import { Request, Response } from 'express'
import { Transaction, getConnection, getRepository } from 'typeorm'
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
      const newCategories: Category[] = req.body
      const categoryRepository = getRepository(Category)

      for (let i = 0; i < newCategories.length; i++) {
        const category: Category = Object.assign(new Category(), {
          ...newCategories[i],
        })

        await categoryRepository.save(category)
      }

      return res.send({
        success: true,
        message: 'Կատեգորիանները ստեղծված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedCategories: Category[] = req.body

      const connection = getConnection()
      await connection.transaction(async (transactionalEntityManager) => {
        const creatingCategories: Category[] = updatedCategories.map(
          (category) => {
            const newCategory = transactionalEntityManager.create(
              Category,
              category,
            )
            return newCategory
          },
        )

        await transactionalEntityManager.delete(Category, {})
        await transactionalEntityManager.save(Category, creatingCategories)

        return res.send({
          success: true,
          message: 'Կատեգորիաները պահպանված են',
        })
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const title = req.params.title
      const categoryRepository = getRepository(Category)

      const categoryToRemove = await categoryRepository.findOneOrFail({
        where: { title },
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
