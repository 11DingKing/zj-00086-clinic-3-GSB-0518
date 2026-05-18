import Router from 'koa-router';
import { AuthController } from './controllers/AuthController';
import { DoctorController } from './controllers/DoctorController';
import { PatientController } from './controllers/PatientController';
import { AppointmentController } from './controllers/AppointmentController';
import { VisitController } from './controllers/VisitController';
import { MedicineController } from './controllers/MedicineController';
import { BillController } from './controllers/BillController';
import { MedicalRecordController } from './controllers/MedicalRecordController';
import { StatisticsController } from './controllers/StatisticsController';
import { PrescriptionTemplateController } from './controllers/PrescriptionTemplateController';
import { FollowUpController } from './controllers/FollowUpController';
import { AuthMiddleware, RoleMiddleware } from './middleware';

const router = new Router({ prefix: '/api' });

const authController = new AuthController();
const doctorController = new DoctorController();
const patientController = new PatientController();
const appointmentController = new AppointmentController();
const visitController = new VisitController();
const medicineController = new MedicineController();
const billController = new BillController();
const medicalRecordController = new MedicalRecordController();
const statisticsController = new StatisticsController();
const prescriptionTemplateController = new PrescriptionTemplateController();
const followUpController = new FollowUpController();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.post('/doctors', AuthMiddleware, RoleMiddleware(['admin']), doctorController.createDoctor);
router.post('/doctors/:id/schedule', AuthMiddleware, RoleMiddleware(['admin']), doctorController.setSchedule);

router.get('/patients', AuthMiddleware, patientController.getAllPatients);
router.get('/patients/:id', AuthMiddleware, patientController.getPatientById);
router.post('/patients', AuthMiddleware, RoleMiddleware(['admin', 'receptionist']), patientController.createPatient);

router.get('/appointments', AuthMiddleware, appointmentController.getAllAppointments);
router.get('/appointments/:id', AuthMiddleware, appointmentController.getAppointmentById);
router.post('/appointments', AuthMiddleware, appointmentController.createAppointment);
router.put('/appointments/:id/status', AuthMiddleware, appointmentController.updateStatus);

router.get('/visits', AuthMiddleware, visitController.getAllVisits);
router.get('/visits/:id', AuthMiddleware, visitController.getVisitById);
router.post('/visits', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), visitController.createVisit);

router.get('/medicines', AuthMiddleware, medicineController.getAllMedicines);
router.get('/medicines/low-stock', AuthMiddleware, medicineController.getLowStockMedicines);
router.get('/medicines/:id', AuthMiddleware, medicineController.getMedicineById);
router.post('/medicines', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), medicineController.createMedicine);
router.put('/medicines/:id', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), medicineController.updateMedicine);

router.get('/bills', AuthMiddleware, billController.getAllBills);
router.get('/bills/:id', AuthMiddleware, billController.getBillById);
router.post('/bills/:id/pay', AuthMiddleware, RoleMiddleware(['admin', 'receptionist']), billController.payBill);

router.get('/medical-records/patient/:patientId', AuthMiddleware, medicalRecordController.getPatientMedicalRecords);
router.get('/medical-records/patient/:patientId/version/:version', AuthMiddleware, medicalRecordController.getMedicalRecordByVersion);

router.get('/statistics/daily-visits', AuthMiddleware, RoleMiddleware(['admin']), statisticsController.getDailyVisits);
router.get('/statistics/doctor-workload', AuthMiddleware, RoleMiddleware(['admin']), statisticsController.getDoctorWorkload);
router.get('/statistics/top-medicines', AuthMiddleware, RoleMiddleware(['admin']), statisticsController.getTopMedicines);
router.get('/statistics/monthly-revenue', AuthMiddleware, RoleMiddleware(['admin']), statisticsController.getMonthlyRevenue);
router.get('/statistics/no-show-rate', AuthMiddleware, RoleMiddleware(['admin']), statisticsController.getNoShowRate);

router.get('/prescription-templates', AuthMiddleware, prescriptionTemplateController.getAllTemplates);
router.get('/prescription-templates/:id', AuthMiddleware, prescriptionTemplateController.getTemplateById);
router.post('/prescription-templates', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), prescriptionTemplateController.createTemplate);
router.put('/prescription-templates/:id', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), prescriptionTemplateController.updateTemplate);
router.delete('/prescription-templates/:id', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), prescriptionTemplateController.deleteTemplate);

router.get('/follow-ups', AuthMiddleware, followUpController.getAllFollowUps);
router.get('/follow-ups/:id', AuthMiddleware, followUpController.getFollowUpById);
router.get('/follow-ups/patient/:patientId', AuthMiddleware, followUpController.getFollowUpsByPatient);
router.post('/follow-ups', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), followUpController.createFollowUp);
router.put('/follow-ups/:id', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), followUpController.updateFollowUp);
router.delete('/follow-ups/:id', AuthMiddleware, RoleMiddleware(['admin', 'doctor']), followUpController.deleteFollowUp);

export default router;
