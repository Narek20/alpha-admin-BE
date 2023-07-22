import { Request, Response } from 'express'
import { User } from '../entities/users.entity'
import { getRepository } from 'typeorm'

class UserController {
  private static instance: UserController

  static get(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController()
    }

    return UserController.instance
  }

  async getAll(req: Request, res: Response) {
    const userRepository = getRepository(User)
    const users = await userRepository.find()

    return res.send(users)
  }

  async getOne(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({
      where: { id },
    })

    if (!user) {
      return 'unregistered user'
    }
    return res.send(user)
  }

  async create(req: Request, res: Response) {
    const { firstName, lastName, age } = req.body
    const userRepository = getRepository(User)
    const user = Object.assign(new User(), {
      firstName,
      lastName,
      age,
    })

    return userRepository.save(user)
  }

  async remove(req: Request, res: Response) {
    const id = parseInt(req.params.id)
    const userRepository = getRepository(User)
    let userToRemove = await userRepository.findOneBy({ id })

    if (!userToRemove) {
      return 'this user not exist'
    }

    await userRepository.remove(userToRemove)

    return 'user has been removed'
  }
}

const userController = UserController.get()
export { userController as UserController }
