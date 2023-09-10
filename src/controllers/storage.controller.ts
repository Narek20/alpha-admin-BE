import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Storage } from '../entities/storage.entity'
import { Product } from '../entities/products.entity'
import { StorageProduct } from '../entities/storageProduct.entity'

class StorageController {
  private static instance: StorageController

  static get(): StorageController {
    if (!StorageController.instance) {
      StorageController.instance = new StorageController()
    }

    return StorageController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const storageRepository = getRepository(Storage)
      const storages = await storageRepository.find()

      return res.send({ success: true, data: storages })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getImports(req: Request, res: Response) {
    try {
      const storageProductRepository = getRepository(StorageProduct)
      const productStorages = await storageProductRepository.find({
        relations: ['storage', 'product'],
      })

      const filteredStorages = productStorages.map((productStorage) => ({
        ...productStorage,
        product: productStorage.product.title,
        title: productStorage.storage.title,
      }))

      return res.send({ success: true, data: filteredStorages })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { productIDs, title, importDate } = req.body
      const storageRepository = getRepository(Storage)
      const productRepository = getRepository(Product)
      const storageProductRepository = getRepository(StorageProduct)

      let storage = await storageRepository.findOne({ where: { title } })

      if (!storage) {
        storage = Object.assign(new Storage(), {
          ...req.body,
        })
      }

      const savedStorage = await storageRepository.save(storage)

      const products: Product[] = []

      for (let i = 0; i < productIDs.length; i++) {
        const { id, size, smSize, quantity } = productIDs[i]

        const product = await productRepository.findOne({ where: { id } })

        const updatedSizes = product.sizes.map((productSizes) => {
          if (productSizes.size === size) {
            return {
              ...productSizes,
              quantity: productSizes.quantity
                ? productSizes.quantity + quantity
                : quantity,
            }
          }

          return productSizes
        })

        await productRepository.save({
          ...product,
          sizes: updatedSizes,
        })

        products.push({
          ...product,
          sizes: [...product.sizes, { smSize, quantity, size }],
        })

        const storageProduct = Object.assign(new StorageProduct(), {
          storageId: savedStorage.id,
          productId: id,
          quantity,
          size,
          importDate,
        })

        await storageProductRepository.save(storageProduct)
      }

      return res.send({
        success: true,
        message: 'Ապրանքը հաջողությամբ ավելացվեց',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const storageRepository = getRepository(Storage)

      const storage = await storageRepository.findOneOrFail({
        where: { id },
      })

      const savedStorage = await storageRepository.save({
        ...storage,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedStorage,
        message: 'Տվյալները պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const storageRepository = getRepository(Storage)

      const storageToRemove = await storageRepository.findOneOrFail({
        where: { id },
      })

      if (!storageToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Ապրանքը չի գտնվել' })
      }

      await storageRepository.remove(storageToRemove)

      return res.send({ success: true, message: 'Առաքիչը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const storageController = StorageController.get()
export { storageController as StorageController }
