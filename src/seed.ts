import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { User, Doctor, Patient, Appointment, Visit, Medicine, Bill, Schedule, Prescription } from './entities';
import { hashPassword } from './utils';

async function seed() {
  await AppDataSource.initialize();
  console.log('Data Source initialized for seeding...');

  const userRepository = AppDataSource.getRepository(User);
  const doctorRepository = AppDataSource.getRepository(Doctor);
  const patientRepository = AppDataSource.getRepository(Patient);
  const scheduleRepository = AppDataSource.getRepository(Schedule);
  const appointmentRepository = AppDataSource.getRepository(Appointment);
  const medicineRepository = AppDataSource.getRepository(Medicine);
  const visitRepository = AppDataSource.getRepository(Visit);
  const prescriptionRepository = AppDataSource.getRepository(Prescription);
  const billRepository = AppDataSource.getRepository(Bill);

  const hashedAdminPassword = await hashPassword('admin123456');
  const hashedDoctorPassword = await hashPassword('doctor123456');
  const hashedReceptionPassword = await hashPassword('reception123456');
  const hashedPatientPassword = await hashPassword('patient123456');

  await userRepository.save([
    { username: 'admin', password: hashedAdminPassword, role: 'admin', name: '系统管理员' },
    { username: 'doctor1', password: hashedDoctorPassword, role: 'doctor', name: '张医生' },
    { username: 'reception1', password: hashedReceptionPassword, role: 'receptionist', name: '李前台' },
    { username: 'patient1', password: hashedPatientPassword, role: 'patient', name: '王患者' }
  ]);
  console.log('Users seeded!');

  const doctors = await doctorRepository.save([
    { name: '张医生', department: 'internal', title: '主任医师', registrationFee: 50 },
    { name: '李医生', department: 'surgery', title: '副主任医师', registrationFee: 45 },
    { name: '王医生', department: 'pediatrics', title: '主治医师', registrationFee: 35 }
  ]);
  console.log('Doctors seeded!');

  const days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = 
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (const doctor of doctors) {
    for (let i = 0; i < 5; i++) {
      await scheduleRepository.save({
        doctorId: doctor.id,
        day: days[i],
        morning: 'morning',
        afternoon: 'afternoon'
      });
    }
  }
  console.log('Schedules seeded!');

  const patients = await patientRepository.save([
    { name: '张三', idNumber: '110101199001011234', gender: 'male', birthDate: new Date('1990-01-01'), bloodType: 'A', allergies: ['青霉素'], phone: '13800138001' },
    { name: '李四', idNumber: '110101199102022345', gender: 'female', birthDate: new Date('1991-02-02'), bloodType: 'B', allergies: [], phone: '13800138002' },
    { name: '王五', idNumber: '110101199203033456', gender: 'male', birthDate: new Date('1992-03-03'), bloodType: 'AB', allergies: ['头孢'], phone: '13800138003' },
    { name: '赵六', idNumber: '110101199304044567', gender: 'female', birthDate: new Date('1993-04-04'), bloodType: 'O', allergies: [], phone: '13800138004' },
    { name: '钱七', idNumber: '110101199405055678', gender: 'male', birthDate: new Date('1994-05-05'), bloodType: 'unknown', allergies: [], phone: '13800138005' }
  ]);
  console.log('Patients seeded!');

  const medicines = await medicineRepository.save([
    { name: '阿莫西林胶囊', specification: '0.5g*24粒', stockQuantity: 100, unitPrice: 25.5, category: 'western' },
    { name: '布洛芬缓释胶囊', specification: '0.3g*20粒', stockQuantity: 80, unitPrice: 18.8, category: 'western' },
    { name: '感冒清热颗粒', specification: '12g*10袋', stockQuantity: 150, unitPrice: 15.0, category: 'chinese-patent' },
    { name: '六味地黄丸', specification: '9g*10丸', stockQuantity: 120, unitPrice: 22.5, category: 'chinese-patent' },
    { name: '维生素C片', specification: '100mg*100片', stockQuantity: 200, unitPrice: 8.5, category: 'western' },
    { name: '黄连上清片', specification: '0.3g*48片', stockQuantity: 90, unitPrice: 12.0, category: 'chinese-patent' },
    { name: '当归', specification: '10g*500g', stockQuantity: 50, unitPrice: 60.0, category: 'chinese-herb' },
    { name: '黄芪', specification: '10g*500g', stockQuantity: 60, unitPrice: 45.0, category: 'chinese-herb' },
    { name: '头孢克肟分散片', specification: '0.1g*6片', stockQuantity: 70, unitPrice: 32.0, category: 'western' },
    { name: '奥美拉唑肠溶胶囊', specification: '20mg*14粒', stockQuantity: 85, unitPrice: 42.0, category: 'western' },
    { name: '健胃消食片', specification: '0.5g*36片', stockQuantity: 110, unitPrice: 16.5, category: 'chinese-patent' },
    { name: '金银花', specification: '10g*100g', stockQuantity: 40, unitPrice: 85.0, category: 'chinese-herb' },
    { name: '银翘解毒片', specification: '0.5g*36片', stockQuantity: 95, unitPrice: 19.5, category: 'chinese-patent' },
    { name: '复方甘草片', specification: '100片', stockQuantity: 75, unitPrice: 10.0, category: 'western' },
    { name: '氯雷他定片', specification: '10mg*6片', stockQuantity: 65, unitPrice: 28.0, category: 'western' },
    { name: '盐酸氨溴索口服溶液', specification: '100ml', stockQuantity: 55, unitPrice: 22.0, category: 'western' },
    { name: '川贝枇杷膏', specification: '150ml', stockQuantity: 88, unitPrice: 35.0, category: 'chinese-patent' },
    { name: '板蓝根颗粒', specification: '10g*10袋', stockQuantity: 130, unitPrice: 18.0, category: 'chinese-patent' },
    { name: '枸杞', specification: '10g*250g', stockQuantity: 70, unitPrice: 38.0, category: 'chinese-herb' },
    { name: '三七粉', specification: '3g*10袋', stockQuantity: 50, unitPrice: 58.0, category: 'chinese-herb' }
  ]);
  console.log('Medicines seeded!');

  const timeSlots: Array<'morning' | 'afternoon'> = ['morning', 'afternoon'];
  const statuses: Array<'pending' | 'completed' | 'cancelled' | 'no-show'> = 
    ['pending', 'completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'cancelled', 'no-show'];

  const appointments: Appointment[] = [];
  for (let i = 0; i < 10; i++) {
    const appointment = appointmentRepository.create({
      patientId: patients[i % patients.length].id,
      doctorId: doctors[i % doctors.length].id,
      appointmentDate: new Date(2024, 4, i + 1),
      timeSlot: timeSlots[i % 2],
      sequenceNumber: (i % 5) + 1,
      status: statuses[i]
    });
    appointments.push(await appointmentRepository.save(appointment));
  }
  console.log('Appointments seeded!');

  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const visits: Visit[] = [];
  for (let i = 0; i < Math.min(8, completedAppointments.length); i++) {
    const chiefComplaints = ['发热咳嗽', '头痛头晕', '腹痛腹泻', '关节疼痛', '皮肤瘙痒', '失眠多梦', '胸闷气短', '咽喉肿痛'];
    const visit = visitRepository.create({
      appointmentId: completedAppointments[i].id,
      chiefComplaint: chiefComplaints[i % chiefComplaints.length],
      presentIllness: '患者3天前受凉后出现发热，体温最高38.5℃，伴咳嗽、咳痰，痰色黄，量中等。',
      examinationResults: '咽部充血，扁桃体Ⅰ度肿大，双肺呼吸音粗，可闻及散在干啰音。',
      diagnosisCode: 'J06.900',
      diagnosisName: '急性上呼吸道感染',
      medicalAdvice: '注意休息，多饮水，清淡饮食，避风寒。',
      followUpAdvice: '3天后复诊，如症状加重及时就诊。'
    });
    visits.push(await visitRepository.save(visit));

    const prescMedicines = medicines.slice(i * 2, i * 2 + 2);
    for (let j = 0; j < prescMedicines.length; j++) {
      const medicine = prescMedicines[j];
      await prescriptionRepository.save({
        visitId: visit.id,
        medicineId: medicine.id,
        medicineName: medicine.name,
        specification: medicine.specification,
        usage: '口服',
        dosage: '一次1粒',
        days: 5,
        quantity: 2,
        unitPrice: medicine.unitPrice,
        totalPrice: medicine.unitPrice * 2
      });
      
      medicine.stockQuantity -= 2;
      await medicineRepository.save(medicine);
    }
  }
  console.log('Visits and Prescriptions seeded!');

  for (const visit of visits) {
    const doctor = doctors.find(d => d.id === appointments.find(a => a.id === visit.appointmentId)?.doctorId);
    if (doctor) {
      const prescriptions = await prescriptionRepository.find({ where: { visitId: visit.id } });
      const medicineFee = prescriptions.reduce((sum, p) => sum + Number(p.totalPrice), 0);
      
      await billRepository.save({
        visitId: visit.id,
        registrationFee: doctor.registrationFee,
        medicineFee: medicineFee,
        examinationFee: 0,
        totalAmount: doctor.registrationFee + medicineFee,
        paymentStatus: 'paid',
        paidAt: new Date()
      });
    }
  }
  console.log('Bills seeded!');

  console.log('Seeding completed successfully!');
  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
