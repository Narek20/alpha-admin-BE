import { NextFunction, Request, Response } from 'express'
import Validators from '../validations'

export const validate = (validator: keyof typeof Validators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Validators[validator].body.validateAsync(req.body)
      next()
    } catch (err: any) {
      if (err.isJoi)
        return res
          .status(400)
          .send({ success: false, message: 'Դաշտերը լրացված չեն' })
    }
  }
}
