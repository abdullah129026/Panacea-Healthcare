/**
 * Dashboard domain types.
 * Aggregated metrics and overview data.
 */

export interface PatientFlowPoint {
  time: string;
  inpatient: number;
  outpatient: number;
}

export interface Alert {
  id: string;
  message: string;
  type: "error" | "warning" | "info";
  time: string;
  read: boolean;
}

export interface RecentPatient {
  name: string;
  id: string;
  department: string;
  status: "Critical" | "Stable" | "Recovering" | "Admitted" | "Observation";
  time: string;
}

export interface UpcomingAppointment {
  id: string;
  patient: string;
  type: string;
  time: string;
  doctor: string;
}

export interface DepartmentMetric {
  name: string;
  patients: number;
  color: string;
}

export interface DashboardMetrics {
  totalPatients: number;
  totalPatientsChange: number;
  todayAppointments: number;
  todayAppointmentsRemaining: number;
  activeAdmissions: number;
  activeAdmissionsChange: number;
  avgWaitTime: number;
  avgWaitTimeChange: number;
}

export interface Dashboard {
  metrics: DashboardMetrics;
  patientFlow: PatientFlowPoint[];
  alerts: Alert[];
  recentPatients: RecentPatient[];
  upcomingAppointments: UpcomingAppointment[];
  departmentMetrics: DepartmentMetric[];
  userName: string;
}
