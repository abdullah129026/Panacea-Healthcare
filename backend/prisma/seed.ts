import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] seeding database...');

  // Clear existing data (cascade handled by FK constraints)
  await prisma.auditLog.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.riskScore.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.clinicInvite.deleteMany({});
  await prisma.clinicMember.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.clinic.deleteMany({});

  // ============================================================================
  // SEED CLINICS
  // ============================================================================
  const clinic1Id = uuid();
  const clinic2Id = uuid();

  const clinic1 = await prisma.clinic.create({
    data: {
      id: clinic1Id,
      name: 'Harmony Medical Center',
      address: '123 Medical Plaza, Suite 100, Seattle, WA 98101',
      phone: '(206) 555-0100',
      email: 'admin@harmony-medical.com',
      operatingHours: JSON.stringify({
        monday: '08:00-18:00',
        tuesday: '08:00-18:00',
        wednesday: '08:00-18:00',
        thursday: '08:00-18:00',
        friday: '08:00-18:00',
        saturday: '09:00-14:00',
        sunday: 'closed',
      }),
    },
  });

  const clinic2 = await prisma.clinic.create({
    data: {
      id: clinic2Id,
      name: 'City Health Clinic',
      address: '456 Downtown Ave, New York, NY 10001',
      phone: '(212) 555-0200',
      email: 'admin@cityhealth.com',
      operatingHours: JSON.stringify({
        monday: '07:00-19:00',
        tuesday: '07:00-19:00',
        wednesday: '07:00-19:00',
        thursday: '07:00-19:00',
        friday: '07:00-19:00',
        saturday: 'closed',
        sunday: 'closed',
      }),
    },
  });

  console.log(`[seed] ✓ created 2 clinics`);

  // ============================================================================
  // SEED USERS
  // ============================================================================
  const passwordHash = await bcrypt.hash('TestPassword123!', 10);

  const admin1 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'admin@harmony-medical.com',
      name: 'Dr. Sarah Johnson',
      title: 'Clinic Administrator',
      role: 'admin',
      clinicId: clinic1.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  const clinician1 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'dr.smith@harmony-medical.com',
      name: 'Dr. Michael Smith',
      title: 'Chief Clinician',
      role: 'clinician',
      clinicId: clinic1.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  const clinician2 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'dr.williams@harmony-medical.com',
      name: 'Dr. Emily Williams',
      title: 'Clinician',
      role: 'clinician',
      clinicId: clinic1.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  const billing1 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'billing@harmony-medical.com',
      name: 'James Brown',
      title: 'Billing Manager',
      role: 'billing',
      clinicId: clinic1.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  const support1 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'support@harmony-medical.com',
      name: 'Lisa Anderson',
      title: 'Support Staff',
      role: 'support',
      clinicId: clinic1.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      id: uuid(),
      email: 'admin@cityhealth.com',
      name: 'Dr. Robert Davis',
      title: 'Clinic Director',
      role: 'admin',
      clinicId: clinic2.id,
      passwordHash,
      twoFactorEnabled: false,
    },
  });

  console.log(`[seed] ✓ created 6 users`);

  // ============================================================================
  // SEED CLINIC MEMBERS
  // ============================================================================
  await prisma.clinicMember.createMany({
    data: [
      { clinicId: clinic1.id, userId: admin1.id, role: 'admin' },
      { clinicId: clinic1.id, userId: clinician1.id, role: 'clinician' },
      { clinicId: clinic1.id, userId: clinician2.id, role: 'clinician' },
      { clinicId: clinic1.id, userId: billing1.id, role: 'billing' },
      { clinicId: clinic1.id, userId: support1.id, role: 'support' },
      { clinicId: clinic2.id, userId: admin2.id, role: 'admin' },
    ],
  });

  console.log(`[seed] ✓ created 6 clinic members`);

  // ============================================================================
  // SEED CLINIC INVITES
  // ============================================================================
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.clinicInvite.createMany({
    data: [
      {
        clinicId: clinic1.id,
        email: 'newyear@example.com',
        role: 'clinician',
        token: uuid(),
        expiresAt: tomorrow,
      },
      {
        clinicId: clinic1.id,
        email: 'newbilling@example.com',
        role: 'billing',
        token: uuid(),
        expiresAt: tomorrow,
      },
    ],
  });

  console.log(`[seed] ✓ created 2 clinic invites`);

  // ============================================================================
  // SEED PATIENTS
  // ============================================================================
  const patients = await prisma.patient.createMany({
    data: [
      {
        clinicId: clinic1.id,
        name: 'John Patterson',
        email: 'john.patterson@email.com',
        phone: '(206) 555-1001',
        dateOfBirth: new Date('1975-03-15'),
        gender: 'male',
        address: '1001 Pine St, Seattle, WA 98101',
        condition: 'Hypertension',
        department: 'Cardiology',
        status: 'active',
        insuranceId: 'INS-001-2024',
        bloodType: 'O+',
        allergies: 'Penicillin',
        vitals: { weight: 85, height: 180, bp: '140/90', pulse: 72 },
      },
      {
        clinicId: clinic1.id,
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '(206) 555-1002',
        dateOfBirth: new Date('1982-07-22'),
        gender: 'female',
        address: '2002 Oak Ave, Seattle, WA 98102',
        condition: 'Type 2 Diabetes',
        department: 'Endocrinology',
        status: 'active',
        insuranceId: 'INS-002-2024',
        bloodType: 'A+',
        allergies: 'None',
        vitals: { weight: 72, height: 165, bp: '128/82', pulse: 68 },
      },
      {
        clinicId: clinic1.id,
        name: 'Robert Chen',
        email: 'robert.chen@email.com',
        phone: '(206) 555-1003',
        dateOfBirth: new Date('1968-11-08'),
        gender: 'male',
        address: '3003 Elm St, Seattle, WA 98103',
        condition: 'COPD',
        department: 'Pulmonology',
        status: 'active',
        insuranceId: 'INS-003-2024',
        bloodType: 'B+',
        allergies: 'Sulfonamides',
        vitals: { weight: 78, height: 175, bp: '135/85', pulse: 80 },
      },
      {
        clinicId: clinic1.id,
        name: 'Jennifer Lee',
        email: 'jennifer.lee@email.com',
        phone: '(206) 555-1004',
        dateOfBirth: new Date('1990-05-12'),
        gender: 'female',
        address: '4004 Maple Dr, Seattle, WA 98104',
        condition: 'Anxiety Disorder',
        department: 'Psychiatry',
        status: 'active',
        insuranceId: 'INS-004-2024',
        bloodType: 'AB+',
        allergies: 'NSAIDs',
        vitals: { weight: 65, height: 162, bp: '118/76', pulse: 74 },
      },
      {
        clinicId: clinic1.id,
        name: 'David Martinez',
        email: 'david.martinez@email.com',
        phone: '(206) 555-1005',
        dateOfBirth: new Date('1955-01-30'),
        gender: 'male',
        address: '5005 Cedar Ln, Seattle, WA 98105',
        condition: 'Chronic Kidney Disease',
        department: 'Nephrology',
        status: 'inactive',
        insuranceId: 'INS-005-2024',
        bloodType: 'O-',
        allergies: 'ACE Inhibitors',
        vitals: { weight: 88, height: 178, bp: '145/92', pulse: 76 },
      },
      {
        clinicId: clinic2.id,
        name: 'Amanda Taylor',
        email: 'amanda.taylor@email.com',
        phone: '(212) 555-2001',
        dateOfBirth: new Date('1988-09-18'),
        gender: 'female',
        address: '100 Central Park South, New York, NY 10001',
        condition: 'Migraine',
        department: 'Neurology',
        status: 'active',
        insuranceId: 'INS-006-2024',
        bloodType: 'B-',
        allergies: 'Codeine',
        vitals: { weight: 68, height: 168, bp: '125/80', pulse: 70 },
      },
    ],
  });

  console.log(`[seed] ✓ created 6 patients`);

  // Get patient IDs for relationships
  const patientIds = await prisma.patient.findMany({
    where: { clinicId: clinic1.id },
    select: { id: true },
  });

  // ============================================================================
  // SEED APPOINTMENTS
  // ============================================================================
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await prisma.appointment.createMany({
    data: [
      {
        clinicId: clinic1.id,
        patientId: patientIds[0].id,
        doctorId: clinician1.id,
        title: 'Hypertension Check-up',
        description: 'Regular blood pressure monitoring',
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 30 * 60 * 1000),
        status: 'scheduled',
        type: 'checkup',
        room: 'Room 101',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[1].id,
        doctorId: clinician1.id,
        title: 'Diabetes Management',
        description: 'Glucose levels and medication review',
        startTime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        status: 'scheduled',
        type: 'consultation',
        room: 'Room 102',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[2].id,
        doctorId: clinician2.id,
        title: 'COPD Follow-up',
        description: 'Lung function assessment',
        startTime: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        status: 'scheduled',
        type: 'follow-up',
        room: 'Room 103',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[0].id,
        doctorId: clinician1.id,
        title: 'Post-treatment Review',
        description: 'Check medication effectiveness',
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
        status: 'completed',
        type: 'follow-up',
        room: 'Room 101',
      },
    ],
  });

  console.log(`[seed] ✓ created 4 appointments`);

  // ============================================================================
  // SEED MEDICAL RECORDS
  // ============================================================================
  await prisma.medicalRecord.createMany({
    data: [
      {
        clinicId: clinic1.id,
        patientId: patientIds[0].id,
        name: 'Blood Pressure Report - Jan 2024',
        type: 'report',
        category: 'diagnosis',
        fileUrl: 'https://example.com/files/bp-report-jan-2024.pdf',
        fileSize: 2048,
        mimeType: 'application/pdf',
        uploadedBy: clinician1.id,
        notes: 'Elevated BP readings, medication adjusted',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[1].id,
        name: 'Lab Results - HbA1c Test',
        type: 'lab-result',
        category: 'lab',
        fileUrl: 'https://example.com/files/hba1c-test-2024.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        uploadedBy: clinician1.id,
        notes: 'HbA1c at 6.8%, within target range',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[2].id,
        name: 'Chest X-ray - 2024',
        type: 'imaging',
        category: 'imaging',
        fileUrl: 'https://example.com/files/chest-xray-2024.jpg',
        fileSize: 5120,
        mimeType: 'image/jpeg',
        uploadedBy: clinician2.id,
        notes: 'Mild hyperinflation consistent with COPD',
      },
    ],
  });

  console.log(`[seed] ✓ created 3 medical records`);

  // ============================================================================
  // SEED INVOICES
  // ============================================================================
  await prisma.invoice.createMany({
    data: [
      {
        clinicId: clinic1.id,
        patientId: patientIds[0].id,
        invoiceNumber: 'INV-2024-001',
        status: 'paid',
        totalAmount: 350.0,
        paidAmount: 350.0,
        currency: 'USD',
        dueDate: new Date('2024-02-15'),
        paidAt: new Date('2024-02-10'),
        lineItems: JSON.stringify([
          { description: 'Office Visit', quantity: 1, unitPrice: 150, amount: 150 },
          { description: 'Blood Work', quantity: 1, unitPrice: 200, amount: 200 },
        ]),
        notes: 'Payment received in full',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[1].id,
        invoiceNumber: 'INV-2024-002',
        status: 'sent',
        totalAmount: 425.0,
        paidAmount: 0,
        currency: 'USD',
        dueDate: new Date('2024-02-28'),
        lineItems: JSON.stringify([
          { description: 'Office Visit', quantity: 1, unitPrice: 150, amount: 150 },
          { description: 'HbA1c Test', quantity: 1, unitPrice: 125, amount: 125 },
          { description: 'Medication Prescription', quantity: 1, unitPrice: 150, amount: 150 },
        ]),
        notes: 'Awaiting payment',
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[2].id,
        invoiceNumber: 'INV-2024-003',
        status: 'draft',
        totalAmount: 500.0,
        paidAmount: 0,
        currency: 'USD',
        dueDate: new Date('2024-03-15'),
        lineItems: JSON.stringify([
          { description: 'Pulmonary Function Test', quantity: 1, unitPrice: 300, amount: 300 },
          { description: 'Office Visit', quantity: 1, unitPrice: 150, amount: 150 },
          { description: 'Imaging Report', quantity: 1, unitPrice: 50, amount: 50 },
        ]),
        notes: 'Not yet sent to patient',
      },
    ],
  });

  console.log(`[seed] ✓ created 3 invoices`);

  // ============================================================================
  // SEED INVENTORY
  // ============================================================================
  await prisma.inventoryItem.createMany({
    data: [
      {
        clinicId: clinic1.id,
        name: 'Disposable Gloves (Nitrile)',
        sku: 'GLOVE-NITRILE-100',
        category: 'PPE',
        quantity: 500,
        reorderLevel: 100,
        unit: 'boxes',
        supplier: 'MedSupply Co.',
        cost: 15.0,
        status: 'in-stock',
        notes: 'Standard nitrile gloves, powder-free',
      },
      {
        clinicId: clinic1.id,
        name: 'Face Masks (N95)',
        sku: 'MASK-N95-50',
        category: 'PPE',
        quantity: 45,
        reorderLevel: 50,
        unit: 'boxes',
        supplier: 'SafeHealth Inc.',
        cost: 28.0,
        status: 'low-stock',
        notes: 'N95 masks for respiratory protection',
      },
      {
        clinicId: clinic1.id,
        name: 'Syringes (10ml)',
        sku: 'SYRINGE-10ML',
        category: 'Medical Supplies',
        quantity: 200,
        reorderLevel: 100,
        unit: 'boxes',
        supplier: 'Clinical Resources Ltd.',
        cost: 8.5,
        status: 'in-stock',
        notes: 'Sterile, single-use syringes',
      },
      {
        clinicId: clinic1.id,
        name: 'Bandages (Sterile)',
        sku: 'BANDAGE-STERILE',
        category: 'Wound Care',
        quantity: 5,
        reorderLevel: 25,
        unit: 'boxes',
        supplier: 'MedSupply Co.',
        cost: 12.0,
        status: 'out-of-stock',
        notes: 'Urgent reorder needed',
      },
      {
        clinicId: clinic1.id,
        name: 'Saline Solution (500ml)',
        sku: 'SALINE-500ML',
        category: 'Solutions',
        quantity: 150,
        reorderLevel: 50,
        unit: 'bottles',
        supplier: 'PharmaCare Solutions',
        cost: 5.0,
        status: 'in-stock',
        expiryDate: new Date('2025-06-30'),
        notes: 'Sterile, isotonic saline',
      },
    ],
  });

  console.log(`[seed] ✓ created 5 inventory items`);

  // ============================================================================
  // SEED RISK SCORES
  // ============================================================================
  await prisma.riskScore.createMany({
    data: [
      {
        clinicId: clinic1.id,
        patientId: patientIds[0].id,
        analysisTitle: 'Cardiovascular Risk Assessment',
        riskLevel: 'high',
        score: 72.5,
        factors: JSON.stringify([
          { factor: 'Hypertension', score: 85, weight: 0.4 },
          { factor: 'Age > 60', score: 65, weight: 0.3 },
          { factor: 'Smoking History', score: 55, weight: 0.2 },
          { factor: 'BMI', score: 60, weight: 0.1 },
        ]),
        recommendations: 'Increase BP monitoring, consider additional medications',
        createdBy: clinician1.id,
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[1].id,
        analysisTitle: 'Diabetes Complication Risk',
        riskLevel: 'medium',
        score: 45.3,
        factors: JSON.stringify([
          { factor: 'HbA1c Level', score: 52, weight: 0.4 },
          { factor: 'Duration of Diabetes', score: 38, weight: 0.3 },
          { factor: 'Kidney Function', score: 42, weight: 0.2 },
          { factor: 'Eye Health', score: 40, weight: 0.1 },
        ]),
        recommendations: 'Continue current treatment plan, annual screening',
        createdBy: clinician1.id,
      },
      {
        clinicId: clinic1.id,
        patientId: patientIds[3].id,
        analysisTitle: 'Mental Health Risk Assessment',
        riskLevel: 'low',
        score: 28.1,
        factors: JSON.stringify([
          { factor: 'Anxiety Score', score: 35, weight: 0.5 },
          { factor: 'Social Support', score: 72, weight: 0.3 },
          { factor: 'Medication Compliance', score: 88, weight: 0.2 },
        ]),
        recommendations: 'Continue current therapy, good prognosis',
        createdBy: clinician1.id,
      },
    ],
  });

  console.log(`[seed] ✓ created 3 risk scores`);

  // ============================================================================
  // SEED AUDIT LOGS
  // ============================================================================
  await prisma.auditLog.createMany({
    data: [
      {
        clinicId: clinic1.id,
        userId: admin1.id,
        entity: 'Clinic',
        entityId: clinic1.id,
        action: 'create',
        reason: 'Clinic registration',
      },
      {
        clinicId: clinic1.id,
        userId: clinician1.id,
        entity: 'Patient',
        entityId: patientIds[0].id,
        action: 'create',
        changes: JSON.stringify({
          before: null,
          after: { name: 'John Patterson', condition: 'Hypertension' },
        }),
      },
      {
        clinicId: clinic1.id,
        userId: clinician1.id,
        entity: 'Appointment',
        entityId: 'apt-001',
        action: 'create',
        reason: 'Patient scheduled for check-up',
      },
      {
        clinicId: clinic1.id,
        userId: billing1.id,
        entity: 'Invoice',
        entityId: 'inv-001',
        action: 'create',
        reason: 'Monthly billing cycle',
      },
    ],
  });

  console.log(`[seed] ✓ created 4 audit logs`);

  console.log('[seed] ✅ database seeded successfully');
}

main()
  .catch((e) => {
    console.error('[seed] ❌ error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
