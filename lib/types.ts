export interface InboxMessage {
  id: string;
  subject: string;
  sender_name: string | null;
  sender_email: string;
  body: string | null;
  source: "contact_form" | "inbound_email" | "manual";
  status: "unread" | "read" | "replied" | "archived";
  created_at: string;
  notes: string | null;
  lead_id: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  service_interest: string | null;
  status: "new" | "read" | "converted" | "archived";
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  source: string | null;
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  notes: string | null;
  created_at: string;
  client_id: string | null;
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  billing_address: string | null;
  notes: string | null;
  status: "active" | "inactive" | "prospect";
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  service_type: string | null;
  scope_summary: string | null;
  start_date: string | null;
  due_date: string | null;
  status: "discovery" | "active" | "paused" | "complete" | "cancelled";
  agreed_amount: number | null;
  payment_status: "unpaid" | "partial" | "paid";
  notes: string | null;
  created_at: string;
  client?: Client;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  project_id: string | null;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  sent_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  client?: Client;
  project?: Project;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  paid_at: string;
  method: "bank_transfer" | "card" | "paypal" | "other";
  reference: string | null;
  notes: string | null;
  created_at: string;
  invoice?: Invoice;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface Solution {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  order_index: number;
  published: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Note {
  id: string;
  entity_type: "lead" | "client" | "project" | "invoice" | "inbox";
  entity_id: string;
  content: string;
  created_at: string;
}

export interface DashboardStats {
  totalLeads: number;
  activeClients: number;
  activeProjects: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  recentInquiries: InboxMessage[];
  recentInvoices: Invoice[];
}
