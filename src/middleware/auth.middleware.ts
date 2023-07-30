import { Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { IExtendedRequest } from '../types/interfaces/extendedRequest.interface'
import env from '../env/env.variables'

export const verifyToken = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['x-access-token']

    if (!token) {
      return res.status(401).send({ success: false, message: 'Unauthorized' })
    }

    if (typeof token === 'string' && env.jwtSecret) {
      const decoded = jwt.verify(token, env.jwtSecret)
      console.log(decoded)
      req.decodedToken = decoded as string
      next()
    }
  } catch (error) {
    return res.status(400).send('Invalid token')
  }
}
