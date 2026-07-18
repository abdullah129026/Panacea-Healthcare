import { Router, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /patients - List all patients (clinic-scoped)
router.get('/', async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      return res.status(401).json({ success: false, error: 'Clinic ID required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const patients = await prisma.patient.findMany({
      where: { clinicId, deactivatedAt: null },
      skip: (page - 1) * size,
      take: size,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.patient.count({
      where: { clinicId, deactivatedAt: null },
    });

    res.json({
      success: true,
      data: {
        items: patients,
        total,
        page,
        hasMore: page * size < total,
      },
    });
  } catch (error) {
    console.error('[patients/getPatients]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch patients' });
  }
});

// GET /patients/:id - Get single patient
router.get('/:id', async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      return res.status(401).json({ success: false, error: 'Clinic ID required' });
    }

    const patient = await prisma.patient.findFirst({
      where: {
        id: req.params.id,
        clinicId,
        deactivatedAt: null,
      },
    });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('[patients/getPatient]', error);
    res.status(500).json({ success: false, error: 'Failed to fetch patient' });
  }
});

// POST /patients - Create new patient
router.post('/', async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clinicId = req.user?.clinicId;
    const userId = req.user?.userId;
    if (!clinicId || !userId) {
      return res.status(401).json({ success: false, error: 'Clinic ID required' });
    }

    const { name, gender, phone, email, condition, department, status } = req.body;

    const patient = await prisma.patient.create({
      data: {
        clinicId,
        name,
        gender,
        phone,
        email,
        condition,
        department,
        status: status || 'active',
      },
    });

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    console.error('[patients/createPatient]', error);
    res.status(500).json({ success: false, error: 'Failed to create patient' });
  }
});

// PATCH /patients/:id - Update patient
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      return res.status(401).json({ success: false, error: 'Clinic ID required' });
    }

    const patient = await prisma.patient.updateMany({
      where: {
        id: req.params.id,
        clinicId,
        deactivatedAt: null,
      },
      data: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    if (patient.count === 0) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const updated = await prisma.patient.findUnique({
      where: { id: req.params.id },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[patients/updatePatient]', error);
    res.status(500).json({ success: false, error: 'Failed to update patient' });
  }
});

// DELETE /patients/:id - Soft delete patient
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      return res.status(401).json({ success: false, error: 'Clinic ID required' });
    }

    await prisma.patient.updateMany({
      where: {
        id: req.params.id,
        clinicId,
        deactivatedAt: null,
      },
      data: {
        deactivatedAt: new Date(),
      },
    });

    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    console.error('[patients/deletePatient]', error);
    res.status(500).json({ success: false, error: 'Failed to delete patient' });
  }
});

export default router;
