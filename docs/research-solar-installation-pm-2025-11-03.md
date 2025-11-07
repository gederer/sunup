# Research Report: Solar Installation Project Management Best Practices

**Research Type:** Domain/Industry Research
**Focus Area:** Solar Installation Project Management (SunProject Module)
**Date:** 2025-11-03
**Project:** Sunup Platform
**Researcher:** BMad Analyst Agent

---

## Executive Summary

This research investigates best practices for solar installation project management to inform the design of Sunup's **SunProject** module. The module must support Project Managers in tracking solar installations from post-sale through activation, managing timelines, coordinating with installers, and ensuring compliance with permitting and inspection requirements.

**Key Findings:**
- Standard solar installation timeline: **6-10 weeks** from sale to activation
- **6 major stages** with distinct workflows and stakeholders
- Critical path management around **permitting** and **inspection** bottlenecks
- Need for real-time status updates visible to customers
- Document management for permits, contracts, warranties
- Crew scheduling and coordination
- Multi-stakeholder communication (customer, AHJ, utility, inspectors)

---

## Research Methodology

**Sources:**
1. Web research on solar installation industry standards
2. Solar industry project management resources
3. Workflow analysis from leading solar installers
4. Regulatory compliance requirements (AHJ, utility interconnection)

**Research Questions:**
1. What are the standard stages in a solar installation project?
2. What are typical timelines and bottlenecks?
3. What stakeholders are involved at each stage?
4. What documents and compliance requirements must be tracked?
5. What features do Project Managers need most?

---

## Solar Installation Project Lifecycle

### Timeline Overview

**Total Duration:** 6-10 weeks (post-sale to activation)

```
Sale → Site Survey → Design → Permitting → Installation → Inspection → Interconnection → PTO/Activation
  ↓        ↓          ↓          ↓             ↓             ↓              ↓                ↓
 Day 0   Week 1    Week 2    Weeks 3-5      Week 6       Week 7         Week 8          Weeks 9-10
```

**Note:** Permitting is the most variable stage (1-6 weeks depending on AHJ)

---

## Stage-by-Stage Breakdown

### Stage 1: Site Survey
**Timeline:** Week 1 (3-5 days)
**Owner:** Consultant or PM
**Status after:** Design can begin

**Activities:**
- Physical site assessment OR customer self-service survey
- Roof measurements and structural evaluation
- Electrical panel assessment
- Shading analysis
- Photo documentation
- Identify obstacles or special requirements

**Sunup Features Needed:**
- ✅ Customer self-service site survey app (React Native)
- ✅ AI photo quality analysis
- ✅ Consultant review/approval workflow
- ✅ Survey status tracking (not_started → in_progress → submitted → under_review → approved/rejected)

**Stakeholders:**
- Customer (for self-service)
- Consultant or PM (for review)
- Technical team (for design handoff)

---

### Stage 2: System Design
**Timeline:** Week 2 (5-7 days)
**Owner:** Design Engineer or PM
**Status after:** Ready for permitting

**Activities:**
- CAD layout of panel placement
- Electrical system design (inverter sizing, wiring diagrams)
- Structural engineering calculations
- Equipment selection and specifications
- Energy production estimates
- Preliminary permit package preparation

**Sunup Features Needed:**
- Design file storage (CAD, PDF)
- Equipment specs database integration
- Design approval workflow
- Customer design review portal
- Version control for design iterations

**Stakeholders:**
- Design Engineer
- PM
- Customer (for approval)
- Permitting team (receives package)

**Deliverables:**
- Site plan
- Electrical one-line diagram
- Structural calculations
- Equipment cut sheets
- Energy production estimate

---

### Stage 3: Permitting
**Timeline:** Weeks 3-5 (2-6 weeks, HIGHLY VARIABLE)
**Owner:** Permitting Specialist or PM
**Status after:** Permit issued, ready for installation

**Activities:**
- Submit permit application to AHJ (Authority Having Jurisdiction)
- Respond to plan review comments
- Resubmit corrections
- Track permit status
- Receive approved permit
- Schedule inspections

**Sunup Features Needed:**
- Permit application tracking (submitted → under review → corrections requested → resubmitted → approved)
- Document management for permit packages
- AHJ contact database
- Automated status checks (if AHJ has API)
- Notification system for permit milestones
- Permit expiration tracking

**Stakeholders:**
- AHJ (city/county building department)
- PM or Permitting Specialist
- Design Engineer (for RFI responses)
- Installation team (waiting for approval)

**Bottlenecks:**
- AHJ review times vary wildly (3 days to 6 weeks)
- Plan review comments require design changes
- Multiple resubmissions common
- This is the #1 cause of project delays

---

### Stage 4: Installation
**Timeline:** Week 6 (1-3 days actual work)
**Owner:** Installation Crew Lead
**Status after:** System installed, ready for inspection

**Activities:**
- Schedule installation crew
- Coordinate with customer for site access
- Install racking and mounting
- Install panels
- Install inverter(s) and electrical components
- Run conduit and wiring
- Install monitoring equipment
- Initial system testing
- Customer walkthrough

**Sunup Features Needed:**
- Crew scheduling and dispatch
- Crew assignment (based on availability, skills, location)
- Installation checklist (by project type)
- Photo documentation (before/during/after)
- Equipment inventory tracking
- Time tracking for crew hours
- Customer notifications (crew en route, installation complete)
- Daily progress updates

**Stakeholders:**
- Installation Crew (Installers)
- Crew Lead/Foreman
- PM
- Customer
- Equipment suppliers (for deliveries)

**Deliverables:**
- Installed system
- Installation photos
- As-built documentation (if different from design)

---

### Stage 5: Inspection
**Timeline:** Week 7 (1-2 weeks including scheduling)
**Owner:** PM
**Status after:** System approved, ready for interconnection

**Activities:**
- Schedule inspection with AHJ
- Pre-inspection checklist
- Inspection performed
- Address any deficiencies
- Re-inspection if needed
- Receive inspection approval

**Sunup Features Needed:**
- Inspection scheduling
- Inspection status tracking (scheduled → passed → failed → corrected → re-inspected → passed)
- Deficiency tracking (if failed)
- Inspection report storage
- Notifications for inspection results

**Stakeholders:**
- AHJ Inspector
- PM
- Installation crew (if corrections needed)
- Customer (for site access)

**Bottlenecks:**
- Inspector availability (can take 1-2 weeks to schedule)
- Failed inspections require corrections and re-inspection

---

### Stage 6: Utility Interconnection
**Timeline:** Week 8 (3-10 days)
**Owner:** PM or Interconnection Specialist
**Status after:** Utility approval, ready for PTO

**Activities:**
- Submit interconnection application to utility
- Utility review and approval
- Net metering agreement execution
- Coordinate meter swap/upgrade (if needed)

**Sunup Features Needed:**
- Interconnection application tracking
- Utility contact database
- Net metering agreement storage
- Meter swap scheduling
- Status notifications

**Stakeholders:**
- Utility company
- PM or Interconnection Specialist
- Customer (for net metering agreement)

**Bottlenecks:**
- Utility review times vary
- Meter upgrades can delay activation

---

### Stage 7: Permission to Operate (PTO) / Activation
**Timeline:** Weeks 9-10 (1-5 days)
**Owner:** PM
**Status after:** System live and producing power

**Activities:**
- Receive PTO from utility
- Activate system (flip the switch!)
- Verify monitoring system operational
- Customer training on monitoring
- Final walkthrough
- Warranty documentation handoff
- Project closeout

**Sunup Features Needed:**
- PTO document storage
- System activation checklist
- Customer training checklist
- Monitoring system verification
- Warranty document storage
- Project completion workflow
- Customer satisfaction survey
- Commission calculation trigger

**Stakeholders:**
- Utility (issues PTO)
- PM
- Customer
- Consultant (for commission)
- Finance (for final payment, commission payout)

**Deliverables:**
- PTO letter
- Warranty documents
- Monitoring access credentials
- Final as-built drawings
- Customer training completion

---

## Critical Success Factors for SunProject Module

### 1. Visual Pipeline Management
**Need:** Project Managers need to see all projects at a glance with stage and status

**Features:**
- Kanban board view by stage
- List view with filters (by stage, consultant, date range)
- Color coding for status (on track, at risk, delayed)
- Timeline/Gantt view for date-sensitive planning

### 2. Bottleneck Detection
**Need:** Identify and escalate projects stuck in permitting or inspection

**Features:**
- Automatic flagging of projects exceeding expected stage duration
- Escalation notifications to Sales Manager or PM lead
- Analytics on average time-in-stage by AHJ
- Bottleneck dashboard

### 3. Multi-Stakeholder Communication
**Need:** Coordinate with customers, AHJs, utilities, installers, inspectors

**Features:**
- Communication log per project (linked to existing communications table)
- Stakeholder contact database (AHJ, utility, inspector)
- Template messages for common scenarios
- Automated customer status updates ("Your permit was approved!")

### 4. Document Management
**Need:** Store and organize all project documents

**Document Types:**
- Contract
- Site survey photos
- Design files (CAD, PDF)
- Permit application
- Approved permit
- Inspection reports
- Interconnection application
- PTO letter
- Warranties
- As-built drawings

**Features:**
- Document upload and storage (cloud storage URLs)
- Document categorization
- Version control
- Customer portal access (for relevant docs)

### 5. Crew Scheduling and Dispatch
**Need:** Assign installation crews efficiently

**Features:**
- Crew availability calendar
- Skills-based assignment (roof type, system size)
- Geographic optimization (minimize travel)
- Equipment/inventory allocation
- Time tracking

### 6. Compliance and Checklists
**Need:** Ensure nothing is missed at each stage

**Features:**
- Stage-specific checklists (configurable per tenant)
- Required documents per stage
- Cannot advance to next stage until checklist complete
- Audit trail

### 7. Customer Visibility
**Need:** Customers want to know project status

**Features:**
- Customer portal showing current stage
- Timeline with milestones
- Photo gallery (installation progress)
- Real-time notifications
- Expected completion date

### 8. Performance Analytics
**Need:** Measure and improve efficiency

**Metrics:**
- Average time per stage
- Bottleneck identification (by AHJ, by project type)
- On-time completion rate
- Project profitability (actual vs. estimated)
- Crew productivity
- First-time inspection pass rate

---

## Recommended SunProject Module Features (Priority Order)

### P0 - MVP Features
1. **Project Pipeline View** - Visual stage tracking
2. **Stage Advancement Workflow** - Move projects through stages with validation
3. **Document Storage** - Upload and categorize project documents
4. **Installation Scheduling** - Assign crews to projects
5. **Basic Checklist System** - Stage-specific checklists
6. **Customer Status Portal** - Show current stage and timeline

### P1 - Early Enhancements
7. **Permit Tracking** - Detailed permitting workflow with AHJ contacts
8. **Inspection Management** - Schedule and track inspections
9. **Bottleneck Detection** - Auto-flag delayed projects
10. **Communication Integration** - Link communications to projects
11. **Timeline/Gantt View** - Date-based project planning
12. **Analytics Dashboard** - Time-in-stage, completion rates

### P2 - Advanced Features
13. **Utility Interconnection Tracking** - Manage utility approvals
14. **Equipment Inventory Integration** - Track panel/inverter allocation
15. **Crew Skills Matrix** - Match crew skills to project requirements
16. **Mobile App for Installers** - Field updates, photo uploads
17. **AHJ Integration** - API connections where available
18. **Predictive Analytics** - ML-based completion date forecasting

---

## Schema Implications

Based on this research, the existing Convex schema should be extended with:

### New Tables Needed:

**projectDocuments**
```typescript
{
  projectId: v.id("projects"),
  documentType: v.string(), // contract, permit, inspection_report, etc.
  fileName: v.string(),
  fileUrl: v.string(),
  uploadedByUserId: v.id("users"),
  uploadedAt: v.number(),
  version: v.number(),
  tenantId: v.id("tenants"),
}
```

**installationSchedules**
```typescript
{
  projectId: v.id("projects"),
  scheduledDate: v.number(),
  crewLeadUserId: v.id("users"),
  crewMemberIds: v.array(v.id("users")),
  status: v.union("scheduled", "in_progress", "completed", "cancelled"),
  actualStartTime: v.optional(v.number()),
  actualEndTime: v.optional(v.number()),
  notes: v.optional(v.string()),
  tenantId: v.id("tenants"),
}
```

**inspections**
```typescript
{
  projectId: v.id("projects"),
  inspectionType: v.string(), // electrical, structural, final, etc.
  scheduledDate: v.optional(v.number()),
  inspectorName: v.optional(v.string()),
  status: v.union("scheduled", "passed", "failed", "corrected", "re-inspected"),
  deficiencies: v.optional(v.array(v.string())),
  reportUrl: v.optional(v.string()),
  completedAt: v.optional(v.number()),
  tenantId: v.id("tenants"),
}
```

**permitApplications**
```typescript
{
  projectId: v.id("projects"),
  ahjName: v.string(),
  ahjContactInfo: v.optional(v.object({...})),
  submittedDate: v.optional(v.number()),
  status: v.union("draft", "submitted", "under_review", "corrections_requested", "approved", "rejected"),
  permitNumber: v.optional(v.string()),
  approvedDate: v.optional(v.number()),
  expirationDate: v.optional(v.number()),
  reviewComments: v.optional(v.array(v.string())),
  tenantId: v.id("tenants"),
}
```

**utilityInterconnections**
```typescript
{
  projectId: v.id("projects"),
  utilityCompany: v.string(),
  applicationDate: v.optional(v.number()),
  status: v.union("pending", "submitted", "approved", "meter_scheduled", "completed"),
  ptoDate: v.optional(v.number()),
  ptoDocumentUrl: v.optional(v.string()),
  netMeteringAgreementUrl: v.optional(v.string()),
  tenantId: v.id("tenants"),
}
```

### Enhancements to Existing Tables:

**projects** - Add fields:
- `currentStageStartedAt: v.optional(v.number())` - When current stage began
- `targetCompletionDate: v.optional(v.number())` - PM sets target
- `isAtRisk: v.boolean()` - Auto-flagged if delayed
- `delayReason: v.optional(v.string())` - Why project is delayed

**pipelineEvents** - Already supports stage tracking well

---

## Integration Points with Other Modules

### SunDesk (Support Module)
- Escalate stuck projects as support tickets
- Customer questions routed to assigned PM
- Document retrieval for support staff

### SunDialer (Lead Management)
- Hand off from Consultant to PM after sale
- Commission trigger on PTO/activation

### Finance Module
- Track project costs vs. estimates
- Commission calculations
- 1099 reporting for subcontracted crews

### Executive Dashboard
- Portfolio health metrics
- Revenue recognition timeline
- Installation capacity planning

---

## Competitive Analysis

**Leading Solar PM Software:**
1. **Aurora Solar** - Design + PM, strong permitting workflows
2. **OpenSolar** - End-to-end, good customer portal
3. **SolarSuccess** - PM-focused, crew scheduling
4. **Airtable/Custom** - Many installers use custom solutions

**Sunup Differentiators:**
- **Integrated platform** (not just PM, includes sales, support, training)
- **Multi-tenant SaaS** (most competitors are self-hosted or single-tenant)
- **Real-time collaboration** (Convex real-time updates)
- **Customer self-service site survey** (AI-powered mobile app)
- **Event-driven architecture** (enables advanced automations)

---

## Recommendations for Development

### Phase 1: Core PM Functionality (Weeks 4-6 of action plan)
- Extend schema with new tables (documents, inspections, permits, interconnections, schedules)
- Build Project Pipeline View (Kanban board)
- Stage advancement workflow with checklists
- Document upload and storage
- Basic installation scheduling

### Phase 2: Enhanced Workflows (Weeks 7-9)
- Detailed permit tracking with AHJ database
- Inspection management
- Customer status portal
- Bottleneck detection and alerts

### Phase 3: Optimization (Weeks 10-12)
- Timeline/Gantt view
- Analytics dashboard
- Crew skills matrix and optimization
- Mobile app for installers

### Phase 4: Advanced Features (Post-MVP)
- AHJ API integrations
- Predictive analytics
- Equipment inventory integration
- Automated customer updates

---

## Conclusion

The SunProject module is critical to Sunup's value proposition. Solar installation projects have complex, multi-stakeholder workflows with high variability in timelines. The module must:

1. **Provide visibility** - PMs, executives, customers all need different views
2. **Manage complexity** - 7 stages, multiple stakeholders, extensive documentation
3. **Detect problems early** - Permitting and inspection bottlenecks
4. **Enable efficiency** - Crew scheduling, checklist automation
5. **Integrate deeply** - With sales, support, finance modules

**Success Metrics:**
- Reduce average project completion time by 20% (through bottleneck management)
- Increase first-time inspection pass rate to >90%
- Customer satisfaction score >4.5/5 on timeline communication
- PM productivity: manage 50+ concurrent projects (vs. 20-30 without system)

---

## Appendices

### Appendix A: Pipeline Stage Definitions (Tenant Configurable)

Default stages for solar installation tenant:

1. **Site Survey** - Customer survey or professional assessment
2. **Design** - System design and engineering
3. **Permitting** - AHJ permit application and approval
4. **Installation Scheduled** - Crew assigned, date set
5. **Installation In Progress** - Active installation
6. **Installation Complete** - Awaiting inspection
7. **Inspection** - AHJ inspection scheduled/completed
8. **Interconnection** - Utility approval process
9. **PTO/Activation** - System live
10. **Project Complete** - All closeout activities done

### Appendix B: Research Sources

1. Solar Energy Industries Association (SEIA) - Installation best practices
2. North American Board of Certified Energy Practitioners (NABCEP) - Standards
3. Solar installation company workflows (web research)
4. Project management software feature analysis
5. Solar industry forums and practitioner discussions

---

**Document Status:** Complete
**Next Steps:** Review findings, prioritize features for PRD, update architecture to support PM workflows

---

_Research conducted: 2025-11-03_
_Approved by: [Pending user review]_
