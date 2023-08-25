import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import { Driver } from '../entities/driver.entity'
import { DriverStatus } from '../types/types/driver.types'

class DriverController {
  private static instance: DriverController

  static get(): DriverController {
    if (!DriverController.instance) {
      DriverController.instance = new DriverController()
    }

    return DriverController.instance
  }

  async getAll(req: Request, res: Response) {
    try {
      const driverRepository = getRepository(Driver)
      const drivers = await driverRepository.find()

      return res.send({ success: true, data: drivers })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const driverRepository = getRepository(Driver)

      const driver: Driver = Object.assign(new Driver(), {
        ...req.body,
      })

      const savedDriver = await driverRepository.save(driver)

      return res.send({
        success: true,
        data: savedDriver,
        message: 'Առաքիչը ստեղծված է',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const driverRepository = getRepository(Driver)

      const driver = await driverRepository.findOneOrFail({
        where: { id },
      })

      const savedDriver = await driverRepository.save({
        ...driver,
        ...req.body,
      })

      return res.send({
        success: true,
        data: savedDriver,
        message: 'Տվյալները պահպանված են',
      })
    } catch (err) {
      return res.send({ success: false, message: err.message })
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const driverRepository = getRepository(Driver)

      const driverToRemove = await driverRepository.findOneOrFail({
        where: { id },
      })

      if (!driverToRemove) {
        return res
          .status(400)
          .send({ success: false, message: 'Առաքիչը չի գտնվել' })
      }

      await driverRepository.remove(driverToRemove)

      return res.send({ success: true, message: 'Առաքիչը հեռացված է' })
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message })
    }
  }
}

const driverController = DriverController.get()
export { driverController as DriverController }
