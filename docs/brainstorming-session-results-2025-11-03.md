# Brainstorming Session Results - Session 2 (Continuation)

**Session Date:** 2025-11-03
**Facilitator:** Business Analyst
**Participant:** Greg

## Executive Summary

**Topic:** Sunup Platform Architecture - Completing Role Exploration and Strategic Planning

**Session Goals:**
1. Complete role exploration for all 12 user roles (7 remaining roles from previous session)
2. Add critical features discovered during role exploration (meeting handoff, recruiting/training system)
3. Organize all ideas into implementation priorities
4. Define top 3 immediate priorities with concrete action plans
5. Map dependencies and architectural decisions

**Techniques Used:**
1. Role Playing (Collaborative) - Completed 7 additional roles
2. Convergent Phase - Organized ideas by implementation priority
3. Dependency Mapping (Advanced) - Visualized interconnections and critical path

**Total Ideas Generated (Both Sessions Combined):** 200+ architectural components, features, workflows, and strategic insights

**Session Status:** Complete - All roles explored, priorities defined, action plan created

---

## Key Themes Identified

### Strategic Themes from Session 2:

1. **Meeting Handoff Intelligence** - Consultant workload flexibility through intelligent handoff system with effort-based fairness, automated assignment, and Sales Manager escalation
2. **Recruiting Engine for High Turnover** - Comprehensive recruiting system with multi-channel integration, automated onboarding, and seamless handoff to training
3. **Training at Scale** - Hybrid training system supporting up to 200 trainees with automated assessment, intelligent team assignment based on performance distribution
4. **Configurable Approval Workflows** - Sales Managers configure commissions, System Admins define approval chains, Executives approve - sophisticated governance engine
5. **Multi-Tier Support System** - Built-in trouble ticketing (users→admin→SaaS support) as core platform capability
6. **Script Management Ecosystem** - Sales Managers create/manage scripts used across Recruiter, Consultant, and SunDesk modules
7. **Dependency-Aware Architecture** - Pipeline as central nervous system, WebRTC as foundation, multi-tenancy from day one

### Continuing Themes from Session 1:

8. **AI-Powered Success Intelligence** - AI analysis to identify success patterns and provide coaching
9. **Career Development Engine** - Platform helps people succeed for the first time through progressive advancement
10. **Unified Workspace Architecture** - Everything in one place to eliminate app-switching
11. **Contractor Engagement Model** - Inspire and incentivize through gamification, community, recognition
12. **Platform Business Model** - Lead marketplace for 10,000+ companies creates network effects
13. **Event-Driven Integration** - Status changes trigger cascading updates across modules
14. **Role-Based Data Access** - Personal, Team/Module, and Global access layers
15. **Bidirectional Visibility** - Setters see outcomes, Consultants see installation progress

---

## Technique Sessions

### Technique 1: Mind Mapping (Structured) - 20 minutes
**[From Session 1 - 2025-10-30]**

See previous session document for complete mind mapping results covering:
- Sundialer, SunCRM, SunDesk, SunProject modules
- User roles and core capabilities
- Data/integration layer
- Critical architectural insights

---

### Technique 2: Role Playing (Collaborative) - Session 1: 25 minutes + Session 2: 45 minutes

**Session 1 Roles (From 2025-10-30):**
- Setter
- Consultant
- Lead Manager
- Sales Manager
- Setter Manager

**Session 2 Roles (2025-11-03) - NEW:**

#### Role 6: SUPPORT STAFF (SunDesk)

**Context:**
- Reaches out to customers post-sale
- 50-100 calls/week workload
- Structured, scripted communications

**Key Features Identified:**
- **Configurable communication purposes** (onboarding, check-ins, warranty, support)
- Each purpose has dedicated script
- **Priority system** for communication types (configurable)
- **Disposition tracking** - outcome logged after every interaction
- Daily manager communication visibility
- Today's schedule view

**Requires Research:** Support workflow best practices, customer communication lifecycle optimization

---

#### Role 7: PROJECT MANAGER (SunProject)

**Context:**
- Manages installation from sale to completion
- Receives customers from SunCRM, requests from SunDesk
- Coordinates with Installers

**Requires Extensive Research:** Solar installation PM best practices, workflow optimization, milestone tracking

---

#### Role 8: INSTALLER (SunProject)

**Context:**
- Field-based installation crews
- Mobile device usage
- Physical solar system installation

**Requires Extensive Research:** Field worker needs, mobile app requirements, installation process tracking

---

#### Role 9: SYSTEM ADMINISTRATOR (Cross-Module)

**Context:**
- Full platform access across all modules
- Configuration, monitoring, and user management

**Key Features Identified:**

**Core Capabilities:**
- System health monitoring dashboards
- Log viewer and analysis
- User management (create, modify, deactivate)
- Role and permissions assignment
- Company settings configuration

**Multi-Tier Trouble Ticketing:**
- **Tier 1:** Internal users → Company System Admin
- **Tier 2:** Company System Admin → Sunup SaaS Support
- Built-in trouble ticketing as core platform feature
- Ticket categorization, prioritization, resolution tracking

**Commission Configuration Governance:**
- **Sales Managers configure** commission structures and compensation
- **System Admins configure approval workflows:**
  - Whether commission changes require executive approval
  - Which executives can approve changes
  - Multi-level approval chains
- **Audit trail** for all financial configuration changes

**Critical Insight:** Requires sophisticated permissions and workflow engine - not just "who can access what," but "who can change what, who must approve it, and what's the approval chain."

**Requires Research:** Trouble ticketing best practices, workflow automation systems

---

#### Role 10: EXECUTIVE (Cross-Module)

**Context:**
- C-level strategic visibility
- High-level dashboards for business health
- Cross-module insights

**Key Metrics Needed:**
- Company health (revenue, pipeline, conversion rates)
- Team performance across departments
- Strategic trends and early warnings
- Financial visibility and forecasting
- Capacity planning insights

**Requires Research:** Executive dashboard best practices, KPI frameworks for solar sales industry

---

#### Role 11: FINANCE (Cross-Module)

**Context:**
- Financial operations across all modules
- Commission/payment management
- Reporting and compliance

**Key Features Identified:**

**Complex Configurable Commission Engine:**
- **Kilowatt-based calculations**
- **Product-specific rules:**
  - Batteries: flat commission
  - Panels: per kW rate varying by make/model
  - Multi-factor commission structures
- **Multiple payment types:**
  - Commissions (complex calculations)
  - Bonuses
  - One-time payments (contests, incentives)

**Multi-Tenant Configuration:**
- Each installer company has unique commission structures
- Different payment timing policies per tenant
- Per-tenant financial rules engine

**Critical Architectural Insight:** Commission system is not simple math - it's a sophisticated, configurable rules engine supporting diverse business logic per tenant.

**Requires Research:** Financial reporting requirements, tax compliance (1099s), ACH payment processing

---

#### Role 12: OPERATIONS (Cross-Module)

**Context:**
- Cross-module operational efficiency
- Process optimization and capacity planning
- Not Finance, not Executive strategy - focused on "how we get work done"

**Potential Responsibilities:**
- Pipeline bottleneck identification
- Resource utilization and capacity planning
- Process optimization and quality assurance
- Cross-departmental coordination
- Lead quality vs conversion tracking

**Requires Research:** Operations metrics for solar sales, process optimization frameworks

---

### NEW DISCOVERIES During Role Exploration:

#### MEETING HANDOFF SYSTEM (SunCRM)

**Discovered while exploring Consultant role needs**

**Problem:** Consultants have unexpected scheduling conflicts, need coverage flexibility

**Solution: Intelligent Meeting Handoff System**

**Features:**

**Pre-Meeting Alert (15 minutes before):**
- Toast notification with Person name, meeting purpose
- Options: Take Meeting or Handoff Meeting

**Manual Handoff (Proactive):**
- Consultants can handoff meetings anytime (e.g., medical appointment in 3 days)
- **Reason field required** (Medical, Personal, Scheduling conflict, etc.)
- Reason displayed in handoff alerts
- No limits on number of handoffs

**Handoff Workflow:**
- Broadcast to available Consultants with:
  - Person name, meeting purpose/type, meeting time
  - Handoff reason
  - Brief Person context
  - "Accept Handoff" button

**Person Reassignment:**
- When Consultant accepts: Person **fully reassigned** to recipient
- Complete access to Person history, notes, pipeline status
- **Person is NOT notified** (seamless handoff)

**Availability Toggle:**
- Consultants set: "Available for handoffs" or "Not available"
- Only available Consultants receive standard broadcasts

**Automated Assignment (10 minutes before):**
- If no acceptance by 10-min mark: auto-assign using **effort-based round-robin**
- Gives recipient Consultant time to prepare

**Effort-Based Round-Robin Algorithm:**
- Priority based on **effort metrics:**
  - Intro calls made
  - Reschedule calls made
  - **Handoff acceptances** (helping teammates earns credit)
- **NOT based on sales performance** (rewards effort, not outcomes)
- **Applies to:**
  1. Meeting handoff assignments
  2. New Person distribution from Sundialer

**Sales Manager Escalation (if no coverage at 10 min):**
- Alert if no available Consultants
- **Sales Manager Options:**
  1. Assign to specific Consultant (override availability)
  2. Hand off to Support Staff for rescheduling
  3. Broadcast to ALL Consultants (override availability toggle)
  4. Call Person to reschedule (manager handles)
  5. Take the meeting (manager conducts consultation)

**Sales Manager Visibility:**
- View handoff patterns by Consultant
- See handoff reasons for pattern analysis
- Identify capacity/workload issues

**Critical Insights:**
- Rewards both individual effort AND team collaboration
- Provides multiple escalation options (no single point of failure)
- Transparent reason tracking for operational intelligence

---

#### RECRUITING & TRAINING SYSTEM

**Discovered addressing high Setter turnover**

**Problem:** High Setter turnover requires continuous recruiting pipeline

#### NEW ROLE: RECRUITER

**Context:**
- Company recruits many new Setters weekly
- Multiple job posting channels
- Video interviews required
- Handoff to Trainer on hire

**Job Posting & Application Management:**

**Two-Way Integration with Employment Sites:**
- Platforms: Indeed, LinkedIn, ZipRecruiter, Glassdoor, etc.
- **API & Webhook Integration:**
  - Post job announcements from Sunup
  - Receive applications via webhooks
  - Track performance per platform:
    - Views, clicks, applications
    - Cost per applicant
    - Source effectiveness (ROI)

**Internal Application Portal:**
- Public-facing job listings
- Simple application flow
- **Applicant self-scheduling** for interviews
- Mobile-responsive, no login required
- Automated confirmations

**Interview Workflow:**

**Scheduling:**
- Calendar integration (Recruiter availability)
- Self-service appointment booking
- Automated reminders
- Reschedule/cancellation handling

**Interview Conduct:**
- **Built-in video conferencing** (WebRTC)
- **Structured interview script**
- **Note-taking interface:**
  - Free-form notes
  - Structured fields for key data
- **Meeting recording** (video + audio)
- **Automated transcription**
- **AI-generated summary** of transcript

**Recording Access:**
- Accessible by: Recruiters, Sales Managers, Setter Managers, Trainers
- Purpose: Review, training, quality assurance, compliance

**Hiring Decision:**

**End-of-Interview Dispositions:**
- **Hired** → triggers onboarding workflow
- **Rejected** → applicant removed (not retained)
- **Second Interview** → schedule follow-up
- **On Hold / Maybe Later** → parking status

**When Marked "Hired":**
1. **System auto-creates user account:**
   - Role: **Setter Trainee**
   - Account credentials generated
2. **Triggers onboarding checklist**
3. **Makes data available to Trainer**

**Onboarding Checklist (US Contract Hire):**
- W-9 collection
- I-9 verification
- Background check
- Contract signing (independent contractor agreement)
- Direct deposit / ACH setup
- Emergency contact
- Equipment setup
- NDA / confidentiality agreements
- Compliance requirements

**Handoff to Trainer:**
- **Recruiter adds new hire to scheduled training session**
- Trainer receives notification
- Trainer gets full access to:
  - Application information
  - Interview recordings, transcripts, summaries
  - Onboarding checklist status
  - All Recruiter notes

**Recruiter Dashboard:**
1. Today's interview schedule
2. New applications pending review
3. Application volume by source
4. Hiring funnel metrics (applications → interviews → hires)
5. Follow-up actions (rejections, second interviews, onboarding completion)

---

#### NEW ROLE: TRAINER

**Context:**
- Trains new Setter Trainees
- Hybrid format (live + self-paced)
- Classes up to 200 trainees
- 1-5 day duration

**Training Program Structure:**

**Format:**
- **Hybrid:** Live sessions + self-paced materials
- **Materials:** Text content + video library
- **Class size:** Up to 200 Setter Trainees
- **Duration:** 1-5 days (configurable per session)

**Training Session Management:**
- Create sessions with start/end dates, duration
- Assign Trainees (from Recruiter handoffs)
- Schedule live session times
- Define curriculum/modules

**Content Delivery:**

**Self-Paced:**
- Text lessons, video library, downloadable resources
- Progress tracking per Trainee

**Live Sessions:**
- Built-in video conferencing (up to 200 participants via WebRTC)
- Screen sharing, Q&A/chat
- Session recording for missed sessions
- Attendance tracking

**Assessment System:**

**Quizzes:**
- Multiple quizzes throughout training
- **Automated grading**
- **Trainer can override scores** (partial credit, extenuating circumstances)
- **Configurable passing score** (e.g., 70%, 80%, 90%)
- **Retakes require Trainer approval**

**Graduation Requirements:**
1. Pass all required quizzes
2. Complete all required materials
3. **Trainer approval** (final certification gate)

**Graduation Workflow:**
- **System automatically changes role:** "Setter Trainee" → "Setter"
- Setter gains access to Sundialer
- Notification sent to assigned Setter Manager

**Failed Trainees:**
- Trainer can reschedule to future training session
- Track attempt history
- Multiple attempt opportunities

**Intelligent Setter Manager Assignment:**

**Algorithm Balances:**
1. **Team Capacity:**
   - Current team sizes
   - Distributes to balance workload
   - No hard team size limits

2. **Performance Distribution:**
   - Analyzes Trainee metrics:
     - Quiz scores
     - Training completion time
     - Participation
     - Trainer assessments
   - **Distributes high/medium/low performers evenly**
   - Ensures fair playing field for manager comparison
   - **Rebalancing only at assignment time** (not ongoing)

**Manual Reassignment:**
- **System Admins** can reassign Setters
- **Sales Managers** can reassign Setters
- Historical data preserved

**Setter Manager Data Access:**
- Full access to complete history:
  - Application data
  - Interview recordings, transcripts, summaries
  - Training performance
  - All onboarding documentation

**Trainer Dashboard:**
1. Active training sessions and enrollment
2. Trainee status (passed/failed quizzes, pending approval)
3. Action items (quizzes to grade, approvals needed)
4. Training metrics (graduation rates, quiz scores, time-to-completion)

**Critical Insights:**
- Standardized curriculum ensures consistent baseline
- Performance-based team balancing creates fairness
- Full visibility into candidate history enables effective coaching

---

### Technique 3: Dependency Mapping (Advanced) - 30 minutes

**Goal:** Visualize interconnections to understand requirements, impacts, and critical path

**Major Dependencies Discovered:**

#### ARCHITECTURAL DECISIONS MADE:

✅ **Video Conferencing:** Build custom WebRTC solution
- Impact: More dev time, full control and customization
- Required for: Recruiter (interviews), Trainer (200-person sessions), Consultant (meetings)

✅ **Maps:** Mapbox integration
- Impact: Clear integration path
- Required for: Consultant Meeting View (property visualization)

✅ **Script Management:** Sales Managers create and manage
- Impact: Needs admin UI in System Admin module
- Required for: Consultant, Recruiter, SunDesk

✅ **Multi-Tenancy:** Build early (foundational)
- Impact: More complex initially, avoids massive refactor later
- Affects: ALL modules

✅ **Trouble Ticketing:** Built into Sunup platform
- Impact: Two-tier system is internal
- Required for: System Admin module

#### CRITICAL PATH DEPENDENCIES:

**Foundation Layer (BLOCKS EVERYTHING):**
```
1. Multi-Tenant Database Architecture
2. User Authentication & Roles (multi-tenant aware)
3. WebRTC Video Infrastructure
   - Signaling server
   - TURN/STUN servers
   - 1-to-1 video (Recruiter, Consultant)
   - 1-to-many video (Trainer - 200 participants)
4. Pipeline Foundation (configurable stages, multi-tenant)
5. Event System (status change triggers)
6. Notification Infrastructure
```

**Priority #1 Dependencies (Setter Dashboard):**
```
Setter Dashboard REQUIRES:
├─→ Pipeline Foundation (Lead → Set stages)
├─→ SunCRM Pipeline Extension (Set → Met → QMet → Sale)
│   └─→ CRITICAL: Without this, cannot show payment visibility
├─→ Commission Calculation Engine
├─→ Event System (real-time updates)
├─→ Campaign Management
├─→ Knowledge Base
└─→ Communications System (daily messages)
```

**Priority #2 Dependencies (Leaderboard):**
```
Leaderboard REQUIRES:
├─→ All Setter Dashboard data
├─→ Ranking Algorithm
├─→ Achievement Badge System
└─→ Time-series data storage
```

**Priority #3 Dependencies (Consultant Meeting View):**
```
Meeting View REQUIRES:
├─→ WebRTC Infrastructure (BLOCKING - must build first)
├─→ Script Management System
├─→ Mapbox Integration
├─→ Person Data Model
├─→ Presentation/slideshow viewer
└─→ Calculator/proposal tool
```

**Meeting Handoff Dependencies:**
```
Meeting Handoff REQUIRES:
├─→ Consultant Meeting View (core interface)
├─→ Calendar System
├─→ Effort-based Round-Robin Algorithm
│   ├─→ Intro call tracking
│   ├─→ Reschedule call tracking
│   └─→ Handoff acceptance tracking
├─→ Availability toggle system
├─→ Person reassignment logic
└─→ Sales Manager escalation alerts
```

**Commission System Dependencies (CRITICAL - Cross-Module):**
```
Commission Engine TRIGGERS FROM:
├─→ Pipeline Events (QMet, Sale, Installation Complete)

CONFIGURED BY:
├─→ Sales Manager (rules, rates, formulas)

APPROVED VIA:
├─→ System Admin (approval workflow configuration)
├─→ Executive (approval execution)

VISIBILITY IN:
├─→ Setter Dashboard (payment tracking)
├─→ Consultant Meeting View (earning potential)
└─→ Finance Module (payment processing)
```

#### BLOCKING RISKS IDENTIFIED:

**🚨 Risk #1: Setter Dashboard Incomplete Without SunCRM**
```
Problem: Priority #1 (Setter Dashboard) requires SunCRM pipeline data
Solution: Build SunCRM pipeline extension IN PARALLEL with Setter Dashboard
Timeline Impact: Must coordinate development across modules
```

**🚨 Risk #2: WebRTC Complexity**
```
Problem: Building WebRTC from scratch is significant undertaking
- 1-to-1 video (moderate complexity)
- 1-to-200 video (high complexity - Trainer sessions)
Solution: Staged rollout - 1-to-1 first, then 1-to-many
Timeline Impact: 3 weeks for foundation (was not in original estimate)
```

**🚨 Risk #3: Multi-Tenancy Architecture**
```
Problem: If not done correctly early, causes massive problems later
Solution: Invest heavily in architecture design upfront
Timeline Impact: 1-2 weeks additional planning
Risk Mitigation: Prevents months of refactoring
```

**🚨 Risk #4: Effort-Based Round-Robin Needs Activity Tracking**
```
Problem: Round-robin algorithm requires tracking that doesn't exist yet
Needs: Intro call counts, reschedule call counts, handoff acceptance counts
Solution: Build activity tracking infrastructure early
```

#### BUILD SEQUENCE TO MINIMIZE BLOCKING:

**Phase 0 - Architecture Foundation (Weeks 1-3):**
- Multi-tenant database architecture
- User Authentication & Roles (multi-tenant)
- **WebRTC Video Infrastructure** ← MAJOR WORK
- Pipeline Foundation (multi-tenant, configurable)
- Event System
- Notification Infrastructure

**Phase 1 - Core Systems (Weeks 4-6):**
- Campaign Management
- Person Data Model
- **Script Management System** (Sales Manager admin UI)
- **Mapbox Integration**
- Basic Commission Engine

**Phase 2 - Priority 1: Setter Dashboard (Weeks 7-10):**
- Setter Dashboard UI
- **SunCRM Pipeline Extension** (BUILD IN PARALLEL - CRITICAL!)
- KPI Aggregation
- Hours Tracking
- Knowledge Base

**Phase 3 - Priority 2: Leaderboard (Weeks 11-13):**
- Ranking Algorithm
- Achievement Badge System
- Leaderboard UI

**Phase 4 - Priority 3: Consultant Meeting View (Weeks 14-21):**
- Unified multi-panel UI
- Meeting Handoff System
- Effort tracking infrastructure
- Integration & Testing

**Timeline Impact:**
- Original estimate: 15 weeks
- **Revised with foundation: 21 weeks**
- Trade-off: 6 weeks upfront investment prevents months of refactoring

---

## Idea Categorization by Implementation Priority

### **PRIORITY 1: SUNDIALER**

**Immediate Opportunities:**
- Campaign management system
- Outgoing predictive dialer with auto-routing
- Setter call handling UI
- Lead upload and management
- **Payment visibility dashboard** (Sets/Mets/QMets/Sales) - **BIGGEST PAIN POINT**
- Hours tracking (30hrs/week minimum)
- Personal KPI visibility
- Peer comparison metrics
- Leaderboard (UI design complete)
- Manager tools (monitoring, team performance)
- Daily welcome messages/announcements
- Campaign assignment controls
- Property visualization (map view)
- Knowledge base access
- Training materials
- Achievement badges system
- Contest and performance bonuses
- Goal-setting with progressive targets
- Career progression visibility

**Pipeline Features (Phase 1):**
- Basic pipeline: Lead → Set (configurable)
- Stage visualization for Setters
- Status tracking and updates
- Pipeline configuration UI
- Setter Manager pipeline views

**Future Innovations:**
- Lead import tool with field mapping
- Data quality validation and automated cleanup
- Lead enrichment capabilities
- AI-assisted data cleanup
- Daily AI evaluation and feedback
- Call quality monitoring with AI analysis

**Moonshots:**
- **Lead Marketplace** - Built-in marketplace for 10,000+ companies
- Real-time AI coaching during calls
- Advanced AI voice analysis

---

### **PRIORITY 2: SUNCRM**

**Immediate Opportunities:**
- Person assignment from Sundialer
- Intro call process
- Person organization by next action/pipeline stage
- Leaderboard
- Communication triage dashboard
- Today's appointments view
- Intro call queue
- Daily call quota tracking
- Credit approval status tracking
- Commitment tracking system
- Performance visibility
- Daily accomplishment view
- Manager tools

**Pipeline Features (Phase 2):**
- Extend pipeline: Set → Met → QMet → Sale (configurable)
- **Bidirectional visibility** (Setters see outcomes, Consultants see installation)
- Event-driven notifications
- Sales Manager pipeline analytics
- **Commission trigger events** (QMet, Sale)
- Conversion rate tracking
- Pipeline forecasting
- Bottleneck identification

**Meeting Handoff System (NEW):**
- Pre-meeting alerts (15 min before)
- Manual handoff with reason tracking
- Availability toggle
- Handoff broadcast to available Consultants
- Person reassignment on acceptance
- **Automated assignment (10 min before) using effort-based round-robin**
- Sales Manager escalation (5 intervention options)
- Handoff acceptance counts as positive effort metric
- Sales Manager visibility into patterns

**Effort-Based Round-Robin (NEW):**
- Priority based on: intro calls, reschedule calls, handoff acceptances
- NOT sales performance
- Applies to: meeting handoffs + new Person distribution

**Future Innovations:**
- **Unified Consultation UI** (video, script, map, slideshow, Person details)
- Built-in video conferencing (WebRTC)
- Installation progress dashboard
- AI training and feedback
- "Optimal next step" recommendations

**Moonshots:**
- AI video analysis
- Advanced AI success pattern analysis
- Real-time AI coaching

---

### **PRIORITY 3: SYSTEM ADMINISTRATOR**

**Immediate Opportunities:**
- User management (create, modify, deactivate)
- Role and permissions assignment
- Company settings configuration
- Full system access for investigation

**Pipeline Features (Phase 3):**
- Advanced pipeline configuration UI
- Define custom stages per tenant
- Configure stage names, order, rules
- Set commission/payment trigger stages
- Configure notification rules
- Audit trail

**Future Innovations:**
- System health monitoring dashboards
- Log viewer and analysis
- **Multi-tier trouble ticketing:**
  - Tier 1: Users → Admin
  - Tier 2: Admin → Sunup SaaS Support
- Ticket categorization and prioritization
- **Approval workflow configuration engine:**
  - Sales Managers configure commissions
  - System Admins configure approval chains
  - Executives approve changes
  - Multi-level workflows
- Audit trail for financial configuration changes
- **Script Management System:**
  - Sales Manager admin UI
  - Script versioning
  - Script assignment to modules

**Requires Research:**
- Trouble ticketing best practices
- Advanced workflow automation

---

### **PRIORITY 4: SUNDESK**

**Immediate Opportunities:**
- Scheduled and ad-hoc customer communications
- High-priority team messages
- Daily schedules and workload management

**Pipeline Features (Phase 4):**
- Post-sale pipeline stages (configurable)
- Customer communication tracking
- Support ticket linkage to pipeline
- Onboarding milestone tracking

**Future Innovations:**
- **Configurable communication purposes**
- Script management per purpose
- Priority system for communication types
- Disposition tracking
- **Routing & triage system:**
  - Route to SunCRM (order changes)
  - Route to SunProject (installation questions)

**Requires Research:**
- Support workflow best practices
- Script management systems
- Customer communication lifecycle

---

### **PRIORITY 5: SUNPROJECT**

**Pipeline Features (Phase 5):**
- Installation milestone stages (configurable)
- Full lifecycle: Lead → Installation complete
- Installation progress visibility to Consultants
- Project Manager pipeline views
- Final commission/payment triggers

**Requires Extensive Research:**
- Solar installation PM best practices
- Project Manager workflows and needs
- Installer field tools and mobile capabilities
- Installation stage tracking
- Equipment/parts management
- Customer scheduling

---

### **NEW MODULE: RECRUITING & TRAINING**

**RECRUITER - Immediate Opportunities:**
- Internal application portal (job listings, apply, self-schedule)
- Applicant tracking with source attribution
- Interview scheduling with calendar integration
- Built-in video conferencing (WebRTC)
- Structured interview script with note-taking
- Meeting recording, transcription, AI summaries
- Recording access (multi-role)
- Hiring dispositions (Hired, Rejected, Second Interview, On Hold)
- **Auto-create account** (role: Setter Trainee) on hire
- **Onboarding checklist** (US contract hire)
- Recruiter Dashboard

**Future Innovations:**
- **Two-way integration with employment sites:**
  - Indeed, LinkedIn, ZipRecruiter, Glassdoor
  - Post announcements from Sunup
  - Receive applications via webhooks
  - Track performance per platform

**TRAINER - Immediate Opportunities:**
- Training session management (1-5 days, up to 200 trainees)
- Hybrid format: live sessions + self-paced materials
- Content delivery (text, videos)
- Built-in video conferencing (WebRTC, 200 participants)
- **Assessment system:**
  - Automated grading
  - Trainer can override scores
  - Configurable passing scores
  - Retakes require Trainer approval
- **Graduation requirements:**
  - Pass all quizzes
  - Trainer approval
  - Auto-change role: Setter Trainee → Setter
- Failed trainee rescheduling
- Trainer Dashboard

**Setter Manager Assignment:**
- **Intelligent assignment algorithm:**
  - Balance team capacity
  - Distribute performance evenly
  - Rebalancing only at assignment time
- Manual reassignment (System Admin, Sales Manager)
- Full data access to Setter history
- No team size limits

---

### **CROSS-PLATFORM CAPABILITIES**

**Immediate Opportunities:**
- Internal messaging (Slack-clone)
- Email client
- SMS messaging
- Calendar system (cross-role scheduling)
- Knowledge base (searchable documentation)
- Training materials library
- Platform help

**Pipeline Integration:**
- Event-driven notifications system
- Pipeline-triggered alerts across modules
- Pipeline milestone reminders

**Future Innovations:**
- **Complex configurable commission engine:**
  - Kilowatt-based calculations
  - Product-specific rules (batteries flat, panels per kW by make/model)
  - Multi-factor structures
  - Multiple payment types (commissions, bonuses, contests)
  - Sales Manager configuration interface
  - Executive approval workflows
  - Per-tenant financial rules
- ACH payment processing
- Executive dashboards and KPIs
- Operations efficiency monitoring
- Finance reporting and compliance

**Moonshots:**
- **AI Success Pattern Analysis Engine:**
  - Analyze what top performers do differently
  - Word choice, tone, intonation patterns
  - Speaking speed, pausing, talk ratio
  - Timing patterns
  - Data-driven coaching recommendations
  - Script A/B testing
- **Community & Culture Platform:**
  - Social features for remote workforce
  - Mentorship recognition
  - Community health indicators
  - Sentiment analysis

---

## Insights and Learnings

### Key Realizations from Session 2:

1. **Pipeline is the Backbone** - Progressive build across all modules, single source of truth for customer lifecycle

2. **Effort-Based Fairness is Critical** - Round-robin systems must reward hard work, not just outcomes, to maintain contractor engagement and fairness

3. **Video Conferencing is Foundation** - WebRTC decision impacts Recruiter, Trainer, and Consultant modules - must build early despite complexity

4. **Multi-Tenancy Cannot Wait** - Building multi-tenant architecture from day one prevents months of painful refactoring

5. **Dependencies Block Everything** - Setter Dashboard (Priority #1) is blocked by SunCRM pipeline data - must build in parallel

6. **Approval Workflows are Governance** - Not just "who can do what" but "who must approve what" with audit trails - essential for financial controls

7. **Scripts are Cross-Module Assets** - Sales Manager-created scripts used by Recruiter, Consultant, SunDesk - need centralized management

8. **Recruiting/Training is Platform Feature** - High turnover makes recruiting/training as important as core sales features

9. **Intelligent Assignment Prevents Imbalance** - Performance-based team assignment ensures fair distribution of talent across Setter Managers

10. **Handoff System Enables Flexibility** - Meeting handoff with effort-based round-robin creates team collaboration while maintaining individual accountability

### Continuing Insights from Session 1:

11. **Career Development Engine** - Platform helps people (especially those rebuilding lives) succeed for the first time

12. **Contractor Engagement Model** - Can't force contractors - must inspire through gamification, recognition, community

13. **Lead Marketplace Platform Play** - 10,000+ companies creates network effects and revenue beyond subscriptions

14. **AI-Powered Intelligence** - Success pattern analysis is major differentiator

15. **Unified Workspace** - Everything in one place eliminates app-switching nightmare

---

## Action Planning

### Top 3 Priority Ideas

#### **Priority #1: Sundialer Setter Dashboard**

**Rationale:**
- Solves Setter's BIGGEST pain point (payment visibility)
- Foundation for entire Setter experience
- High impact on contractor engagement and retention

**What This Includes:**
- Payment visibility (Sets, Mets, QMets, Sales tracking)
- Hours tracking (30hrs/week minimum)
- Personal KPI visibility
- Today's campaigns/availability
- Daily welcome message from Setter Manager
- Knowledge base access
- Achievement badges display
- Current goals and progress

**Next Steps:**

1. **Define Dashboard Requirements (1-2 days)**
   - Wireframe layout and information architecture
   - Prioritize above-the-fold metrics
   - Define data refresh rate
   - Mobile vs desktop considerations

2. **Pipeline Integration Planning (1 day)**
   - Define how Setter dashboard receives pipeline updates
   - Event-driven notifications or polling?
   - Bidirectional visibility design

3. **Data Model Design (2-3 days)**
   - Setter activity tracking schema
   - Hours worked calculation
   - KPI aggregations (daily, weekly, monthly)
   - Achievement badge system data structure

4. **API/Backend Development (1-2 weeks)**
   - Setter metrics endpoints
   - Real-time event streaming for pipeline updates
   - Hours tracking service
   - Badge/achievement logic

5. **UI Development (1-2 weeks)**
   - Dashboard component build
   - Responsive design implementation
   - Real-time updates (websockets/polling)
   - Performance optimization

6. **Testing & Validation (3-5 days)**
   - User acceptance testing with real Setters
   - Performance testing
   - Payment calculation accuracy validation

**Resources Needed:**
- Product Manager/Designer (wireframes, UX)
- Backend Developer (API, data model, event system)
- Frontend Developer (dashboard UI)
- QA Engineer

**Timeline Estimate:** 3-4 weeks (Weeks 7-10 in overall sequence)

**Critical Dependencies:**
- Pipeline foundation (Lead → Set stages) ← Phase 0-1
- **SunCRM pipeline extension (Set → Met → QMet → Sale)** ← MUST BUILD IN PARALLEL
- User authentication/roles ← Phase 0
- Campaign management basics ← Phase 1

---

#### **Priority #2: Setter Leaderboard**

**Rationale:**
- Gamification drives contractor engagement
- Peer comparison motivates performance
- UI design already complete (head start!)
- Builds on dashboard data

**What This Includes:**
- Individual performance metrics
- Team comparison view
- Ranking algorithms (by Sets, QMets, conversion rates)
- Time period filters (today, week, month, all-time)
- Visual rankings and badges
- Achievement highlights

**Next Steps:**

1. **Review Existing UI Design (1 day)**
   - Assess completed leaderboard UI design
   - Identify gaps or needed adjustments
   - Confirm metrics to display

2. **Define Ranking Logic (2-3 days)**
   - Determine ranking metrics (Sets, conversion rates, composite score?)
   - Multiple leaderboards or unified?
   - Privacy considerations (all Setters vs top 10 + your position?)

3. **Data Aggregation Strategy (2 days)**
   - Real-time vs periodic calculation?
   - Caching strategy for performance
   - Historical snapshots (daily/weekly winners)

4. **Backend Development (1 week)**
   - Leaderboard calculation service
   - Ranking algorithms
   - Caching layer
   - APIs for leaderboard data

5. **UI Implementation (1 week)**
   - Integrate existing UI design
   - Real-time or periodic updates
   - Animations for rank changes
   - Filter controls

6. **Gamification Features (3-5 days)**
   - Achievement badge unlocking logic
   - Milestone celebrations
   - Notifications ("You moved up to #3!")

7. **Testing (3-5 days)**
   - Performance testing (200+ Setters)
   - Ranking accuracy validation
   - A/B testing impact on engagement

**Resources Needed:**
- Designer (minor - mostly design complete)
- Backend Developer (ranking logic, APIs)
- Frontend Developer (UI implementation)
- QA Engineer

**Timeline Estimate:** 2-3 weeks (Weeks 11-13 in overall sequence)

**Dependencies:**
- Setter Dashboard (provides underlying data) ← Priority #1
- Pipeline tracking (Set → outcomes) ← Phase 1-2
- Achievement badge system ← Built with Priority #1

---

#### **Priority #3: Consultant Meeting View (Unified Consultation UI)**

**Rationale:**
- Solves Consultant's biggest pain point (application switching nightmare)
- Major competitive differentiator
- Critical for sales effectiveness
- Foundation for future AI coaching features

**What This Includes:**
- Built-in video conferencing (WebRTC)
- Script presentation component
- Property map viewer (Mapbox integration)
- Slideshow/presentation component
- Person details panel
- Proposal/calculator tool
- **All in ONE unified interface** (no app switching!)

**Next Steps:**

1. **Conduct Consultant Workflow Research (3-5 days)**
   - Interview Consultants about current pain points
   - Document application switching workflow
   - Identify must-have vs nice-to-have components
   - Screen recordings of current consultation process
   - Map ideal information flow during meeting

2. **UI/UX Design (1-2 weeks)**
   - Design unified interface layout
   - Component placement and sizing
   - Multi-panel vs tabbed approach?
   - Responsive design for different screen sizes
   - Interaction patterns (minimize/maximize panels, picture-in-picture)
   - User testing with mockups

3. **Technical Architecture Planning (3-5 days)**
   - WebRTC integration (already built in Phase 0)
   - Mapbox integration (already built in Phase 1)
   - Presentation rendering (PDF viewer, slide viewer?)
   - Real-time collaboration features
   - Performance considerations (video + maps + multiple panels)

4. **Component Development (3-4 weeks)**
   - Video conferencing integration (leverage Phase 0 work)
   - Map viewer component (leverage Phase 1 work)
   - Script presentation component (leverage Script Management)
   - Slideshow/presentation viewer
   - Person details panel
   - Calculator/proposal tool
   - Component communication/state management

5. **Integration & Testing (2 weeks)**
   - Integrate all components into unified view
   - Performance optimization
   - Cross-browser testing
   - Network condition testing (video quality)
   - User acceptance testing with Consultants

6. **Meeting Handoff Integration (1 week)**
   - Pre-meeting alerts (15 min)
   - Handoff workflow with reason tracking
   - Availability toggle
   - Automated assignment (10 min mark)
   - Effort tracking infrastructure
   - Sales Manager escalation

**Resources Needed:**
- Product Manager (workflow research, requirements)
- UX Designer (unified interface design)
- Backend Developer (APIs, video infrastructure)
- Frontend Developer (complex multi-component UI)
- QA Engineer
- Consultant SMEs (subject matter experts for testing)

**Timeline Estimate:** 6-8 weeks (Weeks 14-21 in overall sequence)

**Dependencies:**
- Person data model (SunCRM) ← Phase 1
- **WebRTC infrastructure** ← Phase 0 (CRITICAL - already built)
- **Script management system** ← Phase 1 (already built)
- **Mapbox integration** ← Phase 1 (already built)
- Pipeline integration for Person assignment ← Phase 1-2
- Calendar system ← Phase 1

**Risk Factors:**
- Complex UI with many components - performance critical
- Video conferencing reliability
- Third-party integrations (maps)

---

### Updated Build Timeline with Foundation

**Phase 0 - Architecture Foundation (Weeks 1-3):**
- Multi-tenant database architecture
- User Authentication & Roles (multi-tenant)
- **WebRTC Video Infrastructure** (signaling, TURN/STUN, 1-to-1, 1-to-many)
- Pipeline Foundation (multi-tenant, configurable)
- Event System
- Notification Infrastructure

**Phase 1 - Core Systems (Weeks 4-6):**
- Campaign Management
- Person Data Model
- **Script Management System** (Sales Manager admin UI)
- **Mapbox Integration**
- Basic Commission Engine (multi-tenant rules)

**Phase 2 - Priority 1: Setter Dashboard (Weeks 7-10):**
- Setter Dashboard UI
- **SunCRM Pipeline Extension** (BUILD IN PARALLEL - CRITICAL!)
- KPI Aggregation
- Hours Tracking
- Knowledge Base

**Phase 3 - Priority 2: Leaderboard (Weeks 11-13):**
- Ranking Algorithm
- Achievement Badge System
- Leaderboard UI

**Phase 4 - Priority 3: Consultant Meeting View (Weeks 14-21):**
- Unified multi-panel UI development
- Meeting Handoff System
- Effort tracking infrastructure
- Integration & Testing

**Total Timeline:** 21 weeks

**Trade-off:** 6 weeks additional upfront investment (WebRTC, multi-tenancy, foundation) prevents months of refactoring later

---

### Summary - Action Plan

| Priority | Feature | Timeline | Key Dependencies | Critical Risk |
|----------|---------|----------|------------------|---------------|
| 1 | Sundialer Setter Dashboard | Weeks 7-10 (3-4 weeks) | Pipeline, SunCRM extension, Commission engine | SunCRM pipeline data needed for payment visibility |
| 2 | Setter Leaderboard | Weeks 11-13 (2-3 weeks) | Setter Dashboard data, Pipeline tracking | Ranking algorithm performance at scale |
| 3 | Consultant Meeting View | Weeks 14-21 (6-8 weeks) | WebRTC (built), Mapbox (built), Script Mgmt (built) | Complex multi-component UI performance |

**Sequential Build Approach:**
1. **Weeks 1-3:** Foundation (WebRTC, multi-tenancy, pipeline)
2. **Weeks 4-6:** Core systems (script mgmt, Mapbox, commission)
3. **Weeks 7-10:** Build Setter Dashboard (+ SunCRM pipeline in parallel)
4. **Weeks 11-13:** Build Setter Leaderboard (leverages dashboard data)
5. **Weeks 14-21:** Build Consultant Meeting View (leverages foundation work)

**Parallel Work Opportunities:**
- Consultant Meeting View design/research can start during Weeks 1-6
- Pipeline foundation development supports all three priorities
- Commission engine development can happen during Phase 1

---

## Reflection and Follow-up

### What Worked Well

**Session 2 Effectiveness:**
- Completing all 12 roles provided comprehensive user perspective
- Meeting handoff system emerged organically from Consultant pain points
- Recruiting/training system discovery addressed critical high-turnover problem
- Dependency mapping revealed critical blocking issues early
- Architectural decision-making (WebRTC, multi-tenancy) resolved major unknowns
- Action planning with realistic timeline (21 weeks) sets proper expectations

**Techniques Used:**
- Role Playing technique extremely effective for discovering real user needs
- Convergent Phase successfully organized 200+ ideas into actionable priorities
- Dependency Mapping revealed hidden blockers and critical path

### Areas for Further Exploration

**Modules Requiring Deep Research:**
1. **SunProject** - Solar installation PM workflows, installer field needs, milestone tracking
2. **SunDesk** - Support workflow best practices, customer communication lifecycle
3. **Executive Dashboard** - KPI frameworks for solar sales industry
4. **Operations** - Efficiency metrics, process optimization frameworks
5. **Finance** - Tax compliance (1099s), financial reporting, ACH integration

**Technical Research Needed:**
1. **WebRTC at Scale** - 1-to-200 participant video sessions (Trainer)
2. **Employment Site APIs** - Indeed, LinkedIn, ZipRecruiter integration specifics
3. **Multi-Tenant Database Patterns** - Best practices for data isolation
4. **Trouble Ticketing Systems** - Industry best practices
5. **Commission Calculation Engines** - Flexible rules engine architectures

**Business Model Research:**
1. **Lead Marketplace** - Revenue model, network effects strategy
2. **SaaS Pricing** - Per-user, per-tenant, feature tiers
3. **Contractor Economics** - Payment timing, cash flow implications

### Recommended Follow-up Techniques

For next brainstorming sessions:

1. **First Principles Thinking** - Strip down commission system, pipeline architecture to fundamental truths
2. **Pre-mortem Analysis** - Imagine failure scenarios for top 3 priorities, work backwards to prevent
3. **SCAMPER Method** - Apply creativity lenses to existing features (Substitute/Combine/Adapt/Modify/Put/Eliminate/Reverse)
4. **What If Scenarios** - Explore alternative approaches to WebRTC, multi-tenancy, pipeline
5. **Failure Mode Analysis** - Systematically explore how each component could fail

### Questions That Emerged

**Architecture Questions:**
1. How to handle WebRTC scaling for 200-person Trainer sessions? (MCU vs SFU?)
2. What's the optimal multi-tenant database isolation strategy? (shared schema vs separate schemas vs separate databases?)
3. How to design commission rules engine for maximum flexibility without becoming programming language?
4. What's the event streaming architecture? (Kafka, RabbitMQ, AWS EventBridge, custom?)
5. How to handle real-time bidirectional pipeline updates at scale?

**Product Questions:**
1. What's the minimum viable Setter Dashboard? (can we ship without all KPIs?)
2. Should leaderboards be opt-in or mandatory? (privacy concerns vs engagement)
3. What's the graduation rate target for Trainer module? (acceptable failure rate?)
4. How many Consultants typically available for handoffs? (affects round-robin effectiveness)
5. What's acceptable commission calculation latency? (real-time vs batch processing?)

**Business Questions:**
1. What's the pricing model for multi-tenant SaaS? (per user, per tenant, tiered?)
2. When to launch lead marketplace? (MVP feature or future innovation?)
3. How to measure ROI on recruiting/training system investment?
4. What's the target Setter retention rate improvement?
5. What's acceptable CAC (customer acquisition cost) for Setter recruiting?

### Next Session Planning

**Suggested Topics:**

1. **Research Synthesis Session** - Compile findings from SunProject, SunDesk, Executive, Operations, Finance research

2. **Technical Architecture Deep Dive** - Design sessions for:
   - Multi-tenant database architecture
   - WebRTC infrastructure (especially 1-to-200 scaling)
   - Event-driven pipeline architecture
   - Commission rules engine

3. **MVP Scoping Session** - Define absolute minimum features for each priority:
   - What's the smallest Setter Dashboard that solves payment visibility?
   - What's the simplest Leaderboard that drives engagement?
   - What's the core Consultant Meeting View that eliminates app-switching?

4. **Lead Marketplace Strategy** - Dedicated session on business model, technical architecture, go-to-market

5. **AI Success Intelligence** - Deep dive on AI analysis features:
   - Voice analysis requirements
   - Video analysis requirements
   - Success pattern detection algorithms
   - Real-time coaching feasibility

**Recommended Timeframe:**
- Research synthesis: 2-3 weeks (allow time for research)
- Technical architecture: 1 week (before development starts)
- MVP scoping: 1 week (parallel with architecture)

**Preparation Needed:**
- Conduct SunProject, SunDesk, Executive, Operations, Finance research
- Prototype WebRTC scaling options
- Research multi-tenant architecture patterns
- Interview current Setters and Consultants about MVP priorities
- Analyze competitor products for baseline feature sets

---

## Critical Research Questions from Both Sessions

**Session 1 Research Needs:**
- SunProject module capabilities (solar installation PM best practices)
- Self-esteem building features for Setters (psychological research)
- Real-time AI analysis feasibility during calls/meetings
- Lead marketplace technical architecture and business model

**Session 2 Research Needs:**
- Support workflow best practices (SunDesk)
- Solar installation PM workflows (SunProject)
- Installer field worker needs (SunProject)
- Executive dashboard KPIs (solar sales industry)
- Operations efficiency metrics
- Financial reporting requirements and 1099 compliance
- Trouble ticketing system best practices
- Employment site API integration specifics (Indeed, LinkedIn, etc.)
- WebRTC scaling for 200-participant sessions
- Multi-tenant database isolation strategies

---

## Key Architectural Insights

**From Both Sessions:**

1. **Pipeline is Central Nervous System** - Progressive build across all modules, single source of truth, event-driven

2. **Event-Driven Architecture Required** - Status changes trigger cascading updates and notifications across modules

3. **Role-Based Data Access Layers** - Personal (own data), Team/Module (managers), Global (executives/admins)

4. **Configurable Everything for Multi-Tenancy** - Pipeline stages, commission rules, communication purposes, approval workflows all per-tenant configurable

5. **Approval Workflow Engine Critical** - Not just permissions, but "who can change what, who must approve, what's the chain" with audit trails

6. **Effort-Based Fairness Philosophy** - Round-robin systems reward hard work (calls made, handoffs accepted), not outcomes (sales closed)

7. **Bidirectional Visibility** - Setters see forward (outcomes in SunCRM), Consultants see forward (installation in SunProject)

8. **WebRTC as Foundation** - Custom video infrastructure enables Recruiter, Trainer (200-person), Consultant without vendor lock-in

9. **Multi-Tenancy from Day One** - Build complexity early to avoid months of refactoring

10. **Script Management as Cross-Module Asset** - Sales Manager-created scripts used by multiple roles (Recruiter, Consultant, SunDesk)

11. **Intelligent Assignment Algorithms** - Performance-based team balancing (Setter Manager assignment), effort-based round-robin (meeting handoffs, Person distribution)

12. **Built-in Governance** - Trouble ticketing, audit trails, approval workflows built into platform core

---

_Session facilitated using the BMAD BMM brainstorming framework_
_Status: Complete - All roles explored, priorities defined, action plan created, dependency mapping completed_
