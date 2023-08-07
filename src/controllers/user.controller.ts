import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'
import { User } from '../entities/users.entity'
import { UserStatus } from '../types/types/user.types'
import { IExtendedRequest } from '../types/interfaces/extendedRequest.interface'
import env from '../env/env.variables'
import { decrypt, encrypt } from '../utils/passworod'

class UserController {
  private static instance: UserController

  static get(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController()
    }

    return UserController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const userRepository = getRepository(User)
      const users = await userRepository.find()

      const formattedUsers = users.map((user) => ({
        ...user,
        password: decrypt(user.password, env.encryptionCode),
      }))

      return res.send({ success: true, data: formattedUsers })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async getOne(req: IExtendedRequest, res: Response) {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({
      where: { password: encrypt(req.decodedToken, env.encryptionCode) },
    })

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: 'Օգտատերը չի գտնվել' })
    }

    return res.send({ success: true, data: user })
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({
        where: { login, password: encrypt(password, env.encryptionCode) },
      })

      if (!user) {
        return res
          .status(400)
          .send({ success: false, message: 'Օգտատերը չի գտնվել' })
      }

      const token = jwt.sign(password, env.jwtSecret)

      return res.send({ success: true, data: user, accessToken: token })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userRepository = getRepository(User)

      const existUser = await userRepository.findOne({
        where: { login: req.body.login },
      })

      if (existUser) {
        return res
          .status(400)
          .send({ success: false, message: 'Օգտատերը արդեն գոյություն ունի' })
      }

      const user: User = Object.assign(new User(), {
        ...req.body,
        password: encrypt(req.body.password, env.encryptionCode),
      })

      if (!req.body.status) {
        user.status = UserStatus.USER
      }

      const savedUser = await userRepository.save(user)
      
      savedUser.password = req.body.password

      return res.send({
        success: true,
        data: savedUser,
        message: 'Օգտատերը ստեղծված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const userRepository = getRepository(User)

      const user = await userRepository.findOneOrFail({
        where: { id },
      })

      const savedUser = await userRepository.save({
        ...user,
        ...req.body,
        password: encrypt(req.body.password, env.encryptionCode),
      })

      savedUser.password = req.body.password

      return res.send({
        success: true,
        data: savedUser,
        message: 'Տվյալները պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const userRepository = getRepository(User)

      const UserToRemove = await userRepository.findOneOrFail({
        where: { id },
      })

      if (!UserToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Օգտատերը չի գտնվել' })
      }

      await userRepository.remove(UserToRemove)

      return res.send({ success: true, message: 'Օգտատերը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const userController = UserController.get()
export { userController as UserController }
