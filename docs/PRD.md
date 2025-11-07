# Sunup Product Requirements Document (PRD)

**Author:** Greg
**Date:** 2025-11-05
**Project Level:** 4
**Target Scale:** Enterprise Platform

---

## Goals and Background Context

### Goals

1. **Eliminate Fragmentation Tax**: Recover 50-100 hours/week of wasted coordination time for mid-market solar companies through unified platform integration

2. **Reduce Contractor Turnover**: Decrease Setter/Consultant churn from 50-70% annually to 30-40% through payment transparency, gamification, and career development features

3. **Increase Sales Effectiveness**: Drive 20-30% revenue increase for customers through improved conversion rates, reduced meeting friction, and AI-powered coaching

4. **Achieve Product-Market Fit**: Secure first customer (250 users, $25K MRR) by Month 6 with demonstrated 5-6x ROI

5. **Build Sustainable Competitive Moat**: Create defensible market position through integration (high switching costs), network effects (AI improvement at scale), and industry-specific domain expertise

6. **Establish AI-First Development Economics**: Validate 10-20x productivity gains enabling 1-2 engineers to deliver enterprise platform at <$4K cash burn for 21-week MVP

7. **Position for Multi-Vertical Expansion**: Design architecture supporting 70-80% code reuse for future expansion to HVAC, roofing, and windows verticals

### Background Context

Solar installation companies operating across the $10B+ residential solar industry face a critical operational challenge: the "fragmentation tax." With 12+ distinct roles (Setters, Consultants, Sales Managers, Project Managers, Installers, Support Staff, Recruiters, Trainers, System Admins, Executives, Finance, Operations) coordinating across the complete sales-to-installation lifecycle, these companies cobble together Google Sheets, generic CRMs, separate dialers, video conferencing tools, project management systems, and manual commission tracking. This fragmentation costs mid-market companies 50-100 hours/week in wasted reconciliation and coordination, creates departmental opacity (Setters can't see payment outcomes, Consultants can't see installation progress), and drives 50-70% annual contractor turnover due to payment distrust and career progression uncertainty.

Traditional software economics made solving this problem infeasible—building a comprehensive solar platform would require 10-20 engineers, $5-10M+ funding, and 3-5 years to MVP. However, AI-powered development tools have fundamentally changed the equation: 1-2 senior engineers can now achieve what previously required large teams, reducing development costs by 95-99% (from $1.5-6M to <$4K cash burn) and compressing timelines from years to months. This breakthrough makes it economically viable to build software that matches solar industry processes exactly, rather than forcing companies to adapt to generic horizontal tools. With a founder who lives the problem daily as a Solar Consultant and possesses deep technical expertise, Sunup represents a rare founder-market fit opportunity to dominate an underserved vertical through integration, transparency, and AI-powered intelligence.

---

## Requirements

### Functional Requirements

#### Core Platform Infrastructure

**FR001:** Multi-tenant architecture with Row-Level Security (RLS) enforced at query layer ensuring complete data isolation between tenant organizations

**FR002:** Event-driven pipeline system where status changes (Lead → Set → Met → QMet → Sale → Installation) trigger cascading notifications, commission calculations, and cross-role updates in real-time

**FR003:** Real-time WebSocket subscriptions providing sub-second latency for critical flows including pipeline updates, commission visibility, and QMet alerts

**FR004:** Configurable pipeline stages per tenant allowing customization of sales workflow while maintaining system integrity

#### User Management & Authentication

**FR005:** Multi-tenant authentication via Clerk supporting 12 distinct roles with role-based access control (RBAC): Setters, Consultants, Sales Managers, Setter Managers, Project Managers, Installers, Recruiters, Trainers, System Admins, Executives, Finance, Operations

**FR006:** User profile management including contractor status (1099), hours tracking, performance metrics, and career progression indicators

#### Pipeline & CRM (SunCRM)

**FR007:** Person and Organization management with complete contact history, relationship mapping, and pipeline status tracking across all stages

**FR008:** Bidirectional visibility where Setters see forward outcomes (Met → Sale status), Consultants see installation progress, and all roles access relevant context

**FR009:** Historical notes and activity timeline per Person/Organization accessible to authorized roles with audit trail

**FR010:** Satellite property imagery integration via Mapbox for instant solar viability assessment during calls and meetings

#### Dialer & Campaign Management (Sundialer)

**FR011:** Predictive dialer with campaign management enabling Setters to join campaigns and receive sequential call assignments with pre-loaded Person/Organization details

**FR012:** Call disposition tracking with script adherence progress and qualification enforcement (cannot book appointment until required questions answered)

**FR013:** Campaign assignment and scheduling by Setter Managers with real-time availability tracking and hours-active monitoring

#### Video Conferencing & Meeting Tools (SunMeeting)

**FR014:** Built-in WebRTC 1-to-1 video conferencing for Consultant-Person meetings eliminating need for external tools like Zoom

**FR015:** Unified Consultant meeting interface consolidating video, Person details, scripts, satellite maps, slideshow viewer, calculator, knowledge base, and chat in single collapsible/resizable layout

**FR016:** Meeting handoff system with pre-meeting alerts (15 min), manual handoff capability, availability toggling, and automated round-robin assignment at 10-minute threshold

**FR017:** Sales Manager escalation workflow when no Consultant coverage exists providing 5 intervention options

#### Commission Engine

**FR018:** Configurable commission calculations supporting kilowatt-based formulas (panels: per-kW by make/model, batteries: flat rate) with real-time visibility for contractors

**FR019:** Multi-stage commission triggers at QMet (Setter payment) and Sale completion (Consultant payment) with audit trail and Finance approval workflow

**FR020:** Commission dispute resolution system with transparent calculation visibility and manual adjustment capability by Finance with approval logging

#### Dashboards & Reporting

**FR021:** Setter Dashboard displaying real-time metrics: Sets (today/week), QMets, commission earned, hours active (minimum 30/week), and immediate QMet notification alerts

**FR022:** Consultant Dashboard showing intro calls, rescheduling calls, today's appointments, conversion rates (Mets → QMets → Sales), and commission tracking

**FR023:** Sales Manager performance dashboard with visual charts, trend analysis, top performer identification, underperformer flagging with AI coaching suggestions, and team capacity planning

**FR024:** Finance commission reconciliation dashboard with approval queue, payment processing status, dispute tracking, and audit reporting

#### Leaderboard & Gamification

**FR025:** Real-time leaderboards ranking Setters by Sets, QMets, conversion rates with time-period filters (today/week/month) and peer comparison visibility

**FR026:** Achievement badge system unlocking milestones and displaying on user profiles to drive engagement and recognition

**FR027:** Top performer call recording library accessible to all Setters for peer learning with playback, search, and tagging capabilities

#### Knowledge Base & Communication

**FR028:** Searchable knowledge base with training materials, documentation, FAQs, and best practices accessible in-context during calls and meetings

**FR029:** Internal messaging system enabling direct communication between roles (Setter ↔ Setter Manager, Consultant ↔ Sales Manager, all ↔ Finance) without leaving platform

**FR030:** Announcement system for Setter Managers to broadcast daily focus, contests, wins, and team updates visible on Setter Dashboard login

#### Script Management

**FR031:** Sales Manager script creation and management for Setters (appointment setting) and Consultants (meeting presentation, rebuttals) with version control

**FR032:** Script presentation overlay during calls/meetings with progress tracking, section completion checkmarks, and scrolling display synchronized to conversation flow

**FR033:** Script adherence tracking measuring completion percentage and identifying commonly skipped sections for coaching opportunities

#### Mobile & Offline Capabilities

**FR034:** React Native mobile app for Installers with offline-first architecture supporting work order access, photo capture, checklist completion, and background sync when connectivity returns

#### System Administration

**FR035:** System Admin configuration interface for managing users, roles, pipeline stages, commission rules, approval workflows, and tenant settings

### Non-Functional Requirements

**NFR001: Performance**
- Page load time: <2 seconds (P95)
- Time to interactive: <3 seconds
- Real-time updates: Sub-second latency for critical flows (pipeline changes, QMet alerts, commission calculations)
- WebRTC video latency: <200ms for 1-to-1 sessions
- Database query performance: <100ms for tenant-scoped queries at 50,000 concurrent users

**NFR002: Security**
- Multi-tenant Row-Level Security (RLS) enforced at every database query with zero cross-tenant data leakage
- OWASP Top 10 protection mandatory: No XSS, SQL injection, CSRF, or other common vulnerabilities
- Authentication via Clerk with OAuth2, session management, and MFA support
- All sensitive data encrypted at rest and in transit (TLS 1.3+)
- Automated security linting and code review for every PR
- Annual penetration testing (Year 2+)

**NFR003: Accessibility**
- WCAG 2.1 Level AA compliance mandatory across all interfaces
- Semantic HTML with proper ARIA labels for screen readers
- Full keyboard navigation support without mouse dependency
- Color contrast ratios meeting AA standards (4.5:1 for normal text, 3:1 for large text)
- Motion sensitivity support (respects prefers-reduced-motion)
- Automated accessibility testing via axe-core in CI/CD pipeline

**NFR004: Reliability & Availability**
- 99.5% uptime SLA (maximum 3.65 hours downtime per month)
- Zero-downtime deployments via rolling updates
- Graceful degradation when dependent services unavailable
- Error tracking and monitoring via Sentry with <5 minute alert response
- Database backups: Hourly incremental, daily full, 30-day retention
- Disaster recovery: <1 hour RTO, <15 minutes RPO

**NFR005: Scalability**
- Support 50,000+ concurrent users by Year 3 without performance degradation
- Convex serverless backend auto-scales with load
- Vercel edge functions globally distributed for low latency
- Database composite indexes optimized for tenant-scoped queries at scale
- WebRTC SFU architecture supporting 200-person video sessions (Phase 2 Training module)

**NFR006: Browser & Platform Support**
- Chrome/Edge (latest 2 versions) - Primary target, full feature support
- Firefox (latest 2 versions) - Secondary, full feature support
- Safari (latest 2 versions) - Secondary, full feature support
- No IE11 support
- Mobile: React Native apps (iOS 15+, Android 10+) for Installers
- Web-responsive design for all other roles with mobile browser access

**NFR007: Compliance & Data Governance**
- CCPA compliance for California customer data
- GDPR-ready architecture for international expansion
- 1099 contractor financial data handling per IRS requirements
- Audit trail for all financial transactions and commission adjustments
- SOC 2 Type II certification (Year 2 target)
- Data retention policies configurable per tenant with automated purging

---

## User Journeys

### Journey 1: Setter - Appointment Setting and Commission Tracking

**Actor:** Sarah (Setter, independent contractor)

**Goal:** Set qualified appointments and track commission earnings in real-time

**Journey:**

1. **Login & Daily Start**
   - Sarah logs into Sunup and sees Setter Dashboard
   - Views daily announcement from Setter Manager: "Focus on homeowners with electric bills >$200/month. Contest: Top 3 Setters win $500 bonus!"
   - Checks current stats: 12 Sets this week, 3 QMets, $450 commission earned

2. **Join Campaign & Make Calls**
   - Clicks "Join Campaign" button
   - System assigns her to "High-Value Homeowners - Northern California" campaign
   - First call loads: John Smith, 123 Oak St, Sacramento
   - Satellite map shows large roof with good sun exposure → promising candidate
   - Script overlay appears with progress tracking
   - Makes call, follows script with checkmarks for each completed section

3. **Qualify and Book Appointment**
   - John is interested, Sarah asks qualifying questions (script enforces completion)
   - System won't allow booking until all required fields answered
   - Sarah completes qualification, system shows "✅ Qualified - Ready to Book"
   - Books appointment for Consultant meeting Thursday 3pm
   - Disposition logged: "Set → Met" pipeline status updated

4. **Real-Time Commission Visibility**
   - 2 hours later, Sarah receives notification: "🎉 QMet Alert! John Smith qualified"
   - Dashboard updates: 13 Sets this week, 4 QMets, $500 commission earned (+$50 for QMet)
   - Sarah can see: "John Smith: Set → Met → QMet → [Awaiting Sale]"

5. **Peer Learning**
   - During break, Sarah checks leaderboard
   - She's #4 this week (wants to hit Top 3 for bonus)
   - Listens to top performer's call recording to learn objection handling techniques
   - Notes: Top performer pauses 2-3 seconds after asking qualifying questions

6. **End of Day**
   - Dashboard shows: 6 hours active today (minimum 30/week requirement on track)
   - 5 Sets today, 15 total this week
   - Commission tracker: $550 earned this week, $2,100 this month

**Success Criteria:**
- ✅ Real-time commission visibility eliminates "where's my money?" frustration
- ✅ Qualification enforcement ensures quality Mets for Consultants
- ✅ Peer learning reduces ramp time for new Setters
- ✅ Gamification (leaderboard, contests) drives engagement

---

### Journey 2: Consultant - Unified Meeting Experience

**Actor:** Mike (Consultant, promoted from Setter 6 months ago)

**Goal:** Conduct solar consultation meeting without app-switching stress

**Journey:**

1. **Pre-Meeting Preparation**
   - 15 minutes before meeting with Jane Doe, Mike receives alert: "Take Meeting or Handoff?"
   - Clicks "Take Meeting" (confirming availability)
   - Reviews Person details: Jane Doe, referred by neighbor, interested in 8kW system
   - Reads historical notes from Setter: "Budget: $30-40K, high electric bill ($350/month), decision maker"

2. **Start Meeting - Unified Interface**
   - 3pm: Mike clicks "Start Meeting" from Today's Appointments
   - WebRTC video starts automatically (no Zoom needed)
   - Unified interface loads with collapsible panels:
     - Left: Person details + notes
     - Center: Video + screen sharing area
     - Right: Script with progress tracking
   - Property satellite map visible (Jane's home, large south-facing roof)

3. **Conduct Consultation**
   - Mike follows script, checking off sections as he progresses
   - Shares slideshow (built-in viewer, no screen-sharing switch)
   - Jane asks: "What about financing?"
   - System automatically presents financing options panel to Mike based on Jane's location and credit tier:
     - Sunlight Financial: 2.99% APR, 20-year term (Consultant can fill form)
     - Mosaic: 3.49% APR, 25-year term (Person must fill form)
     - GoodLeap: 0% APR, 18-month promo (Person must fill form)
   - Mike reviews options with Jane, she chooses Mosaic
   - Mike selects Mosaic → System automatically displays financing application form in Jane's browser
   - Form simultaneously appears in Mike's interface via screen sharing so he can guide Jane through completion
   - Jane fills out application (SSN, income, employment) while Mike assists with any questions
   - Jane submits form directly to Mosaic
   - Approval returns in 60 seconds: "Approved - $35,000 @ 3.49% APR"
   - Mike shares ROI calculator showing 6-year payback with approved financing
   - Presents pre-filled agreement ready for signature

4. **Handle Objection**
   - Jane hesitates: "That's a lot of money upfront"
   - Script shows rebuttal section automatically
   - Mike addresses financing options, zero-down programs
   - Jane agrees to move forward

5. **Close & Update Pipeline**
   - Jane signs agreement digitally
   - Mike updates Person status: "Met → QMet → Sale"
   - Event triggers:
     - Commission calculation: Mike earns $800 for sale
     - Setter Sarah gets notification: Sale completed on her Set
     - Sales Manager sees dashboard update: Mike closed deal, conversion rate +5%
     - Handoff to Project Manager for installation scheduling

6. **No Meeting Overrun Stress**
   - Meeting runs 5 minutes over (next meeting at 4pm)
   - System already broadcast handoff alert at 3:45pm
   - Another Consultant accepted handoff for 4pm meeting
   - Mike smoothly wraps up with Jane, no panic about next customer

**Success Criteria:**
- ✅ Zero app-switching (all tools in one interface)
- ✅ No screen-sharing fumbles (built-in viewers)
- ✅ Automated financing form delivery to Person's browser with simultaneous Consultant view
- ✅ Automatic handoff system eliminates meeting overrun stress
- ✅ Real-time pipeline updates visible to all stakeholders

---

### Journey 3: Sales Manager - Data-Driven Coaching

**Actor:** Carlos (Sales Manager, responsible for 8 Consultants)

**Goal:** Identify coaching opportunities and improve team performance

**Journey:**

1. **Morning Dashboard Review**
   - Carlos logs in, sees Sales Manager Dashboard
   - Visual charts show team performance trends:
     - Conversion rates: Team average 45% (Met → Sale)
     - Top performer: Lisa 62%, Bottom: Jake 28%
   - AI flags underperformers: "Jake's conversion rate down 15% this month"

2. **Deep Dive on Underperformer**
   - Clicks on Jake's profile
   - Reviews metrics:
     - Intro calls: 18/week (good volume)
     - Rescheduling calls: 12/week (good follow-up)
     - Script adherence: 55% (below 80% target)
     - Common skipped sections: Objection handling, closing
   - AI suggestion: "Jake needs coaching on objection handling"

3. **1-on-1 Coaching Preparation**
   - Carlos listens to Jake's recent meeting recording
   - Identifies issue: Jake doesn't pause after asking qualifying questions, dominates conversation
   - Notes talk ratio: 75% Jake, 25% customer (should be 40/60)
   - Compares to Lisa's call: She pauses 3-4 seconds, lets customer talk

4. **Team Meeting**
   - 9am team meeting (all Consultants join)
   - Carlos reviews team metrics without individual blame
   - Highlights: "Team average objection handling success: 60%, top performers: 85%"
   - Shares anonymized best practice from Lisa's recording
   - Team discussion: "What techniques work for handling price objections?"

5. **Individual Coaching Session**
   - 2pm: Carlos meets 1-on-1 with Jake
   - Shows Jake's metrics, focusing on script adherence gap
   - Plays Jake's recording side-by-side with Lisa's
   - Action plan: "Practice pausing 3 seconds after each question, aim for 40/60 talk ratio"
   - Carlos assigns training module: "Advanced Objection Handling"

6. **Commission Approval**
   - End of day: Carlos reviews commission approval queue (15 items)
   - Transparent calculations visible for all commissions
   - Approves 14, flags 1 for Finance review (unusual kW calculation)
   - Audit trail logged for all approvals

**Success Criteria:**
- ✅ Data gathering time reduced from hours to minutes
- ✅ AI surfaces coaching opportunities automatically
- ✅ Call recordings enable specific, actionable feedback
- ✅ Team meetings focus on insights, not manual aggregation
- ✅ Commission approval streamlined with transparency

---

### Journey 4: Finance - Commission Reconciliation

**Actor:** Patricia (Finance, handles commission payments for 50+ contractors)

**Goal:** Reconcile and approve commission payments efficiently

**Journey:**

1. **Commission Dashboard Review**
   - Patricia opens Finance commission dashboard
   - Sees approval queue: 42 pending commissions totaling $87,400
   - Filters by priority: QMet commissions (2-day SLA), Sale commissions (5-day SLA)

2. **Review Individual Commission**
   - Clicks on commission for Setter Sarah: $50 QMet commission
   - Transparent calculation visible:
     - Person: John Smith
     - Pipeline: Set → Met → QMet (qualified by Consultant Mike)
     - Rate: $50 per QMet (standard Setter commission)
     - Verification: All qualification criteria met
   - Audit trail shows: Sarah set appointment, Mike qualified, system auto-calculated

3. **Flag Dispute**
   - Commission for Consultant Tom: $950 (8.5kW system)
   - Patricia notices: Rate should be $110/kW = $935
   - Flags for Sales Manager review: "Commission calculation discrepancy"
   - Adds note: "Verify panel make/model - rate may vary"

4. **Bulk Approval**
   - Selects 40 verified commissions (no issues)
   - Bulk approve with single click
   - System logs approval timestamp and approver ID
   - Contractors receive notification: "Commission approved, payment processing"

5. **Handle Dispute**
   - Setter disputes QMet commission: "I set 3 appointments that qualified, only seeing 2"
   - Patricia checks audit trail:
     - Set 1: John Smith → QMet ✅ Paid
     - Set 2: Mary Jones → QMet ✅ Paid
     - Set 3: Bob Lee → Met (not yet qualified by Consultant)
   - Patricia messages Setter: "Bob Lee still in Met stage, awaiting Consultant qualification"
   - Transparent visibility resolves dispute in 5 minutes (vs hours of back-and-forth)

**Success Criteria:**
- ✅ Commission reconciliation time reduced from 15-20 hrs/week to 3-5 hrs/week
- ✅ Transparent calculations eliminate most disputes before they arise
- ✅ Audit trail provides instant resolution for remaining disputes
- ✅ Bulk approval streamlines workflow

---

### Journey 5: Cross-Role Visibility - Installation Progress

**Actor:** Mike (Consultant), Sarah (Setter), Jane Doe (Customer)

**Goal:** End-to-end visibility from sale to installation completion

**Journey:**

1. **Post-Sale Handoff**
   - Mike closes sale with Jane Doe for 8kW system
   - Updates pipeline: "Sale → Installation Scheduled"
   - Event triggers:
     - Project Manager Rachel assigned
     - Jane receives onboarding email with installation timeline
     - Mike's dashboard shows: "Jane Doe: Sale → Installation Scheduled"

2. **Setter Visibility**
   - Sarah (original Setter) receives notification: "Jane Doe: Sale → Installation Scheduled"
   - Dashboard updates: "Jane Doe: Set → Met → QMet → Sale → Installation Scheduled"
   - Sarah can see entire journey from her first call to installation

3. **Installation Milestones**
   - Rachel (Project Manager) updates milestones:
     - Permits Submitted ✅
     - Permits Approved ✅
     - Equipment Ordered ✅
     - Installation Scheduled: March 15
   - Mike sees updates in real-time: "Jane Doe installation: March 15"
   - Sarah sees: Final commission triggered when "Installation Complete"

4. **Installation Day**
   - Installer crew arrives, uses mobile app (offline-first)
   - Uploads photos, completes checklists
   - Updates status: "Installation Complete"
   - Event triggers:
     - Final commissions released (Mike, Sarah)
     - Jane receives completion notification
     - Support team notified: Begin post-sale onboarding

5. **Post-Installation**
   - Support staff reaches out to Jane: 30-day check-in
   - System shows complete history: Sarah's original call → Mike's consultation → Rachel's installation
   - Jane has issue: "One panel not producing power"
   - Support creates ticket, routes to Project Manager
   - Rachel dispatches Installer for service call

**Success Criteria:**
- ✅ Bidirectional visibility: Setters see outcomes, Consultants see installation progress
- ✅ Event-driven updates eliminate manual coordination
- ✅ Customer receives proactive communication at every stage
- ✅ Support has complete context without asking "what happened?"

---

## UX Design Principles

### 1. **Unified Workspace Over Tool Switching**

Every role gets a single, intelligent workspace containing everything needed for their job—no alt-tabbing, no separate logins, no context switching. Integration IS the value proposition.

- Consultants conduct entire meetings (video, scripts, maps, calculators, knowledge base) in one interface
- Setters access dialer, scripts, property maps, commission tracking without leaving dashboard
- Context follows the user—Person details, history, pipeline status always accessible

### 2. **Real-Time Transparency & Bidirectional Visibility**

Information flows instantly across roles, eliminating opacity and manual reconciliation.

- Setters see outcomes (Set → QMet → Sale) in real-time
- Consultants see installation progress for their sold projects
- Finance sees complete commission lineage with audit trail
- Event-driven architecture: Pipeline changes trigger automatic updates across all stakeholders

### 3. **Progressive Disclosure & Contextual Tools**

Show what's needed now, hide what's not. Interfaces adapt to workflow context.

- Collapsible/resizable panels let users customize layout per task
- Script sections reveal based on conversation progress
- Financing options appear when needed, not before
- Knowledge base searches prioritize role-specific content

### 4. **Enforcement Over Trust (Guardrails, Not Gates)**

System enforces process compliance while maintaining flow—prevent errors before they happen.

- Qualification enforcement: Can't book appointment until required questions answered
- Script adherence tracking: System knows which sections completed
- Commission rules applied automatically with transparent calculations
- Workflow validation before critical actions (e.g., "All Mets must be QMets before booking")

### 5. **Contractor-First Design**

Independent contractors (Setters, Consultants) are primary users—design for trust, transparency, and motivation.

- Real-time commission visibility eliminates payment anxiety
- Leaderboards and gamification drive healthy competition
- Top performer call recordings enable peer learning
- Achievement badges recognize milestones and contributions
- Clear career progression paths (Setter → Consultant → Sales Manager)

### 6. **Minimal Cognitive Load**

Reduce mental overhead—system remembers context, automates tedious tasks, surfaces insights proactively.

- System tells users "what to do next" (optimal action recommendations)
- Auto-complete and smart defaults based on Person/Organization history
- AI coaching provides real-time feedback without interrupting flow
- Announcements and notifications prioritized by urgency and relevance

### 7. **Platform-Optimized Experiences**

Tailor UX to where work happens and how users prefer to work.

- **Mobile Apps (React Native):**
  - **Installers:** Offline-first, photo capture, work orders, checklist completion
  - **Setters:** Join campaigns, make calls, view scripts, satellite maps, track commissions on-the-go
  - **Consultants:** Conduct meetings with unified interface, WebRTC video, scripts, satellite maps, financing forms, mobile-optimized layout
- **Desktop Web App:**
  - **Consultants/Managers:** Multi-panel unified interface (preferred for complex meetings), rich data visualization, keyboard shortcuts
  - **Finance/Admin:** Complex workflows requiring larger screens and detailed data access
- **All roles:** Responsive web design for mobile browser access as fallback

### 8. **Accessibility as Foundation, Not Afterthought**

WCAG 2.1 Level AA compliance mandatory—accessible design benefits everyone.

- Keyboard navigation for all critical flows
- Screen reader support with semantic HTML and ARIA labels
- Color contrast ratios meeting AA standards
- Motion sensitivity support (respects prefers-reduced-motion)
- Automated testing (axe-core) in CI/CD pipeline

---

## User Interface Design Goals

### Core Screens by Role

**Setter:**
- **Dashboard:** Daily stats, announcements, leaderboard preview, commission tracker, active hours
- **Campaign View:** Join campaign, call queue, Person details, satellite map, script overlay
- **Leaderboard:** Rankings by various metrics (Sets, QMets, conversion rates), time filters
- **Commission Tracker:** Real-time earnings, payment history, dispute resolution
- **Training Library:** Top performer recordings, knowledge base, achievement badges

**Consultant:**
- **Dashboard:** Today's appointments, intro/reschedule calls, conversion metrics, commission tracker
- **Meeting Interface:** Unified layout with video, Person details, script, satellite map, slideshow viewer, financing forms, calculator, knowledge base, chat
- **Availability Toggle:** Quick on/off switch for meeting handoff system
- **Meeting Queue:** Upcoming meetings, handoff alerts, coverage status

**Sales Manager:**
- **Performance Dashboard:** Team metrics with visual charts, top/underperformer identification, conversion funnels, AI coaching suggestions
- **Team View:** Individual Consultant profiles with detailed metrics, script adherence, talk ratios
- **Commission Approval Queue:** Transparent calculations, bulk approve, flag for Finance review
- **Call Recording Library:** Playback, search, tag, share with team

**Finance:**
- **Commission Dashboard:** Approval queue with priority filters, bulk actions, dispute tracking
- **Audit Trail View:** Complete commission lineage, approval history, adjustment logs
- **Payment Processing:** Batch payment execution, contractor notifications

**System Admin:**
- **Configuration Interface:** User management, role assignment, pipeline stage configuration, commission rule builder, approval workflow designer

### Key UI Patterns

**Multi-Panel Layouts:**
- Collapsible/resizable panels for desktop workflows
- User-customizable arrangements saved per role
- Responsive breakpoints for tablet/mobile adaptation

**Real-Time Updates:**
- Live counters and metrics (no page refresh required)
- Toast notifications for critical events (QMet alerts, meeting handoffs)
- Visual indicators for active status (Consultant availability, Setter campaign active)

**Data Visualization:**
- Charts and graphs for performance trends (line charts for conversion rates over time)
- Heatmaps for peak activity hours and optimal calling times
- Progress bars for script adherence, goal completion

**Forms & Validation:**
- Progressive validation (check as user types, not on submit)
- Clear error messages with actionable guidance
- Auto-save for long forms (prevent data loss)

**Theming & Branding:**
- Light/dark mode support via tweakcn (mandatory)
- Tenant-customizable brand colors and logo
- Consistent design system across all modules

---

## Epic List

### Epic 1: Foundation & Infrastructure
**Goal:** Establish project foundation with multi-tenant architecture, authentication, and core pipeline system ready for feature development

**Estimated Stories:** 8-12

**Key Deliverables:**
- Next.js 16+ project setup with TypeScript 5.8+, TailwindCSS 4+, shadcn/ui
- Convex backend with multi-tenant RLS (Row-Level Security) foundation
- Clerk authentication with 12 roles RBAC
- Event-driven pipeline system (Lead → Set → Met → QMet → Sale → Installation)
- CI/CD pipeline (GitHub Actions, Vercel deployment)
- Basic Person/Organization schema with tenantId enforcement

---

### Epic 2: Core CRM & Pipeline Management (SunCRM)
**Goal:** Deliver complete CRM functionality with Person/Organization management, pipeline tracking, and bidirectional visibility

**Estimated Stories:** 10-15

**Key Deliverables:**
- Person and Organization CRUD with pipeline status tracking
- Historical notes and activity timeline
- Bidirectional visibility (Setters see outcomes, Consultants see installation progress)
- Mapbox satellite imagery integration for property visualization
- Pipeline status change event triggers
- Search and filtering across Person/Organization records

---

### Epic 3: Predictive Dialer & Campaign Management (Sundialer)
**Goal:** Enable Setters to join campaigns, receive sequential call assignments, and track appointment setting with script adherence

**Estimated Stories:** 12-18

**Key Deliverables:**
- Campaign creation and management by Setter Managers
- Predictive dialer with call queue and auto-dialing
- Script overlay with progress tracking and completion checkmarks
- Qualification enforcement (can't book until required fields completed)
- Call disposition tracking with pipeline updates
- Hours-active monitoring and campaign assignment scheduling
- Setter Dashboard with real-time stats (Sets, QMets, commission earned, hours active)

---

### Epic 4: Video Conferencing & Unified Meeting Interface (SunMeeting)
**Goal:** Deliver 1-to-1 WebRTC video conferencing with unified Consultant meeting interface eliminating app-switching

**Estimated Stories:** 15-20

**Key Deliverables:**
- Custom WebRTC implementation with Mediasoup SFU (1-to-1 sessions)
- Unified Consultant meeting interface (video, Person details, script, satellite map, slideshow viewer, calculator, knowledge base, chat)
- Meeting handoff system (15-min pre-alerts, manual handoff, automated round-robin at 10-min threshold)
- Sales Manager escalation workflow (no Consultant coverage)
- Financing integration (auto-present options, display forms in Person's browser with Consultant screen sharing)
- Consultant Dashboard (appointments, conversion metrics, commission tracker)
- Availability toggle for handoff system

---

### Epic 5: Commission Engine & Financial Dashboards
**Goal:** Automate commission calculations with real-time contractor visibility and Finance approval workflows

**Estimated Stories:** 10-14

**Key Deliverables:**
- Configurable commission rules engine (kW-based formulas, product-specific rates)
- Multi-stage commission triggers (QMet for Setters, Sale for Consultants)
- Real-time commission visibility for contractors
- Finance commission dashboard (approval queue, bulk actions, dispute tracking)
- Audit trail for all commission calculations and adjustments
- Sales Manager commission approval workflow
- Commission dispute resolution system

---

### Epic 6: Gamification, Leaderboards & Contractor Engagement
**Goal:** Drive contractor engagement through leaderboards, achievement badges, peer learning, and transparent career progression

**Estimated Stories:** 8-12

**Key Deliverables:**
- Real-time leaderboards (Sets, QMets, conversion rates with time filters)
- Achievement badge system with milestone unlocking
- Top performer call recording library (playback, search, tagging)
- Announcement system for Setter Managers (daily focus, contests, team updates)
- Internal messaging between roles
- Searchable knowledge base with training materials
- Career progression visibility (Setter → Consultant path)

---

### Summary

**Total Epics:** 6
**Estimated Total Stories:** 63-91 stories
**Timeline:** 21 weeks (MVP)
**Target Outcome:** First customer (250 users, $25K MRR) by Month 6

**Epic Sequencing Rationale:**
1. **Epic 1** establishes technical foundation (multi-tenant RLS, auth, pipeline)
2. **Epic 2** delivers CRM core enabling all subsequent features
3. **Epic 3** enables Setter workflow (appointment setting)
4. **Epic 4** enables Consultant workflow (meeting closing)
5. **Epic 5** delivers financial transparency (commission visibility)
6. **Epic 6** drives engagement and retention (gamification)

Each epic delivers end-to-end, deployable functionality with no forward dependencies.

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

The following features and capabilities are explicitly excluded from the MVP (21-week timeline) and deferred to future phases:

### Phase 2 Features (Deferred to Months 7-24)

**Installation Project Management (SunProject):**
- Solar installation PM workflows with milestone tracking (Permits, Equipment Ordering, Installation, Inspection)
- Installer mobile app with offline-first architecture, photo capture, checklists
- Crew scheduling and dispatch management
- Equipment inventory tracking
- Post-installation support ticket system

**Post-Sale Support (SunDesk):**
- Customer support ticket management and routing
- 30-day check-ins and proactive customer communication
- Warranty tracking and service call scheduling
- Customer satisfaction surveys

**Recruiting & Applicant Tracking (SunRecruit):**
- Job posting to employment sites (Indeed, LinkedIn, ZipRecruiter)
- Applicant pipeline management (Applied → Screened → Interviewed → Hired)
- Interview scheduling and feedback tracking
- Onboarding workflows for new hires

**Training Platform (SunTrain):**
- 1-to-200 WebRTC video sessions for group training (Trainer → Setter Trainees)
- Learning Management System (LMS) with course creation, progress tracking
- Quiz/assessment engine for certification
- Training completion requirements tied to role permissions

**Advanced AI Features:**
- Moment-by-moment productivity guidance ("what's the most effective use of your time now?")
- AI-powered call coaching with real-time feedback during calls
- Predictive analytics for churn risk, conversion probability
- Success pattern analysis across customers

### Phase 1.5 Features (Weeks 22-26, Optional Polish)

**Enhanced Round-Robin Algorithms:**
- Effort-based fairness (activity-weighted, not outcome-weighted)
- Skills-based routing for Consultant specializations
- Timezone-aware scheduling

**Advanced Commission Rules:**
- Multi-factor commission structures (kW + product type + financing method)
- Team-based commission splitting
- Bonus structure configuration (contests, milestones)

**Advanced Reporting:**
- Executive dashboards with company-wide KPIs
- Custom report builder for Operations
- Forecasting and pipeline health metrics

### Multi-Vertical Expansion (Phase 3, Years 2-5)

**Adjacent Home Improvement Verticals:**
- HVAC installation and maintenance
- Roofing replacement
- Window/door installation
- Shared platform infrastructure with 70-80% code reuse

### MVP Scope Boundaries

**What MVP Does NOT Include:**

**No Multi-Language Support:**
- MVP is English-only
- Internationalization deferred to Phase 2+

**No Advanced Integrations:**
- No Salesforce/HubSpot import/export
- No QuickBooks accounting integration
- No DocuSign e-signature (using built-in digital signature)
- Limited financing partner integrations (1-2 partners for MVP, expand in Phase 2)

**No Enterprise Features:**
- No SSO (SAML, LDAP) beyond OAuth2
- No custom domain whitelabeling
- No advanced audit logging for compliance (SOC 2 deferred to Year 2)

**No Marketing Automation:**
- No email campaign builder for lead nurturing
- No SMS marketing campaigns
- No landing page builder for lead capture

**Limited Mobile App Scope:**
- MVP: Setter and Consultant mobile apps only
- Installer mobile app deferred to SunProject (Phase 2)
- No offline support for Setter/Consultant apps in MVP (online-only)

**No Advanced Analytics:**
- No predictive lead scoring
- No churn prediction models
- No A/B testing framework for scripts/processes

**No Customer Portal:**
- No self-service customer portal for homeowners to track installation progress
- No customer-facing mobile app
- Communication via email/phone only in MVP

### Clear Decision Points

**Features Requiring Product Decision Before Implementation:**

1. **Script Customization:** Can Consultants customize scripts per Person, or must strictly follow Sales Manager-defined scripts? (Decision needed by Week 12)

2. **Financing Partner Selection:** Which 1-2 financing companies for MVP? (Decision needed by Week 14)

3. **Call Recording Storage:** How long to retain call recordings? Privacy/legal implications? (Decision needed by Week 8)

4. **Commission Payment Frequency:** Weekly? Bi-weekly? Monthly? (Decision needed before first customer)

5. **Discounting Strategy:** How much discount for first 3-5 customers? $75/month? $80/month? (Decision needed before Month 5 sales conversations)