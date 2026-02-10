
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SERVICES = 'SERVICES',
  CONCIERGE = 'CONCIERGE',
  CREATIVE = 'CREATIVE',
  PLANS = 'PLANS',
  FINANCE = 'FINANCE',
  REPORTS = 'REPORTS',
  ADMIN = 'ADMIN',
  ABOUT = 'ABOUT',
  RESIDENTS = 'RESIDENTS',
  PATRIMONY = 'PATRIMONY',
  VEHICLES = 'VEHICLES',
  DELIVERIES = 'DELIVERIES',
  RESERVATIONS = 'RESERVATIONS',
  LOGIN = 'LOGIN',
  CREATE_CONDO = 'CREATE_CONDO',
  BILLING = 'BILLING'
}

export enum PlanType {
  NONE = 'NONE',
  ESSENTIAL = 'Essencial',
  PROFESSIONAL = 'Profissional',
  PREMIUM_AI = 'Premium AI'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  TRIAL = 'trial'
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CONDO_ADMIN = 'CONDO_ADMIN',
  RESIDENT = 'RESIDENT'
}

export interface CondoData {
  id?: string;
  name: string;
  cnpj: string;
  adminName: string;
  syndicName: string;
  logoUrl?: string;
  subscriptionStatus?: SubscriptionStatus;
  currentPlan?: PlanType;
  staff: { id: string; name: string; phone: string; email: string; role: string }[];
}

export interface User {
  id?: string;
  name: string;
  photo: string;
  role: UserRole;
  plan: PlanType;
  condominio_id?: string;
}

export interface Alert {
  id: string;
  type: 'RECIBO' | 'ORCAMENTO' | 'ENQUETE';
  title: string;
  description: string;
  timestamp: Date;
  completed: boolean;
  pollOptions?: string[];
  pollVotes?: number[];
  deadline?: string;
  hasVoted?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Morador' | 'Gestão' | 'Financeiro' | 'Segurança';
  minPlan: PlanType;
  allowedRoles: UserRole[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
