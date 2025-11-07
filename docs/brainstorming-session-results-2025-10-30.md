# Brainstorming Session Results

**Session Date:** 2025-10-30
**Facilitator:** Business Analyst Mary
**Participant:** Greg

## Executive Summary

**Topic:** Sunup Platform Architecture - Application Suite Overview

**Session Goals:** Explore and define:
1. Application suite overview and module relationships
2. Purpose and scope of each module (Sundialer, SunCRM, SunDesk, SunProject)
3. User roles within the system and their needs
4. Data flows and integration patterns across modules

**Techniques Used:**
1. Mind Mapping (Structured) - 20 minutes
2. Role Playing (Collaborative) - 25 minutes (5 of 12 roles explored)

**Total Ideas Generated:** 100+ architectural components, features, data flows, and strategic insights

**Session Status:** In Progress - Additional role exploration and convergent phase to be completed in future session

### Key Themes Identified:

1. **AI-Powered Success Intelligence** - AI analysis of calls/meetings to identify success patterns, provide coaching recommendations, and enable real-time guidance
2. **Career Development Engine** - Platform designed to help people (especially those rebuilding lives) succeed for the first time through progressive goals, recognition, and advancement
3. **Unified Workspace Architecture** - Everything in one place to eliminate app-switching (communications, calendar, knowledge base, tools)
4. **Contractor Engagement Model** - Can't force contractors to participate - must inspire and incentivize through gamification, community, recognition
5. **Platform Business Model** - Lead marketplace for 10,000+ solar companies creates network effects and revenue beyond subscriptions
6. **Event-Driven Integration** - Status changes (Set/Met/QMet/Sale, installation stages) trigger cascading updates across modules
7. **Role-Based Data Access** - Personal, Team/Module, and Global access layers based on user role
8. **Minimize Cognitive Load** - Every role needs "optimal next step" guidance and meaningful visualizations
9. **Bidirectional Visibility** - Setters see forward (outcomes), Consultants see forward (installation), everyone sees what they need
10. **Community & Culture as Success Drivers** - Remote workforce needs social features, recognition, and belonging to drive performance

## Technique Sessions

### Technique 1: Mind Mapping (Structured) - 20 minutes

**Goal:** Visually map the Sunup platform architecture, modules, roles, and integration points.

**Central Concept:** Sunup Platform

**Major Branches Explored:**

#### Branch 1: SUNDIALER MODULE
- **Lead Management** - Upload & manage leads
- **Outgoing Predictive Dialer** - Auto-dial → Route to available Setters
- **Call Handling UI** - Setter interface for setting appointments
- **Leaderboard** (UI design complete) - Individual performance metrics, Team comparison view
- **Manager Tools** - Individual monitoring, Team performance tracking
- **Primary Users:** Setters (appointment setters), Sales Managers
- **Data Handoff:** Appointments → SunCRM (to Consultants)

#### Branch 2: SunCRM MODULE
- **Person Assignment** - Setters hand off → Consultant receives Person
- **Intro Call Process** - Gather Person information
- **Video Consultation** (built-in conferencing)
  - Unified Consultation UI containing:
    - Video feed
    - Script presentation component
    - Property map viewer
    - Slideshow component
    - Person details component
- **Person Organization System** - Group by next action needed:
  - "People I need to intro"
  - "People I need to reschedule"
  - "People I need to create a design for"
  - [other action-based groups]
- **Leaderboard** - Individual performance, Team context/comparison
- **Manager Tools** - Individual monitoring, Team performance tracking
- **Primary Users:** Consultants (sales consultants), Sales Managers
- **Data Flows:**
  - IN: Appointments/People from Sundialer
  - OUT: [SALE CLOSED] → Dual handoff to SunDesk (onboarding) + SunProject (installation)

#### Branch 3: SunDESK MODULE
- **Onboarding Call** - Explain project timeline, Introduce Project Manager, Script-guided process
- **Ongoing Support Activities** - Warranty repairs, General support, Long-term (years post-install)
- **Triage & Routing** - Identify issue type and route to appropriate expert:
  - → Back to Consultant (SunCRM) for order changes, add-ons
  - → To Project Manager (SunProject) for installation questions
- **Primary Users:** Support Staff
- **Data Flows:**
  - IN: Customer from SunCRM (post-sale)
  - IN: Project info from SunProject (for timeline/PM name)
  - OUT → SunCRM (route back for order changes)
  - OUT → SunProject (route to PM for install questions)

#### Branch 4: SunPROJECT MODULE
- **Installation Project Management**
- **Primary Users:** Project Managers, Installers/Installation crews
- **Data Flows:**
  - IN: Customer/Sale from SunCRM (post-sale)
  - IN: Support requests from SunDesk
  - OUT: Project status/timeline to SunDesk
- **[RESEARCH NEEDED: Solar installation PM best practices]**

#### Branch 5: USER ROLES
- **Lead Manager** - Primary: Sundialer (load leads, quality assurance, enrichment)
- **Setters** - Primary: Sundialer
- **Setter Managers** - Primary: Sundialer (manager tools)
- **Consultants** - Primary: SunCRM
- **Sales Managers** - Primary: Sundialer + SunCRM (manager tools)
- **Support Staff** - Primary: SunDesk
- **Project Managers** - Primary: SunProject
- **Installers** - Primary: SunProject
- **System Administrator** - Access: ALL modules (config, user management)
- **Executive** - Access: Cross-module visibility/dashboards
- **Finance** - Access: Cross-module (commissions, advances, payments)
- **Operations** - Access: Cross-module (operational oversight)

**Key Insight:** Two user categories emerged:
1. Module-specific users (deep in their tool)
2. Cross-module users (need unified visibility across platform)

#### Branch 6: CORE CAPABILITIES (Platform-wide)
- **AI-Powered Features:**
  - Voice analysis (calls)
  - Video analysis (meetings)
  - Recommendation engine (optimal next steps)
  - Real-time analysis during calls/meetings (feasibility TBD)
- **Financial System:**
  - Commission calculation
  - Advance calculation
  - ACH payments (advances & commissions)
- **Communications Suite:**
  - Internal messaging (Slack-clone)
  - Email client (Apple mail based)
  - SMS messaging system
  - Notifications system
- **Calendar System** (full-featured):
  - Setter use: callbacks, meeting visibility
  - Consultant use: meeting management
  - Installer use: installation activity tracking/management
  - Cross-module scheduling
- **Knowledge & Training:**
  - Training materials (comprehensive)
  - Knowledge base (searchable) for Setters, Consultants, Support
  - Platform documentation (searchable)

#### Branch 7: DATA/INTEGRATION LAYER
- **Cross-Module Visibility:**
  - Consultants can see installation status in SunProject
  - Setters can see appointment outcomes in SunCRM:
    - **Set** - Appointment created
    - **Met** - Person showed up
    - **QMet** (Qualified Met) - Showed + qualified + demo complete → Triggers Setter payment
    - **Sale** - Deal closed
- **AI Analysis Distribution:**
  - Individual Access: Setters/Consultants see their own analyses + improvement tips
  - Management Access: Managers, Executives, System Admins see all analyses
  - Real-time Analysis: Live suggestions during calls/meetings (feasibility TBD)
- **Notification Triggers (event-driven):**
  - Calendar: Upcoming event reminders (X min prior)
  - Communications: Manager messages, chat mentions, system messages
  - SunProject → Consultant: Installation stage updates
  - SunCRM → Setter: Met/QMet/Sale status changes
  - [More triggers to be defined]
- **Audit Trail / Historical Access:**
  - Full customer journey visible to: Consultants, Project Managers, Sales Managers, Setter Managers, System Administrators, Finance, Support Staff, Executives
- **Financial Data Flows:**
  - QMet events → Setter commission calculation
  - Sale events → Commission/advance calculation
  - All modules → Finance (for ACH processing)

**Critical Architectural Insights from Mind Mapping:**
1. **Event-Driven Architecture Required** - Status changes trigger cascading updates and notifications across modules
2. **Role-Based Data Access Layers** - Personal (own), Team/Module (managers), Global (executives/admins)
3. **Financial Triggers are Status-Change Events** - QMet and Sale statuses have direct payment implications
4. **Bidirectional Visibility** - Consultants see "forward" (installation), Setters see "forward" (outcomes)
5. **SunDesk as Routing Hub** - Not just endpoint, actively routes customers back to appropriate modules
6. **Unified Workspace** - Communications, calendar, knowledge base accessible across all modules

**Ideas Generated:** 50+ architectural components, data flows, and integration points identified

---

### Technique 2: Role Playing (Collaborative) - 25 minutes

**Goal:** Deeply understand each user role's perspective, needs, pain points, and success factors to ensure we design for real human needs.

#### Role 1: SETTER

**Context:** Entry-level role, works in Sundialer, income depends on QMets (Qualified Meetings). Many come from backgrounds where they've never been truly successful - single moms, people starting over, looking for a way to succeed.

**First Thing They Need to See:**
1. Available Campaigns list (only campaigns they're assigned to/permitted to join)
2. Daily welcome message from Setter Manager (announcements, important info)

**Key Insight:** Campaigns are the organizing unit, not raw leads. Manager communication is front-and-center.

**Frustrations (13 Pain Points):**
1. Bad/Unqualified Leads - Trailer parks, townhouses, renters, low credit scores
2. Technical System Issues - Recurring, very frustrating problems with current solution
3. **NO Payment Visibility** ⚠️ BIGGEST PAIN - Can't track Mets, QMets, Sales, meeting times (how they get paid!)
4. Multi-App Detective Work - Switch apps + Slack DMs to Consultants to find Set conversion status
5. No Hours Tracking - Can't see hours worked (need 30hrs/week minimum)
6. No Personal KPI Visibility - Can't see own Sets, Mets, QMets, Sales numbers
7. No Peer Comparison - Don't know performance relative to other Setters
8. Long Wait Times - Between calls when system has technical problems
9. Bad Lead Data Quality - Wrong names, misgendered names (embarrassing mistakes)
10. No Property Visualization - Can't see map to assess suitability (trees, building type)
11. No Knowledge Base Access - Questions about qualifications, system details, no easy answers
12. No Remote Community/Support - Missing camaraderie of shared workplace
13. Limited Learning Opportunities - Want to learn from top performers ("people who are killing it")

**Success Factors (What makes a great day):**
1. Daily AI Evaluation - What improved, what to focus on tomorrow
2. Achievement Badges - Visible in chat and communications (social recognition)
3. Career Progression Visibility - Clear path to Consultant promotion (vastly higher earnings for top performers)
4. Contests & Performance Bonuses - Regular opportunities to win extra money
5. Self-Esteem Building Features - For people rebuilding lives (RESEARCH NEEDED)
6. Goal-Setting System - Realistic goals, celebrate progress, gradually increase targets
7. Community Connection - (How to create connection for remote workers?)

**Critical Design Insight:** Sunup is a **career development engine** for people who may have never experienced real success before. This is their pathway from struggling to thriving.

#### Role 2: CONSULTANT

**Context:** Promoted from top-performing Setters. Use SunCRM. Income from closing sales (much higher earning potential). Very demanding job requiring careful time management. Daily quota: 50+ calls.

**First Thing They Need to See:**
1. Communication Triage - All channels in one place (emails, texts, SMS, DMs)
2. Team Awareness - Key chat channels for updates and announcements
3. Today's Appointments - Schedule + prep needs (especially imminent first appointment)
4. Intro Call Queue - Assigned People not yet reached
5. Daily Call Quota Tracking - 50+ calls/day, system suggests which People to call for max benefit
6. Credit Approval Status - Which People approved/denied
7. Installation Progress Dashboard - All sold customers in install:
   - Current status
   - Problems needing resolution
   - Milestones reached (trigger contact)
   - Periodic check-in reminders (even without problems)
8. Commitment Tracking - All promises made (modify proposal, get answers, etc.)
9. Performance Visibility - Own performance over time + peer comparison
10. AI Training & Feedback - Training resources, AI-generated improvement suggestions

**The "Optimal Next Step" at Multiple Levels:**
- Strategic: "Should I restructure how I'm spending my time?"
- Operational: "Here are the 10 People you should call right now"
- Tactical: "Should my intonation go up or down when I say this line?"

**Frustrations (5 Major Pain Points):**
1. No Install Process Visibility - Can't see where sold customers are, whether help needed
2. No Payment Tracking - Don't know when install completes, when to expect commission
3. Time Optimization Uncertainty - "There's gold in my assigned People - what's the most effective way to extract it?"
4. Knowledge Gaps - Technical/policy questions without easy answers (off-grid systems, amp limits, veteran discounts, etc.)
5. **APPLICATION SWITCHING NIGHTMARE** ⚠️ MAJOR PAIN - During presentations, constantly switching between Google Earth, Google Meet, Gmail, script files, slideshow app, calculator, etc.

**Critical Validation:** The Unified Consultation UI solves pain point #5 - everything in ONE interface during the critical consultation moment.

**Success Factors (What makes a great day):**
1. Daily Accomplishment View - Visual showing each customer moved forward in pipeline
2. Mentorship Recognition - Track people helped/mentored during day
3. Daily Performance Review - AI feedback on accomplishments, improvements, areas needing work

**Key Insight:** Consultants need an **AI-powered success assistant** managing them through every moment of their workday to maximize sales.

#### Role 3: LEAD MANAGER

**Context:** Works in Sundialer. Loads leads, ensures quality, manages enrichment. Setters depend on them for good leads - bad leads = wasted time and no income for Setters.

**First Thing They Need to See:**
1. New Lead Alerts - Leads that came in overnight/recently
2. Campaign Inventory Status - Which Campaigns need more leads
3. Lead Quality Dashboard - Quality status of current lead inventory
4. Lead Source Issues - Any urgent problems with lead providers
5. Field Problem Reports - Systemic issues discovered during calling (wrong phone numbers, bad data quality, etc.)

**Key Insight:** Critical feedback loop from Setters → Lead Manager. Problems surface when Setters call - Lead Manager needs these reports to fix sources or flag bad batches.

**Frustrations (6 Pain Points):**
1. Poor Quality Data - From vendors (CSV, Excel, various formats)
2. Data Mapping Complexity - Map vendor fields to Sundialer fields:
   - Combine fields (FirstName + LastName → FullName)
   - Split fields (FullName → FirstName, LastName)
   - Rename fields (VendorField1 → StandardField)
3. Data Formatting Issues - Uppercase/lowercase, wrong case, misspelled place names, inconsistent formatting
4. Need for Automated Cleanup - Process that fixes problems automatically BUT with review/approval before going live
5. Lead Enrichment Challenges - Need to tap into databases (paid/free) to append data to leads
6. No Integrated Lead Marketplace - Would be valuable to browse/buy data sources and complete lead lists within Sundialer

**Critical Feature Required:** Lead Import & Enrichment Tool with:
- Visual field mapper (drag/drop or dropdown)
- Transformation rules (combine, split, rename, format)
- Data quality validation (flag issues)
- Preview/approval workflow before importing to Campaigns
- AI-assisted cleanup (fix common errors, standardize formatting)

**🚀 STRATEGIC BUSINESS MODEL INSIGHT:**
Sunup will be SaaS offered to 10,000+ solar installer companies in the US. A built-in **Lead Marketplace** could:
- Generate revenue beyond subscription fees (commission on transactions)
- Become significant profit center
- Create network effects (more companies = better marketplace = more value)
- Transform Sunup from tool to PLATFORM

**Success Factors (What makes a great day):**
1. Never Ran Out of Leads - All Campaigns fully stocked
2. Clean Data Quality - Few/zero problem reports from Setters/Setter Managers
3. Sets Are Up - Performance metrics showing appointment-setting success
4. Setters Are Having a Great Day - Their success = Lead Manager's success

**Key Insight:** Lead Manager success is **enabling others to succeed**. Support role measuring success by frontline performance. Need visibility into Setter metrics, Campaign inventory, data quality feedback, and Setter satisfaction.

#### Role 4: SALES MANAGER

**Context:** Oversees both Setters (Sundialer) and Consultants (SunCRM). Bridge between the two teams. Responsible for coaching, monitoring, and driving results across entire pipeline from first call to closed sale.

**First Thing They Need to See:**
1. Team Performance Dashboard - Today vs. yesterday vs. goals (real-time)
2. Individual Performance Alerts - Who needs help or coaching (red flags)
3. Pipeline Bottleneck Analysis - Where are deals getting stuck?
4. Urgent Issues - Fires needing immediate attention
5. Performance Distribution - Who's crushing it vs. struggling (leaderboard view)

**Key Insight:** Sales Manager needs **comprehensive command center** showing health of entire sales operation at a glance - from Setter activity through Consultant closings.

**Frustrations (6 Pain Points):**
1. No Call/Meeting Visibility - Can't see what's actually happening in real interactions
2. Success Pattern Mystery - Don't understand WHY some succeed while others struggle
3. Can't Track Coaching Impact - No way to measure if coaching is working
4. Script Management Nightmare:
   - No A/B testing capability for scripts or script sections
   - Can't track script effectiveness
   - Can't measure impact of script changes
5. **No AI-Powered Success Analysis** - Need tool that analyzes calls/meetings to identify what top performers do consistently:
   - What are they saying? (word choice, phrases, key questions)
   - How are they saying it? (tone, intonation)
   - Speaking speed patterns - Where do they slow down or speed up?
   - Strategic pausing - Where do they pause to let Person speak?
   - Talk ratio - Consultant vs. Person speaking time
   - Timing patterns - When do they present certain info?
   - Other vocal/behavioral patterns
6. Data Overload - Managing many people requires **meaningful data visualizations** that show performance in easy-to-absorb ways

**Critical Feature Required: AI Success Pattern Analysis Engine**
- Analyze all calls/meetings automatically
- Identify patterns that correlate with success (Set, Met, QMet, Sale)
- Surface patterns to Sales Managers
- Enable comparison: top performers vs. average performers
- Provide data-driven coaching recommendations
- **MASSIVE differentiator** - not just recording, but understanding what makes people successful

**Visual Intelligence Needs:**
- Heat maps showing performance across team
- Trend lines showing improvement/decline
- At-a-glance health indicators (green/yellow/red)
- Visual pipeline flow showing bottlenecks
- Comparative visualizations (top vs. struggling)
- Time-series charts showing coaching impact

**Success Factors (What makes a great day):**
1. Team Performance Results - Team hit or exceeded goals
2. Individual Breakthroughs - Saw someone "get it" - struggling member had breakthrough moment
3. Problems Solved - Identified and resolved issues blocking team success
4. People Developed - Team members improved skills, grew confidence, advanced careers

**Key Insight:** Sales Manager success is **team success + individual growth**. Measure success in both numbers (results) and human development (people getting better).

#### Role 5: SETTER MANAGER

**Context:** Oversees Setter team in Sundialer. Coaches Setters, monitors performance, writes daily welcome messages. Many Setters are building confidence for first time in their lives. Critical challenge: Setters are CONTRACTORS, not employees.

**First Thing They Need to See:**
1. Setter Team Performance Dashboard - How is team performing (real-time)
2. Setter Availability Status - Who's online/active/ready for calls right now
3. Individual Attention Alerts - Who needs immediate coaching or intervention
4. Lead Quality Reports - Issues affecting team's ability to succeed
5. Daily Message Prep - Context for crafting today's welcome message

**Key Insight:** Setter Manager needs both **team health** and **individual needs** visible immediately - balancing broadcast communication (daily message) with targeted coaching.

**Frustrations (10 Pain Points):**
1. Confidence/Skills Gaps - Setters who lack confidence or don't have skills yet
2. Absenteeism - Setters who don't show up consistently
3. Meeting No-Shows - Setters who don't regularly attend team meetings
4. Tech-Challenged Setters - Struggle with technology/system
5. Misinformation Issues - Setters giving People wrong information
6. Incomplete Qualification - Setters not fully qualifying People
7. Lead Quality Issues - Problems outside their control (Lead Manager domain)
8. Technical Application Problems - Current system has recurring issues
9. **Contractor Status Challenge** ⚠️ CRITICAL - Setters are contractors, NOT employees:
   - Cannot compel meeting attendance
   - Cannot force Campaign participation
   - Cannot mandate they take calls
   - **Constantly "re-recruiting"** - Must motivate Setters to show up, attend meetings, take training, handle calls
10. Training Delivery Challenge - Need to both get Setters to show up AND help them learn/apply skills

**Critical Design Insight:** Contractor model means Sunup needs **engagement and motivation features**, not just management tools. Can't force contractors - must **inspire and incentivize** them.

**Platform Requirements for Contractor Management:**
- Engagement tracking (active vs. ghosting)
- Motivational tools (recognition, celebration)
- Training attendance tracking
- Skills gap identification
- Re-engagement campaigns
- Gamification (badges, contests, leaderboards)
- Community-building features
- Career progression visibility (motivation to become Consultant)

**Success Factors (What makes a great day):**
1. High Volume Metrics - Large numbers of Sets, QMets, Meetings, Sales
2. Strong Conversion Rates - High conversion at each stage (Set → Met → QMet → Sale)
3. High Campaign Participation - Large proportion of Setters join campaigns and actively handle calls
4. Strong Meeting Attendance - Setters showing up for team meetings and training
5. Happy Setters - Contractor satisfaction and morale
6. Positive, Productive Community - Camaraderie and mutual support among remote contractors

**Key Insight:** Setter Manager success is **numbers AND culture**. With contractor workforce, can't just measure output - must measure engagement, happiness, and community strength because these DRIVE the numbers.

**Community Health Indicators Needed:**
- Engagement scores (participation rates, attendance)
- Sentiment analysis (are Setters happy?)
- Social features that build community
- Recognition systems that create positive culture

{{technique_sessions}}

## Next Steps for Completing This Brainstorming Session

**Remaining Work:**
1. **Complete Role Playing** - Explore 7 remaining roles:
   - Support Staff (SunDesk)
   - Project Manager (SunProject)
   - Installer (SunProject)
   - System Administrator (cross-module)
   - Executive (cross-module)
   - Finance (cross-module)
   - Operations (cross-module)

2. **Technique 3: First Principles Thinking** - Strip down to fundamentals for data flows and integration architecture

3. **Convergent Phase** - Organize all ideas into:
   - Immediate Opportunities (quick wins)
   - Future Innovations (requiring development/research)
   - Moonshots (ambitious, transformative concepts)

4. **Action Planning** - Prioritize top ideas and define next steps

**Critical Research Questions Identified:**
- SunProject module capabilities (solar installation PM best practices)
- Self-esteem building features for Setters (psychological research)
- Real-time AI analysis feasibility during calls/meetings
- Lead marketplace technical architecture and business model

---

## Session Reflection

**What Worked Well:**
- Mind Mapping provided comprehensive architectural overview
- Role Playing revealed deep human needs behind functional requirements
- Uncovered strategic business insights (lead marketplace, contractor model)
- Identified major differentiators (AI success pattern analysis)

**Critical Insights for Next Phase:**
This brainstorming revealed Sunup is not just a software suite - it's a **career transformation platform** with **AI-powered intelligence** delivered through a **unified workspace** to a **contractor workforce** that will be sold as **SaaS to 10,000+ companies** with an integrated **lead marketplace**.

These insights must inform:
- Architecture decisions (multi-tenancy, event-driven, role-based access)
- Feature prioritization (what's MVP vs. future)
- Research needs (SunProject, psychology, AI feasibility)
- Business model (subscriptions + marketplace revenue)

**Recommended Next Session:**
Continue brainstorming workflow to complete role exploration and convergent phase, OR move to research workflow to investigate SunProject and other knowledge gaps.

---

_Session facilitated using the BMAD CIS brainstorming framework_
_Status: In Progress - To be continued_
