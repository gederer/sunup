import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Sunup Platform - Convex Schema
 *
 * Core entities:
 * - Organizations: Households, companies, nonprofits, etc.
 * - People: Individuals who belong to organizations
 * - Projects: Solar installations (and future project types) for organizations
 * - Users: System users (Setters, Consultants, PMs, etc.)
 */

export default defineSchema({
  // ============================================
  // ORGANIZATIONS
  // ============================================
  organizations: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("Residential"),
      v.literal("Commercial"),
      v.literal("Nonprofit"),
      v.literal("Government"),
      v.literal("Educational")
    ),
    taxId: v.optional(v.string()), // For non-residential
    billingAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    primaryContactPersonId: v.optional(v.id("people")),
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_type", ["type"])
    .index("by_primary_contact", ["primaryContactPersonId"]),

  // ============================================
  // PEOPLE
  // ============================================
  people: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_email", ["email"])
    .index("by_tenant_and_email", ["tenantId", "email"]),

  // ============================================
  // ORGANIZATION MEMBERS (Many-to-Many)
  // ============================================
  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    personId: v.id("people"),
    role: v.optional(v.string()), // Owner, Employee, Facilities Manager, etc.
    isBillingContact: v.boolean(),
    tenantId: v.id("tenants"),
  })
    .index("by_organization", ["organizationId"])
    .index("by_person", ["personId"])
    .index("by_tenant", ["tenantId"])
    .index("by_org_and_person", ["organizationId", "personId"]),

  // ============================================
  // PROJECTS
  // ============================================
  projects: defineTable({
    projectType: v.union(
      v.literal("Solar Installation"),
      v.literal("Battery Storage"),
      v.literal("EV Charger"),
      v.literal("Other")
    ),
    organizationId: v.id("organizations"),
    projectName: v.string(),
    locationAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    systemSizeKw: v.optional(v.number()),
    equipmentSpecs: v.optional(
      v.object({
        panels: v.optional(
          v.object({
            quantity: v.number(),
            make: v.string(),
            model: v.string(),
            wattage: v.number(),
          })
        ),
        inverters: v.optional(
          v.object({
            quantity: v.number(),
            make: v.string(),
            model: v.string(),
          })
        ),
        batteries: v.optional(
          v.object({
            quantity: v.number(),
            make: v.string(),
            model: v.string(),
            capacityKwh: v.number(),
          })
        ),
        racking: v.optional(v.string()),
        other: v.optional(v.string()),
      })
    ),
    pipelineStage: v.string(), // Configurable stages per tenant
    primaryContactPersonId: v.optional(v.id("people")),
    // Sale information
    consultantUserId: v.optional(v.id("users")),
    saleDate: v.optional(v.number()), // timestamp
    saleAmount: v.optional(v.number()),
    // Timeline
    estimatedCompletionDate: v.optional(v.number()), // timestamp
    actualCompletionDate: v.optional(v.number()), // timestamp
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_organization", ["organizationId"])
    .index("by_tenant", ["tenantId"])
    .index("by_pipeline_stage", ["pipelineStage"])
    .index("by_tenant_and_stage", ["tenantId", "pipelineStage"])
    .index("by_primary_contact", ["primaryContactPersonId"])
    .index("by_consultant", ["consultantUserId"]),

  // ============================================
  // PROJECT CONTACTS (Many-to-Many)
  // ============================================
  projectContacts: defineTable({
    projectId: v.id("projects"),
    personId: v.id("people"),
    role: v.optional(v.string()), // Decision Maker, Technical Contact, Billing Contact, etc.
    isPrimaryContact: v.boolean(),
    tenantId: v.id("tenants"),
  })
    .index("by_project", ["projectId"])
    .index("by_person", ["personId"])
    .index("by_tenant", ["tenantId"])
    .index("by_project_and_person", ["projectId", "personId"]),

  // ============================================
  // SITE SURVEYS
  // ============================================
  projectSiteSurveys: defineTable({
    projectId: v.id("projects"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    surveyType: v.union(v.literal("self_service"), v.literal("professional")),
    // Photos stored as array of cloud storage URLs
    photos: v.array(
      v.object({
        category: v.string(), // roof_overview, electrical_panel, roof_structure, etc.
        url: v.string(),
        thumbnailUrl: v.optional(v.string()),
        uploadedByPersonId: v.id("people"),
        uploadedAt: v.number(), // timestamp
        aiQualityScore: v.optional(v.number()), // 0-100
        aiAnalysis: v.optional(
          v.object({
            isBlurry: v.boolean(),
            hasGlare: v.boolean(),
            subjectDetected: v.boolean(),
            suggestions: v.array(v.string()),
          })
        ),
      })
    ),
    // Measurements and data
    measurements: v.optional(
      v.object({
        roofBeamSpacing: v.optional(
          v.object({
            value: v.number(),
            unit: v.string(), // inches, cm
          })
        ),
        roofDimensions: v.optional(
          v.object({
            length: v.number(),
            width: v.number(),
            unit: v.string(), // feet, meters
          })
        ),
        electricalPanelCapacity: v.optional(v.number()), // amps
        availableBreakerSlots: v.optional(v.number()),
        roofAge: v.optional(v.number()), // years
        roofMaterial: v.optional(v.string()),
        hasHOARestrictions: v.optional(v.boolean()),
        shadingIssues: v.optional(v.string()),
        additionalNotes: v.optional(v.string()),
      })
    ),
    // Review tracking
    submittedAt: v.optional(v.number()), // timestamp
    reviewedByUserId: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()), // timestamp
    approvedAt: v.optional(v.number()), // timestamp
    reviewNotes: v.optional(v.string()),
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_project", ["projectId"])
    .index("by_status", ["status"])
    .index("by_tenant", ["tenantId"]),

  // ============================================
  // SURVEY CONTRIBUTIONS
  // ============================================
  surveyContributions: defineTable({
    surveyId: v.id("projectSiteSurveys"),
    personId: v.id("people"),
    contributionType: v.union(
      v.literal("photos"),
      v.literal("measurements"),
      v.literal("notes")
    ),
    contributionDetails: v.optional(v.string()), // JSON string for flexibility
    tenantId: v.id("tenants"),
  })
    .index("by_survey", ["surveyId"])
    .index("by_person", ["personId"])
    .index("by_tenant", ["tenantId"]),

  // ============================================
  // COMMUNICATIONS
  // ============================================
  communications: defineTable({
    userId: v.id("users"), // Setter, Consultant, PM, Support, etc.
    personId: v.id("people"),
    organizationId: v.optional(v.id("organizations")),
    projectId: v.optional(v.id("projects")), // NULL if pre-project discussion
    communicationType: v.union(
      v.literal("call"),
      v.literal("email"),
      v.literal("sms"),
      v.literal("in_app_message"),
      v.literal("meeting")
    ),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    subject: v.optional(v.string()),
    content: v.string(),
    // Call/meeting specific
    duration: v.optional(v.number()), // seconds
    recordingUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    // Disposition (for structured communications like SunDesk)
    disposition: v.optional(v.string()),
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_user", ["userId"])
    .index("by_person", ["personId"])
    .index("by_organization", ["organizationId"])
    .index("by_project", ["projectId"])
    .index("by_tenant", ["tenantId"])
    .index("by_type", ["communicationType"]),

  // ============================================
  // USERS (System users - Setters, Consultants, PMs, etc.)
  // ============================================
  users: defineTable({
    clerkId: v.string(), // Using Clerk for auth
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    isActive: v.boolean(),
    // Multi-tenant support
    tenantId: v.id("tenants"),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_tenant", ["tenantId"]),

  // ============================================
  // USER ROLES (Many-to-Many)
  // ============================================
  userRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("Setter"),
      v.literal("Setter Trainee"),
      v.literal("Setter Manager"),
      v.literal("Consultant"),
      v.literal("Sales Manager"),
      v.literal("Lead Manager"),
      v.literal("Project Manager"),
      v.literal("Installer"),
      v.literal("Support Staff"),
      v.literal("Recruiter"),
      v.literal("Trainer"),
      v.literal("System Administrator"),
      v.literal("Executive"),
      v.literal("Finance"),
      v.literal("Operations")
    ),
    isActive: v.boolean(), // Role can be active/inactive independently
    isPrimary: v.boolean(), // Primary role for the user (for UI defaults)
    tenantId: v.id("tenants"),
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_tenant", ["tenantId"])
    .index("by_user_and_role", ["userId", "role"])
    .index("by_tenant_and_role", ["tenantId", "role"]),

  // ============================================
  // TENANTS (Multi-tenant support)
  // ============================================
  tenants: defineTable({
    name: v.string(), // Company name (e.g., "ABC Solar Installers")
    domain: v.optional(v.string()), // Custom domain
    settings: v.optional(
      v.object({
        // Pipeline configuration
        pipelineStages: v.optional(
          v.array(
            v.object({
              name: v.string(),
              order: v.number(),
              category: v.string(), // sales, project_management, installation
            })
          )
        ),
        // Commission configuration
        commissionRules: v.optional(v.string()), // JSON config
        // Other tenant-specific settings
      })
    ),
    isActive: v.boolean(),
  }).index("by_domain", ["domain"]),

  // ============================================
  // PIPELINE EVENTS (Event-driven architecture)
  // ============================================
  pipelineEvents: defineTable({
    projectId: v.id("projects"),
    eventType: v.string(), // stage_changed, status_updated, etc.
    fromStage: v.optional(v.string()),
    toStage: v.optional(v.string()),
    triggeredByUserId: v.id("users"),
    eventData: v.optional(v.string()), // JSON for additional data
    tenantId: v.id("tenants"),
  })
    .index("by_project", ["projectId"])
    .index("by_tenant", ["tenantId"])
    .index("by_event_type", ["eventType"]),

  // ============================================
  // CAMPAIGNS (Sundialer)
  // ============================================
  campaigns: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    // Lead assignment settings
    assignmentType: v.union(
      v.literal("manual"),
      v.literal("round_robin"),
      v.literal("effort_based")
    ),
    tenantId: v.id("tenants"),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_active", ["isActive"]),

  // ============================================
  // LEADS (Pre-project contacts)
  // ============================================
  leads: defineTable({
    personId: v.id("people"),
    organizationId: v.optional(v.id("organizations")),
    source: v.string(), // Indeed, LinkedIn, referral, website, etc.
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("appointment_set"),
      v.literal("converted"),
      v.literal("lost")
    ),
    campaignId: v.optional(v.id("campaigns")),
    assignedSetterUserId: v.optional(v.id("users")),
    tenantId: v.id("tenants"),
  })
    .index("by_person", ["personId"])
    .index("by_status", ["status"])
    .index("by_campaign", ["campaignId"])
    .index("by_setter", ["assignedSetterUserId"])
    .index("by_tenant", ["tenantId"]),

  // ============================================
  // APPOINTMENTS
  // ============================================
  appointments: defineTable({
    leadId: v.optional(v.id("leads")),
    personId: v.id("people"),
    organizationId: v.optional(v.id("organizations")),
    consultantUserId: v.id("users"),
    scheduledFor: v.number(), // timestamp
    duration: v.number(), // minutes
    meetingType: v.union(
      v.literal("initial_consultation"),
      v.literal("follow_up"),
      v.literal("design_review"),
      v.literal("other")
    ),
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("no_show"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
    meetingLink: v.optional(v.string()), // WebRTC room URL
    notes: v.optional(v.string()),
    tenantId: v.id("tenants"),
  })
    .index("by_consultant", ["consultantUserId"])
    .index("by_person", ["personId"])
    .index("by_scheduled_for", ["scheduledFor"])
    .index("by_status", ["status"])
    .index("by_tenant", ["tenantId"]),
});
