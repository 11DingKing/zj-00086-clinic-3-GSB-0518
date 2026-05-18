import { AppDataSource } from '../data-source';
import { Medicine } from '../entities';

export class MedicineService {
  private medicineRepository = AppDataSource.getRepository(Medicine);

  async checkAndDeductStock(medicineId: number, quantity: number): Promise<boolean> {
    const medicine = await this.medicineRepository.findOne({ where: { id: medicineId } });
    if (!medicine) {
      throw new Error('药品不存在');
    }
    if (medicine.stockQuantity < quantity) {
      throw new Error(`药品 ${medicine.name} 库存不足`);
    }
    medicine.stockQuantity -= quantity;
    await this.medicineRepository.save(medicine);
    return true;
  }

  async restoreStock(medicineId: number, quantity: number): Promise<void> {
    const medicine = await this.medicineRepository.findOne({ where: { id: medicineId } });
    if (medicine) {
      medicine.stockQuantity += quantity;
      await this.medicineRepository.save(medicine);
    }
  }

  async getAllMedicines(): Promise<Medicine[]> {
    return this.medicineRepository.find();
  }

  async getMedicineById(id: number): Promise<Medicine | null> {
    return this.medicineRepository.findOne({ where: { id } });
  }
}
