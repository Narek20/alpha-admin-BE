import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

/**
 * License Routes
 */
class ProductRoutes {
  private static instance: ProductRoutes;
  public router: Router;

  constructor() {
    // Initialize router
    this.router = Router();

    this.router
      .route("/")
      /**
       * get all products
       */
      .get( ProductController.getAll);

    this.router
      .route("/create")
      /**
       * Create a new product
       */
      .post( ProductController.create);
  }

  /**
   * Singleton getter
   *
   * @returns {ProductRoutes} Routes instance
   */
  static get(): ProductRoutes {
    if (!ProductRoutes.instance) {
      ProductRoutes.instance = new ProductRoutes();
    }

    return ProductRoutes.instance;
  }
}

const productRoutes = ProductRoutes.get();
export { productRoutes as ProductRoutes };
