/**
 * Reports & Analytics domain types.
 * Represents clinical performance, outcomes, and operational metrics.
 */

export interface ClinicalOutcome {
  department: string;
  recovery: number;
  benchmark: number;
}

export interface PerformanceMetric {
  label: string;
  value: number;
  color: string;
}

export interface DepartmentPerformance {
  name: string;
  patients: number;
  successRate: number;
  revenue: number;
  status: "OPTIMAL" | "STABLE" | "ATTENTION" | "CRITICAL";
}

export interface ReportMetrics {
  totalPatients: number;
  totalRevenue: number;
  averageStay: number;
  satisfactionScore: number;
  operationalEfficiency: number;
  patientsChange: number;
  revenueChange: number;
  stayChange: number;
  satisfactionChange: number;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  period: string;
  metrics: ReportMetrics;
  outcomes: ClinicalOutcome[];
  performanceMetrics: PerformanceMetric[];
  departments: DepartmentPerformance[];
}
