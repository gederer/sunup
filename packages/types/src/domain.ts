/**
 * Domain Business Logic Types
 *
 * This module contains business logic types that are used across the application
 * but are not directly tied to the database schema.
 */

// Role types
export type Role =
  | 'admin'
  | 'finance'
  | 'sales_manager'
  | 'setter_manager'
  | 'setter'
  | 'consultant'
  | 'install_manager'
  | 'installer'
  | 'closer_manager'
  | 'closer'
  | 'viewer'
  | 'support';

// Pipeline stage types
export type PipelineStage =
  | 'lead'
  | 'contacted'
  | 'qualified'
  | 'appointment_set'
  | 'appointment_held'
  | 'proposal_sent'
  | 'contract_signed'
  | 'install_scheduled'
  | 'install_complete'
  | 'closed_won'
  | 'closed_lost';

// Call status types
export type CallStatus =
  | 'queued'
  | 'connecting'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'no_answer'
  | 'busy'
  | 'voicemail';

// Call disposition types
export type CallDisposition =
  | 'qualified'
  | 'not_qualified'
  | 'callback'
  | 'wrong_number'
  | 'no_answer'
  | 'voicemail'
  | 'do_not_call';

// Appointment status types
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'rescheduled';

// Commission status types
export type CommissionStatus =
  | 'pending'
  | 'approved'
  | 'paid'
  | 'disputed'
  | 'rejected';

// Availability status types
export type AvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'busy'
  | 'break'
  | 'offline';
