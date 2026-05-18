import { Context } from 'koa';
import { AppDataSource } from '../data-source';
import { Medicine } from '../entities';

export class MedicineController {
  private medicineRepository = AppDataSource.getRepository(Medicine);

  constructor() {
    this.getAllMedicines = this.getAllMedicines.bind(this);
    this.getMedicineById = this.getMedicineById.bind(this);
    this.createMedicine = this.createMedicine.bind(this);
    this.updateMedicine = this.updateMedicine.bind(this);
  }

  /**
   * @swagger
   * /api/medicines:
   *   get:
   *     summary: 获取所有药品列表
   *     tags: [药品]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回药品列表
   */
  async getAllMedicines(ctx: Context) {
    const medicines = await this.medicineRepository.find();
    ctx.body = medicines;
  }

  /**
   * @swagger
   * /api/medicines/{id}:
   *   get:
   *     summary: 获取单个药品信息
   *     tags: [药品]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: 成功返回药品信息
   *       404:
   *         description: 药品不存在
   */
  async getMedicineById(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    
    if (!medicine) {
      ctx.status = 404;
      ctx.body = { message: '药品不存在' };
      return;
    }
    ctx.body = medicine;
  }

  /**
   * @swagger
   * /api/medicines:
   *   post:
   *     summary: 创建药品
   *     tags: [药品]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               specification:
   *                 type: string
   *               stockQuantity:
   *                 type: integer
   *               unitPrice:
   *                 type: number
   *               category:
   *                 type: string
   *                 enum: [western, chinese-herb, chinese-patent]
   *     responses:
   *       200:
   *         description: 创建成功
   */
  async createMedicine(ctx: Context) {
    const medicineData = ctx.request.body as any;
    const medicine = this.medicineRepository.create(medicineData);
    await this.medicineRepository.save(medicine);
    ctx.body = medicine;
  }

  /**
   * @swagger
   * /api/medicines/{id}:
   *   put:
   *     summary: 更新药品信息
   *     tags: [药品]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: 更新成功
   */
  async updateMedicine(ctx: Context) {
    const id = parseInt(ctx.params.id);
    const medicineData = ctx.request.body as any;
    
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      ctx.status = 404;
      ctx.body = { message: '药品不存在' };
      return;
    }

    Object.assign(medicine, medicineData);
    await this.medicineRepository.save(medicine);
    ctx.body = medicine;
  }

  /**
   * @swagger
   * /api/medicines/low-stock:
   *   get:
   *     summary: 获取库存低于阈值的药品列表
   *     tags: [药品]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: 成功返回低库存药品列表
   */
  async getLowStockMedicines(ctx: Context) {
    const lowStockMedicines = await this.medicineRepository
      .createQueryBuilder('medicine')
      .where('medicine.stockQuantity <= medicine.alertThreshold')
      .getMany();
    ctx.body = lowStockMedicines;
  }
}
