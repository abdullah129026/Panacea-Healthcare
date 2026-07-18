import type { ISODateString, TenantScoped } from "./common";

/** User's profile settings — name, contact, preferences. */
export type UserProfile = TenantScoped & {
  id: string;
  name: string;
  title?: string;
  email: string;
  language: "en" | "es" | "fr";
  timezone: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY";
  interfaceMode?: "standard" | "night-shift" | "dynamic";
};

/** User's security settings — 2FA, sessions, password history. */
export type SecuritySettings = TenantScoped & {
  userId: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: "authenticator" | "sms";
  activeSessions: Session[];
  loginHistory: LoginRecord[];
};

export type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: ISODateString;
  isCurrent: boolean;
};

export type LoginRecord = {
  timestamp: ISODateString;
  location: string;
  device: string;
  status: "success" | "failed";
};

/** 2FA setup response (transient, returned during setup flow). */
export type TwoFactorSetup = {
  method: "authenticator" | "sms";
  qrCode?: string; // Base64 QR code for authenticator
  phoneNumber?: string; // For SMS verification
  tempSecret?: string; // Temporary secret during setup
};

/** Clinic member information. */
export type ClinicMember = {
  id: string;
  userId: string;
  clinicId: string;
  name: string;
  email: string;
  role: "clinician" | "admin" | "support" | "billing";
  status: "active" | "pending" | "inactive";
  lastActive?: ISODateString;
  invitedAt?: ISODateString;
  joinedAt?: ISODateString;
};

/** Pending clinic invite. */
export type ClinicInvite = {
  id: string;
  clinicId: string;
  email: string;
  role: "clinician" | "admin" | "support" | "billing";
  status: "pending" | "accepted" | "expired";
  invitedAt: ISODateString;
  expiresAt: ISODateString;
  acceptedAt?: ISODateString;
};

/** User's notification channel + trigger preferences. */
export type NotificationPreferences = TenantScoped & {
  userId: string;
  channels: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
  };
  triggers: {
    criticalAlerts: boolean;
    vitalOutOfRange: boolean;
    statLabResults: boolean;
    emergencyAdmissions: boolean;
    appointmentBookings: boolean;
    appointmentCancellations: boolean;
    appointmentReminders: boolean;
    staffChat: boolean;
    patientInquiries: boolean;
    insuranceLiaison: boolean;
  };
  doNotDisturbStart?: string; // "22:00"
  doNotDisturbEnd?: string;   // "06:00"
};

/** Clinic's operational info — name, address, contact, hours, licenses. */
export type ClinicInfo = {
  id: string;
  name: string;
  facilityId: string;
  address: string;
  phone: string;
  emergencyLine: string;
  adminEmail: string;
  operatingHours: OperatingHours;
  licenses: License[];
  serviceArea?: {
    populationHealth: number;
    emergencyProximity: string;
  };
};

export type OperatingHours = {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
};

export type TimeRange = {
  open: string; // "08:00"
  close: string; // "17:00"
};

export type License = {
  id: string;
  type: string;
  issuer: string;
  issueDate: ISODateString;
  expiryDate: ISODateString;
  status: "active" | "expiring-soon" | "expired";
};

/** Clinic's billing configuration — subscription, usage, payment methods. */
export type BillingSettings = {
  clinicId: string;
  subscription: SubscriptionInfo;
  usage: UsageBreakdown;
  paymentMethods: PaymentMethod[];
  billingAddress: BillingAddress;
  invoices: BillingInvoice[];
};

export type SubscriptionInfo = {
  planName: string;
  planId: string;
  pricePerYear: number;
  currentPeriodStart: ISODateString;
  currentPeriodEnd: ISODateString;
  status: "active" | "past-due" | "cancelled";
};

export type UsageBreakdown = {
  basePlatform: number;
  aiProcessing: number;
  cloudStorage: number;
  billingPeriodStart: ISODateString;
  billingPeriodEnd: ISODateString;
};

export type PaymentMethod = {
  id: string;
  type: "card" | "bank-account";
  last4: string;
  brand?: string; // "Visa", "Mastercard", etc.
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
};

export type BillingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
};

export type BillingInvoice = {
  id: string;
  invoiceNumber: string;
  date: ISODateString;
  amount: number;
  status: "paid" | "pending" | "overdue";
  paidDate?: ISODateString;
  paymentMethod: string;
};
