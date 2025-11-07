# Product Brief: Sunup

**Date:** 2025-11-03
**Author:** Greg
**Status:** Draft for PM Review

---

## Executive Summary

**Sunup is a comprehensive, AI-powered platform purpose-built for solar installation companies**, eliminating the "fragmentation tax" that costs mid-market solar installers 50-100+ hours per week in wasted effort coordinating across 12+ disconnected tools.

### The Problem: Fragmentation Tax on a $10B+ Industry

Solar companies today cobble together Google Sheets, generic CRMs (Salesforce/HubSpot), separate dialers, video conferencing tools, project management systems, and manual commission tracking—spending **50-100 hours/week** in wasted reconciliation, app-switching, and manual data aggregation. The human cost is even higher: **departmental opacity** (Setters can't see payment outcomes, Installers can't see sales context), **contractor distrust** (independent contractors can't verify commissions), and **high turnover** (50-70% annual Setter churn).

Traditional vertical SaaS economics made this problem **economically unsolvable**: building a comprehensive solar platform would require 10-20 engineers, $5-10M+ funding, and 3-5 years to MVP—**infeasible for a niche industry**.

### Why Now: AI Changes the Economics

**AI-powered development tools enable 1-2 senior engineers to achieve what previously required 10-20 person teams.** This reduces development costs by **95-99%** (from $1.5-6M to <$4K cash burn for 21-week MVP), compresses timelines from years to months, and makes it **economically viable to serve niche industries with complex, industry-specific workflows**.

**Strategic Insight:** We can now build software that **matches solar industry processes exactly**—not force-fit generic horizontal tools—at bootstrap-friendly economics.

### The Solution: Solar Industry Operating System

Sunup unifies all 12 roles (Setters, Consultants, Sales Managers, Project Managers, Installers, Support Staff, Recruiters, Trainers, System Admins, Executives, Finance, Operations) into a **single, intelligent workspace** with:

1. **Single Unified Platform**: Built-in predictive dialer, WebRTC video conferencing, solar-specific project management, recruiting/training—not cobbled integrations
2. **Pipeline as Central Nervous System**: Lead → Set → Met → QMet → Sale → Installation Complete with event-driven architecture triggering real-time updates across all roles
3. **AI-Powered Intelligence**: Moment-by-moment guidance ("what's the most effective use of your time now?"), automated coaching, process automation, success pattern analysis
4. **Industry-Specific Workflows**: Commission rules engine (kilowatt-based, product-specific), solar PM milestones, site survey tools, recruiting/training pipeline, effort-based fairness algorithms
5. **Contractor Engagement**: Real-time payment tracking, gamification, leaderboards, top performer call recordings, career development, community features

**Key Differentiators vs. Generic CRMs:**
- **Native Integration**: Dialer, video, PM, training built-in (not 3rd-party add-ons)
- **Solar-Specific Intelligence**: Workflows match industry reality (permits, inspections, kW-based commissions)
- **Contractor Transparency**: Bidirectional visibility, payment tracking, fairness mechanisms
- **AI Guidance**: Native coaching, feedback, productivity optimization (not expensive add-ons)

### Target Market and Pricing

**Primary Target:** Mid-market solar installation companies (20-250 employees, average 250 users)
- **Pricing:** $100/user/month ($75-80 early customer discount)
- **Average Customer Value:** $25K/month MRR (250 users)
- **Customer ROI:** 5.6x-6.6x return (50-100 hours/week recovered at $30-50/hour blended rate)

**Compelling Value Proposition:** Customers pay $25K/month to recover $140-275K/year in wasted labor—**no-brainer ROI**.

### Financial Opportunity: Exceptional Unit Economics

**Unit Economics:**
- **LTV:CAC Ratio:** 90:1 - 180:1 (assuming 3-year customer lifetime, $1,500 CAC)
- **Gross Margin:** 80-90% at scale (cloud infrastructure + LLM API costs)
- **CAC Payback:** <1 month
- **Break-Even:** Day 1 with first customer (250 users = $25K MRR covers all costs)

**Growth Trajectory (Base Case):**
- **Year 1:** 10-15 customers → $3-4.5M ARR (5-month MVP + 7-month sales ramp)
- **Year 3:** 100-150 customers → $30-50M ARR
- **Year 5:** 250-350 customers → $100M+ ARR

**Why These Numbers Are Achievable:**
1. **Founder-Market Fit:** Founder currently works at 250-user solar company (first customer likely)
2. **Compelling ROI:** 5.6x-6.6x return drives word-of-mouth and executive buy-in
3. **Network Effects:** Multi-tenant platform improves as more companies join (success patterns, AI training data)
4. **High Switching Costs:** Once integrated into daily workflow, extremely sticky (integration IS the value prop)

**Realistic Path to $100M ARR by Year 5:**
- Year 1-2: Prove product-market fit, establish repeatable sales motion
- Year 2-3: Scale sales team, expand to Phase 2 features (SunProject, SunDesk, SunRecruit, SunTrain)
- Year 4-5: Multi-vertical expansion (HVAC, roofing, windows) reusing core platform

### Product Roadmap: MVP to Multi-Vertical Platform

**MVP (21 Weeks - Months 1-5):** Setter, Consultant, Sales Manager workflows
- SunCRM (pipeline, Person/Org management, commission engine)
- Sundialer (predictive dialer, campaign management)
- SunMeeting (1-to-1 WebRTC video, unified meeting interface for Consultants)
- **Target:** First customer (250 users, $25K MRR) by Month 6

**Phase 1.5 (Weeks 22-26):** Enhanced round-robin algorithms, advanced commission rules, reporting dashboards

**Phase 2 (Months 7-24):** Complete solar lifecycle
- Priority 1: SunProject (installation PM)
- Priority 2: SunDesk (post-sale support)
- Priority 3: Advanced AI (coaching, analytics, time optimization)
- Priority 4: SunRecruit (recruiting/ATS)
- Priority 5: SunTrain (1-to-200 WebRTC training, LMS)

**Phase 3 (Years 2-5):** Multi-vertical expansion (HVAC, roofing, windows) - 70-80% code reuse

### Technical Approach: AI-First Development

**Architecture:**
- **Modular Monolith:** Single codebase with clear module boundaries (SunCRM, Sundialer, SunMeeting, SunProject, etc.)
- **Event-Driven:** Pipeline status changes trigger cascading side effects (notifications, commission calculations, handoffs)
- **Multi-Tenant Pool Model:** Shared DB/schema with Row-Level Security (RLS) enforced at query layer via convex-helpers patterns
- **Real-Time Requirements:** Sub-second latency for critical flows via WebSocket subscriptions (Convex)

**Tech Stack:**
- **Frontend:** Next.js 16+, React 19.2+, TypeScript 5.8+, TailwindCSS 4+, shadcn/ui, tweakcn (theming)
- **Backend:** Convex (serverless, real-time, multi-tenant RLS)
- **Auth:** Clerk (multi-tenant, 12 roles RBAC)
- **Video:** Custom WebRTC implementation with Mediasoup SFU (1-to-1 MVP, 1-to-200 Phase 2)
- **State Management:** Convex React hooks, XState 5+ (multi-step forms), React Hook Form 7.66.0+, Zod 3+
- **Testing:** Playwright 1.56+ (E2E), Vitest 4.0.7+ (unit/integration), Storybook 10+ (visual), axe-core (accessibility)
- **Mobile:** React Native (Installer mobile app, offline-first)

**Development Methodology:**
- **AI-First:** LLMs (gpt-oss-20b local dev, GPT-5 production) code via TDD, founder reviews PRs
- **TDD Mandatory:** Red-Green-Refactor cycle, 95%+ test coverage
- **10-20x Productivity:** 1-2 senior engineers vs 10-20 person traditional team
- **Cost Efficiency:** <$4K cash burn for 21-week MVP (95-99% cost reduction)

**Security & Compliance:**
- **Multi-Tenant RLS:** Enforced at query layer, no cross-tenant data leakage possible
- **OWASP Top 10 Protection:** Mandatory security requirements
- **WCAG 2.1 Level AA:** Mandatory accessibility compliance
- **Code Review:** Mandatory PR review, automated linting, security audits

### Key Risks and Mitigation

**Technical Execution Risk (HIGH):**
- **WebRTC Complexity:** Building custom SFU for 1-to-200 video is non-trivial
- **Mitigation:** Start with 1-to-1 sessions (MVP), defer 200-person to Phase 2 Training module, prototype early (Week 1-2)

**Market Adoption Risk (MEDIUM):**
- **First Customer Not Current Employer:** Extends sales timeline, increases CAC
- **Mitigation:** Founder has domain expertise + lived problem daily → compelling demo, strong network in industry

**Multi-Tenant RLS Security (LOW PROBABILITY, CATASTROPHIC IMPACT):**
- **Developer Error:** Forgetting tenantId check leaks data across tenants
- **Mitigation:** Code review mandatory, automated linting rules, security audits, test coverage for every query

**AI Productivity Risk (MEDIUM):**
- **Productivity Gains Don't Sustain:** 10-20x productivity drops at scale
- **Mitigation:** Founder has successfully used AI for development, TDD enforces maintainability, modular architecture limits complexity

**Competitive Response Risk (LOW-MEDIUM):**
- **Incumbents Copy Features:** Salesforce/HubSpot add solar-specific modules
- **Mitigation:** Integration IS the moat (unified experience > feature checklist), network effects strengthen over time, incumbents too slow to respond to niche vertical

### Competitive Advantages: Why Sunup Will Win

1. **Founder-Market Fit:** Founder lives the problem daily, deep domain expertise, trusted in industry
2. **AI-Enabled Economics:** 95-99% cost reduction enables bootstrap path, price disruption, rapid iteration
3. **Integration as Moat:** Unified experience (not cobbled integrations) creates high switching costs
4. **Network Effects:** Multi-tenant platform improves with scale (success patterns, AI training data)
5. **Contractor Engagement:** Transparency, gamification, fairness mechanisms drive retention and word-of-mouth
6. **Real-Time Intelligence:** AI guidance (moment-by-moment productivity optimization) differentiates from static tools
7. **Industry-Specific Workflows:** Solar processes baked in (not generic horizontal tools requiring expensive customization)

### 5-Year Strategic Vision

**Year 1-2:** Dominate solar installation mid-market via exceptional product + word-of-mouth
- Achieve product-market fit, establish repeatable sales motion
- Expand to full solar lifecycle (SunProject, SunDesk, SunRecruit, SunTrain)
- Build network effects moat (more customers → better AI → more attractive platform)

**Year 3-4:** Expand to large solar companies (250-1,000+ users) + adjacent verticals
- Move upmarket with enterprise features (advanced reporting, custom integrations, SSO)
- Pilot multi-vertical expansion (HVAC, roofing, windows) leveraging 70-80% code reuse
- Strengthen AI capabilities (coaching, forecasting, time optimization)

**Year 5+:** Become dominant OS for home improvement contractor industries
- Multi-vertical platform serving HVAC, roofing, windows, solar
- Marketplace ecosystem (3rd-party integrations, financing partners, equipment vendors)
- Industry standard for contractor engagement, transparency, AI-driven productivity

### Why This Will Succeed

**Compelling Value Proposition:** 5.6x-6.6x ROI eliminates buyer objections—customers pay $25K/month to recover $140-275K/year in wasted labor.

**Exceptional Unit Economics:** LTV:CAC 90:1-180:1, 80-90% gross margins, <1 month CAC payback → sustainable, capital-efficient growth.

**Sustainable Moat:** Integration (unified experience > feature checklist) + network effects (AI improves with scale) + high switching costs (workflow integration) create defensible competitive position.

**Proven Market Need:** Founder experiences pain daily, industry has no viable alternative, fragmentation tax is quantifiable and acute.

**AI-Enabled Execution:** 95-99% cost reduction enables bootstrap path, rapid iteration, price disruption—no traditional competitor can match economics.

**Realistic Timeline:** 21-week MVP → first customer (250 users, $25K MRR) → break-even Day 1 → scale from positive unit economics.

---

## Problem Statement

### The Core Problem: Fragmentation Tax on Solar Installation Companies

Solar installation companies operate with **12+ distinct roles** (Setters, Consultants, Sales Managers, Project Managers, Installers, Support Staff, Trainers, Recruiters, System Admins, Executives, Finance, Operations) coordinating across the entire sales-to-installation lifecycle. Today, these teams cobble together **Google Sheets, disparate point solutions, and manual processes** that create a "fragmentation tax" - measurable waste in time, money, and human energy.

### Quantified Pain Points

**Time Waste (Estimated):**
- **Consultants**: 5-8 hours/week switching between video conferencing, mapping tools, presentation software, CRM, and scripts during customer meetings
- **Setters**: 3-5 hours/week manually tracking Sets → Mets → Sales progression due to payment visibility gaps
- **Sales Managers**: 10-15 hours/week aggregating data from multiple systems for commission calculations and team performance visibility
- **Setter Managers**: 5-8 hours/week coordinating campaign assignments, tracking hours, and managing team performance across spreadsheets
- **Accounting/Finance**: 15-20 hours/week reconciling commission data, resolving disputes, and generating reports from fragmented sources
- **Technical Staff**: 10-15 hours/week putting out fires caused by data inconsistencies and integration failures

**Total Company Time Waste:** 50-100+ hours/week for a mid-sized solar company (20-50 employees)

**Human Cost:**
- **Departmental Opacity**: Installers can't see sales context, Consultants can't see installation progress, Setters can't see payment outcomes, Finance can't trace commission lineage
- **Cognitive Load**: Every role maintains mental models of "where is this data, which system has truth, how do I reconcile conflicts"
- **Contractor Frustration**: Independent contractors (Setters, Consultants) distrust payment systems they can't see into, leading to disputes and disengagement
- **High Turnover**: Setter turnover (estimated 50-70% annually) driven partly by payment opacity and lack of career progression visibility

**Failed Workarounds:**
- **Google Sheets Hell**: Manual data entry, version conflicts, formula errors, no real-time updates, security nightmares
- **Point Solutions**: Companies license 5-10 different SaaS tools that don't talk to each other, creating data silos
- **Manual Reconciliation**: Staff spend hours cross-referencing systems to answer basic questions: "Has this customer paid? What stage is this project in? What does this Setter earn?"

### Why This Hasn't Been Solved Before

The solar installation industry is **too niche** to attract traditional venture-backed software companies. Building a comprehensive platform like Sunup would have required:
- **Large engineering team** (10-20+ developers)
- **Multi-year development timeline** (3-5 years to MVP)
- **$5-10M+ in funding** to reach product-market fit
- **Market size** insufficient to justify unicorn-scale VC investment

Traditional software economics made vertical SaaS for mid-market solar companies **economically infeasible**.

### Why Now: AI-Enabled Development Changes the Economics

**The game has changed:**

1. **AI-Powered Development Tools** enable 1-2 senior engineers to achieve productivity previously requiring 10-20 person teams
2. **Reduced Development Timeline**: What would have taken 3-5 years is now achievable in 12-24 months
3. **Lower Capital Requirements**: Bootstrap or raise seed funding instead of Series A/B requirements
4. **Niche Market Viability**: Small teams can now profitably serve specialized industries with complex, industry-specific workflows

**Strategic Insight:** AI makes it **feasible to build software that matches industry processes exactly** rather than forcing companies to adapt to generic CRM/ERP tools designed for horizontal markets.

### The Opportunity

Solar companies will pay premium prices for software that:
- **Eliminates the fragmentation tax** (50-100 hours/week recovered)
- **Reduces contractor turnover** through transparency and engagement
- **Provides end-to-end visibility** across all 12 roles and the complete customer lifecycle
- **Speaks their language** - built by someone who lives the problem daily

This is a **founder-market fit** opportunity: domain expertise + technical capability + AI-enabled development economics.

---

## Proposed Solution

### The Vision: Solar Industry Operating System

Sunup is a **comprehensive, AI-powered platform** purpose-built for solar installation companies, unifying all 12 roles across the entire sales-to-installation lifecycle into a single, intelligent workspace.

### Core Solution Approach

**1. Single Unified Platform (Not Cobbled Integrations)**
- All roles, all workflows, all data in **one system** - not 5-10 disconnected SaaS tools
- Built-in predictive dialer, video conferencing, project management, mapping, training, recruiting
- Native integration eliminates the "feels cobbled together" tax of Salesforce + 3rd-party dialers + separate PM tools
- **One login, one data model, one source of truth**

**2. Pipeline as Central Nervous System**
- **Lead → Set → Met → QMet → Sale → Installation Complete** - configurable per tenant
- Event-driven architecture: status changes trigger cascading updates, notifications, commission calculations
- **Bidirectional visibility**: Setters see forward (outcomes), Consultants see forward (installation progress), everyone sees relevant context
- Real-time transparency eliminates opacity and manual reconciliation

**3. AI-Powered Intelligence Layer**
- **Moment-by-moment guidance**: System tells users "what's the most effective use of your time right now" and provides tools to do it easily
- **AI-driven training**: Automated feedback on call quality, presentation effectiveness, script adherence
- **Process automation**: AI walks customers through self-service site surveys, suggests optimal financing, identifies completed script sections
- **Success pattern analysis**: Learn from top performers, surface insights to managers

**4. Industry-Specific Workflows Baked In**
- **Solar installation PM workflows** - not generic project management
- **Commission rules engine** - kilowatt-based, product-specific (batteries flat, panels per kW by make/model), multi-factor structures
- **Site survey tools** - AI-powered photo validation, property analysis via satellite maps
- **Recruiting/training pipeline** - built for high-turnover contractor workforce
- **Effort-based fairness algorithms** - round-robin based on activity (calls made, handoffs accepted), not outcomes

**5. Contractor Engagement Design**
- **Transparency first**: Real-time payment tracking, QMet alerts, commission visibility
- **Gamification**: Leaderboards, achievement badges, peer comparison, goal progression
- **Career development**: Training materials, top performer call recordings, AI coaching
- **Community**: Internal messaging, knowledge base, cross-role collaboration

**6. Flexible, Intelligent User Experiences**
- **Adaptive interfaces**: Collapsible, resizable, rearrangeable panels tailored to workflow context
- **Workflow enforcement**: System ensures process compliance (e.g., "all Mets must be QMets" before booking)
- **Contextual tools**: Everything needed for current task is immediately accessible, nothing extraneous

### Key Differentiators vs. Generic CRMs/ERPs

| Capability | Salesforce/HubSpot | Sunup |
|------------|-------------------|-------|
| **Predictive Dialer** | 3rd-party integration ($$$, clunky) | Built-in, native, seamless |
| **Solar PM Workflows** | Generic project management | Industry-specific: permits, inspections, installation milestones |
| **Video Conferencing** | Zoom/Teams integration | Built-in WebRTC (1-to-1 + 1-to-200 for training) |
| **Commission Engine** | Basic formulas or custom code | Configurable kW-based, product-specific, multi-factor rules |
| **Transparency** | Role-based permissions hide data | Bidirectional visibility, contractor-facing dashboards |
| **Training/Recruiting** | Not included | Integrated recruiting pipeline, training platform (200-person sessions) |
| **AI Guidance** | Einstein analytics (expensive add-on) | Native: feedback, coaching, process automation, time optimization |
| **User Experience** | Generic horizontal UI | Solar-specific workflows, unified workspace per role |

**Why Generic Tools Fail:**
- Require **expensive customization** to approximate solar workflows
- Feel **cobbled together** - integrations break, data syncs lag, UX is disjointed
- **Not designed for contractor engagement** - lack transparency, gamification, fairness mechanisms
- **No AI-driven guidance** for moment-to-moment productivity optimization

### The "Aha Moment" - User Experience Vision

**Setter logs in and immediately sees:**
- ✅ Important announcements from Setter Manager (today's focus, contests, wins)
- ✅ **Join campaign** button → instantly assigned next call with Person/Organization details (correctly formatted, complete)
- ✅ **Script overlay** that's easy to follow with progress checkmarks
- ✅ **Satellite map** of property (instant assessment: "Is this a good solar candidate?")
- ✅ **Real-time metrics**: Hours active (today/week), Sets (today/week), **QMets alert** (instant notification when Met qualifies)
- ✅ **Leaderboard access**: See ranking, compare to peers, **listen to top performers' call recordings**
- ✅ **AI feedback**: "Great pacing on that call! Consider pausing 2 seconds after asking the budget question."
- ✅ **Appointment scheduling** - but system **enforces qualification** (can't book until all qualifying questions answered)
- ✅ **Easy communication**: Message Setter Manager, Finance, Consultants handling their Mets

**"I can see my progress in real-time, know exactly what I'm earning, and learn from the best - all without leaving one screen."**

---

**Consultant starts meeting and has everything in unified interface:**
- ✅ **Video telecon** (built-in, no alt-tabbing to Zoom)
- ✅ **Person/Organization details** + all historical notes in side panel
- ✅ **Script** with progress tracking (AI might auto-check sections)
- ✅ **Satellite/map view** of property (Mapbox integration)
- ✅ **Slideshow/presentation** viewer
- ✅ **Calculator** for ROI, payback period, financial calculations
- ✅ **Pre-filled agreement** ready to go
- ✅ **Best financing options** auto-suggested based on Person's location, credit, property
- ✅ **Flexible layout**: Collapse, resize, rearrange panels for current presentation phase
- ✅ **Knowledge base** + chat channel access (get questions answered without leaving meeting)
- ✅ **No meeting overrun stress**: Automatic handoff system handles next appointment if needed

**Note:** Proposal tool (complex photogrammetry-based 3D solar design) remains external for foreseeable future due to complexity and lack of API. Future possibility to scrape/integrate data, but out of scope for MVP.

**"Everything I need except the proposal tool is in ONE screen. I eliminate 90% of alt-tabbing and screen-sharing fumbles."**

---

**Sales Manager sees at-a-glance performance dashboard:**
- ✅ **Visual performance data** for all Consultants (charts, trends, comparisons)
- ✅ **Top performers highlighted** with "what they're doing differently" insights
- ✅ **Underperformers flagged** with AI-suggested coaching focus areas
- ✅ **Commission calculations** - transparent, auditable, real-time
- ✅ **Pipeline health**: Conversion rates, bottlenecks, forecasted revenue
- ✅ **Team capacity**: Who's available, who's overloaded, handoff patterns

**"I know exactly how my team is performing and what actions to take - no manual data aggregation, instant insights."**

### Strategic Value Proposition

Sunup eliminates the **fragmentation tax** by providing:
1. **Unified workspace** - everything in one place, not 5-10 tools
2. **Solar-specific intelligence** - workflows match industry reality, not forced adaptation
3. **AI-driven optimization** - every user gets real-time guidance on most effective actions
4. **Contractor transparency** - payment visibility, fairness, engagement drive retention
5. **End-to-end visibility** - all 12 roles see relevant context across entire lifecycle

**Result**: 50-100 hours/week recovered, reduced turnover, increased sales effectiveness, eliminated commission disputes, scalable operations.

---

## Target Users

### Primary User Segments

Sunup serves **12 distinct roles** across the solar installation lifecycle. The platform's success depends on three primary user segments whose pain is most acute and whose adoption drives company-wide value.

---

#### **1. Setters (Appointment Setters) - The Volume Engine**

**Demographics:**
- **Age range**: Highly varied (18-65+)
- **Tech skills**: Extreme variance - some highly tech-savvy, others severely tech-challenged
- **Sales experience**: Mostly no prior sales experience, some have extensive backgrounds
- **Employment**: Independent contractors (1099)
- **Motivation**: Some earn decent living as Setters long-term, **most aspire to promotion to Consultant**

**Current Pain Points:**
- **Payment tracking nightmare**: Must check multiple systems to track Sets → Mets → QMets → commission
- **Limited visibility**: Have to DM/email Consultants to find out if their Met closed, or ask Finance about "unrecognized QMets"
- **Cumbersome tools**: Different system for tracking Mets with limited access, poor UX
- **No structured learning path**: Want to improve but lack access to top performer call recordings, feedback mechanisms
- **Isolation**: Working remotely without community, mentorship, or peer learning opportunities

**Path to Success (Founder's Personal Experience):**
- **Obtained top performer recordings** (had to ask individuals directly) and studied intensively
- **Analyzed language patterns**: Word choice, intonation, voice modulation (where it goes up/down), strategic pausing
- **Peer learning**: Compared notes with other Setters, listened to each other's calls, mutual critique
- **Expert mentorship**: Managers who invested time in 1-on-1 coaching
- **Community engagement**: Attended all team meetings, socialized online with other Setters
- **Self-directed practice**: Repeated listening, practicing scripts, iterating based on feedback

**Key Insight:** Success requires access to (1) top performer examples, (2) peer community, (3) expert mentorship, (4) real-time payment visibility. **Sunup makes this systematic, not ad hoc.**

**Goals:**
- Track commission in real-time (eliminate "where's my QMet?" frustration)
- Learn from top performers (call recordings, techniques, patterns)
- Get promoted to Consultant (clear progression path)
- Earn consistent income (transparency builds trust)
- Feel connected to team (reduce isolation)

**Success Metrics:**
- Sets/week, QMet conversion rate, progression toward Consultant promotion
- Hours active (minimum 30/week), adherence to best practices
- Engagement: Leaderboard checking frequency, peer call listening, training completion

---

#### **2. Consultants (Sales Consultants) - The Revenue Engine**

**Demographics:**
- **Age range**: Varied
- **Employment**: Independent contractors (1099)
- **Tech skills**: Good to excellent
- **Sales experience**: Highly varied levels
- **Motivation**: Earn commissions, build sales career, some aspire to Sales Manager

**Current Workflow Pain (Application Juggling + Screen-Sharing Nightmare):**

During a typical customer consultation, Consultants alt-tab between **10+ tools**:
1. **CRM** - Person/Organization details, notes
2. **Slideshow software** - Presentation deck
3. **Proposal tool** - Generate and present solar proposals
4. **Calculator** - Financial calculations, ROI, payback period
5. **Scripts** - Main script + rebuttal scripts for objections
6. **Maps** - Property satellite view
7. **Video conferencing** - Zoom/Teams
8. **Browser tabs** - Articles, supporting materials
9. **Web searches** - Answering questions on the fly
10. **Chat channels** - Asking questions (no knowledge base exists)
11. **Finance apps** - Looking up pricing, financing options
12. **Manual handoff coordination** - When meeting goes over, asking in Slack "anyone available to take my next meeting?"
13. **Calls to Sales Manager** - Get permission for exceptions, policy questions, closing help

**Compounding the Pain: Screen-Sharing Switching**

Not only must Consultants alt-tab between applications, they must **constantly switch what they're screen-sharing** in the video conferencing app:
- Share slideshow → stop sharing → share proposal → stop sharing → share calculator → stop sharing → share map → stop sharing → share slideshow again
- Each switch: interrupts flow, creates awkward pauses, risks showing wrong window, degrades customer experience
- Customer sees: "Please wait while I share my screen... okay, can you see this? No? Let me try again..."

**Result:** Constant context switching, cognitive overload, screen-sharing fumbles, degraded customer experience, meetings run over, extreme stress.

**What Top 20% Consultants Do Differently:**
- **High call volume**: Many effective intro calls + rescheduling calls
- **Script adherence**: Stick to the script religiously
- **Excellent tonality**: Voice modulation (up/down in right places), strategic pausing to let Person talk
- **Confidence not desperation**: Tone conveys value, not neediness
- **Master objection handling**: Use rebuttal scripts effectively
- **Closing excellence**: Follow script closing techniques precisely

**Why Average Performers Struggle:**
- Haven't mastered objection handling and closing (even though it's in the script)
- **Hypothesis:** Having script visible during presentation (scrolling as they progress) would help significantly
- Lack structured feedback on tonality, pacing, adherence
- No easy access to top performer recordings to study

**Goals:**
- Close more sales (increase commission)
- Reduce meeting stress (eliminate app-juggling)
- Handle objections confidently (mastery of rebuttals)
- Avoid meeting overruns (automatic handoff system)
- Get answers fast (knowledge base, not Slack searches)

**Success Metrics:**
- Intro calls/week, rescheduling calls/week, Mets → QMets → Sales conversion rates
- Script adherence %, objection handling success rate, average consultation duration
- Commission per week, customer satisfaction scores

---

#### **3. Sales Managers - The Coaching Engine**

**Demographics:**
- Varied backgrounds
- **Often promoted from Consultant role**
- Responsible for team performance, coaching, commission approval

**Current Pain Points:**

**Time Sink: Data Gathering vs. Coaching**
- Spend **far too much time** trying to gather actionable performance data from fragmented systems
- **Firefighting**: Constant interruptions answering routine questions that could be in knowledge base
- **Can't coach enough**: *Should* meet with entire team 2x/day (1 hour each) + individual Consultants 1x/week (30-60 min), but **often don't have time**

**Visibility Gaps - What They Wish They Could See:**

For each Consultant:
- **Call volume metrics**: Intro calls, rescheduling calls (are they doing enough?)
- **Tonality analysis**: Voice modulation, confidence, desperation detection
- **Script adherence**: Do they stick to the script or go off-script?
- **Pausing patterns**: Do they let Person talk or dominate conversation?
- **Objection handling**: How well do they use rebuttals?
- **Closing effectiveness**: Success rate at final ask
- **Trend over time**: Is each individual getting better at each skill?

For the team:
- **Aggregate metrics**: What are team-wide weaknesses to address in morning meetings?
- **Performance distribution**: Who needs help, who's excelling, who's trending up/down?
- **Capacity planning**: Who's overloaded, who has bandwidth?

**Current Reality:** Sales Managers spend hours manually aggregating data from spreadsheets when they should be coaching.

**Goals:**
- **More coaching time**: Shift from data gathering to actual 1-on-1 and team development
- **Data-driven insights**: Know exactly what each person needs to work on
- **Proactive not reactive**: Spot trends before they become crises
- **Reduce routine questions**: Knowledge base + self-service tools free up Manager time

**Success Metrics:**
- Team conversion rates, individual improvement trajectories, coaching hours per week
- Time spent on data aggregation (goal: minimize), time spent coaching (goal: maximize)
- Consultant satisfaction with management support

---

### Secondary User Segments

**Supporting roles that benefit from unified platform but aren't primary adoption drivers:**

#### **Setter Managers**
- Manage Setter teams, campaign assignments, hours tracking
- Need visibility into effort metrics (calls made, hours active), not just outcomes
- Coordinate training handoffs, team composition

#### **Recruiters**
- High-volume hiring for Setter roles (continuous pipeline)
- Conduct video interviews, manage applicant tracking
- Handoff to Trainers post-hire

#### **Trainers**
- Train cohorts of up to 200 Setter Trainees
- Hybrid live + self-paced training
- Assessment, graduation, handoff to Setter Managers

#### **Project Managers (Installation)**
- Coordinate installation projects from sale to completion
- Manage Installer crews, permits, inspections, milestones
- Provide installation progress visibility to Consultants/Sales team

#### **Installers**
- Field crews performing physical installation
- Mobile app users, need work order details, checklists, photo uploads

#### **Support Staff (SunDesk)**
- Post-sale customer communications (onboarding, check-ins, support)
- Structured scripts per communication purpose
- Triage and route issues to appropriate teams

#### **System Administrators**
- Platform configuration, user management, trouble ticketing
- Configure approval workflows, commission rules, pipeline stages
- Monitor system health

#### **Finance/Accounting**
- Commission calculations, payment processing, reconciliation
- Financial reporting, tax compliance (1099s)
- Audit trail for all financial transactions

#### **Executives**
- Strategic dashboards: revenue, pipeline health, team performance
- High-level insights, forecasting, capacity planning
- Minimal time investment, maximum visibility

#### **Operations**
- Cross-module efficiency monitoring
- Process optimization, bottleneck identification
- Resource utilization and capacity planning

---

### User Persona Hierarchy for Prioritization

**Tier 1 (MVP Critical):**
- Setters, Consultants, Sales Managers
- **Rationale:** These roles drive revenue and feel pain most acutely. If Sunup solves their problems, adoption follows.

**Tier 2 (Phase 2):**
- Setter Managers, Finance, System Administrators
- **Rationale:** Essential for operations but can initially work with partial solutions

**Tier 3 (Post-MVP):**
- Recruiters, Trainers, Project Managers, Installers, Support, Executives, Operations
- **Rationale:** High value but not immediate adoption blockers

---

## Goals and Success Metrics

### Business Objectives

**Primary Year 1 Objective: Customer Acquisition + ROI Validation**

These objectives are interrelated - proving clear ROI drives customer acquisition through word-of-mouth and case studies.

**Customer Acquisition Goals:**
- **Target**: 10-20 solar installation companies (mid-market, 20-100 employees) in Year 1
- **Pricing**: Premium positioning vs generic CRMs (justify with vertical-specific value)
- **Go-to-market**: Founder-led sales leveraging industry connections and domain credibility
- **Expansion**: Land-and-expand within each company (start with Setters/Consultants, expand to all 12 roles)

**ROI Validation Goals:**
- **Demonstrate measurable time savings**: 50-100 hours/week per company recovered from fragmentation tax
- **Prove contractor retention improvement**: Reduce Setter turnover from 50-70% baseline toward 30-40%
- **Show sales effectiveness gains**: Increase conversion rates (Sets→Mets→QMets→Sales) by 10-20%
- **Document cost reduction**: Eliminate 3-5 redundant SaaS subscriptions per company ($500-2000/month savings)

**Strategic Objectives:**
- **Establish market leadership**: Become the de facto solar industry platform (not "another CRM")
- **Build network effects**: As more companies adopt, lead marketplace becomes viable (future revenue stream)
- **Validate AI-enabled niche vertical SaaS thesis**: Prove small teams can profitably serve specialized industries
- **Create sustainable competitive moat**: Domain expertise + purpose-built workflows = hard to replicate

---

### User Success Metrics

Success is measured by **concrete business outcomes** for each role, not feature adoption.

**Setter Success:**
- **QMet conversion rate**: % of Sets that become QMets (target: 10-20% improvement vs baseline)
- **Payment visibility satisfaction**: Self-reported confidence in commission tracking (target: 90%+ "I always know what I'm earning")
- **Learning engagement**: % of Setters listening to top performer recordings monthly (target: 60%+)
- **Promotion velocity**: Time from Setter start to Consultant promotion (target: 20% faster)
- **Retention**: Setter turnover reduction (from 50-70% annually to 30-40%)

**Consultant Success:**
- **Sales conversion rates**: Mets → QMets → Sales funnel improvement (target: 15-25% increase)
- **Meeting efficiency**: Average consultation duration (target: 10-15% reduction without sacrificing quality)
- **Stress reduction**: Self-reported "meeting stress" (target: 70%+ report "significantly less stressful")
- **Commission growth**: Average commission per Consultant per month (target: 20%+ increase)
- **Script adherence**: % of consultations following script (target: 80%+ vs 50% baseline)

**Sales Manager Success:**
- **Coaching time**: Hours per week spent coaching vs data gathering (target: 60% coaching, 20% data, 20% other vs current 20% coaching, 50% data, 30% other)
- **Team performance visibility**: Time to answer "how is each person doing?" (target: <5 minutes vs current 2-4 hours)
- **Team conversion rates**: Overall team Mets→Sales conversion (target: 10-15% improvement)
- **Manager satisfaction**: Self-reported effectiveness (target: 80%+ "I can do my job properly now")
- **Routine questions reduction**: Interruptions per day for questions knowledge base could answer (target: 50% reduction)

**Company-Wide Success:**
- **Sets per week**: Total volume (target: 20%+ increase as Setter efficiency improves)
- **Mets per week**: Setter→Consultant handoff volume (target: 15%+ increase)
- **QMets per week**: Qualified meetings (target: 25%+ increase due to better qualification enforcement)
- **Sales closed per month**: Ultimate outcome metric (target: 20-30% increase)
- **Referrals generated**: Customer satisfaction indicator (target: measurable increase)
- **Installs completed per month**: Operational throughput (target: 15-20% increase)

**Friction & Stress Reduction:**
- **All roles report**: "Less friction in daily work" (target: 80%+ agreement)
- **All roles report**: "Less stress" (target: 75%+ agreement)
- **Time savings self-reported**: Hours saved per week per role (target: average 3-5 hours/person)

---

### Key Performance Indicators (KPIs)

**North Star Metric: Sales Revenue per Company per Month**

This ultimate metric captures the combined effect of all improvements:
- Higher Set volume (Setter efficiency)
- Better conversion rates (Consultant effectiveness, script adherence)
- Faster sales cycles (reduced friction, better handoffs)
- Higher customer satisfaction (better experience, more referrals)

**Target**: 20-30% increase in monthly sales revenue within 6 months of full Sunup adoption

---

**Platform Health KPIs:**

| KPI Category | Metric | Target | Why It Matters |
|--------------|--------|--------|----------------|
| **Adoption** | Daily Active Users (DAU) | 85%+ of licensed users | Platform only works if people actually use it |
| **Engagement** | Leaderboard checks per Setter per week | 10+ | Gamification driving motivation |
| **Learning** | Top performer recordings listened to | 60%+ of Setters monthly | Peer learning culture forming |
| **Reliability** | Platform uptime | 99.5%+ | Downtime = lost sales calls |
| **Support** | Issue resolution time | 90% <2 hours | Rapid response critical for trust |
| **Performance** | Page load time (P95) | <2 seconds | Speed = reduced friction |

---

**Leading Indicators (Early Warning System):**

These metrics predict future success/failure:

| Indicator | Signal | Action Threshold |
|-----------|--------|------------------|
| **Setter DAU dropping** | Disengagement, competitors, frustration | <70% for 2+ weeks |
| **Leaderboard engagement dropping** | Gamification losing effectiveness | <40% checking weekly |
| **Sales Manager coaching time not increasing** | Platform not delivering time savings | <40% of time after 3 months |
| **Support tickets increasing** | Quality/usability issues | 20%+ increase week-over-week |
| **Consultant meeting duration increasing** | Unified interface not helping | No improvement after 2 months |

---

**Customer Success Milestones:**

**Month 1-2 (Onboarding):**
- 80%+ of Setters/Consultants logging in daily
- 50%+ report "easier than old system"
- Zero critical bugs blocking workflows

**Month 3-4 (Adoption):**
- 60%+ Setters checking leaderboard weekly
- Sales Managers spending 40%+ time coaching (up from 20%)
- First measurable conversion rate improvements (5-10%)

**Month 5-6 (Validation):**
- 20%+ increase in sales revenue
- 70%+ of users report "wouldn't go back to old system"
- Customer willing to provide case study/referral

**Renewal Decision Point (Month 12):**
- ROI clearly demonstrated (time savings + revenue increase > subscription cost by 5-10x)
- Multiple roles reporting success
- Company expanding to additional Sunup modules (Tier 2/3 roles)

---

## Strategic Alignment and Financial Impact

### Financial Impact

#### Development Investment (AI-Enabled Economics)

**Development Approach: AI-First, Near-Zero Cash Burn**

Sunup leverages AI-powered development tools to achieve what would traditionally require a 10-20 person engineering team with 1-2 senior engineers:

**Development Model:**
- **LLM-driven coding**: Almost entirely coded by AI using Test-Driven Development (TDD) approach
- **Human oversight**: Founder reviews and merges all PRs (quality control, architectural decisions)
- **Free/freemium tools**: Maximize use of free tiers (Clerk auth, Convex database, development tools)
- **Minimal LLM costs**: Free local LLMs for development, minimal API costs for production AI features
- **Full-time commitment**: Founder dedicates 100% time to product development

**Development Costs (5-month MVP):**
- **Salary/Opportunity Cost**: Founder forgoes consulting income (~$10,000-20,000/month × 5 months = $50,000-100,000 opportunity cost)
- **Tools & Infrastructure**: <$500/month (mostly free tiers)
- **LLM API costs**: <$200/month during development
- **Total Cash Burn**: ~$3,000-4,000 for 5-month MVP development
- **Total Investment (with opportunity cost)**: $50,000-100,000

**Traditional Economics Comparison:**
- Traditional approach: 10-20 engineers × $150,000 salary × 1-2 years = **$1.5M - 6M**
- AI-enabled approach: 1 senior engineer × 5 months = **$50-100K opportunity cost, $4K cash**
- **Cost reduction: 95-99%**

This validates the "Why Now?" thesis: AI makes niche vertical SaaS economically viable for small teams.

---

#### Revenue Model & Unit Economics

**Pricing Strategy:**
- **$100 per user per month** (standard rate)
- **Discounts for early customers** (e.g., $75-80/user/month for first 3-5 customers)
- **Annual contracts** (10-15% discount for annual prepay)

**Customer Profile - Mid-Market Solar Installer:**
- **Typical size**: 20-100 employees across 12 roles
- **Target customer**: 250 users (larger mid-market or small enterprise)
- **Monthly Revenue**: 250 users × $100 = **$25,000/month**
- **Annual Revenue**: **$300,000/year** (from single customer)

**Unit Economics (Per Customer):**

| Metric | Value | Notes |
|--------|-------|-------|
| **Monthly Recurring Revenue** | $25,000 | 250 users @ $100/user |
| **Annual Contract Value** | $300,000 | Single customer |
| **Customer Lifetime Value (3 years)** | $900,000 | Assumes 3-year retention |
| **Customer Acquisition Cost** | $5,000-10,000 | Founder-led sales, industry connections |
| **CAC Payback Period** | <1 month | Immediate profitability |
| **LTV:CAC Ratio** | 90:1 - 180:1 | Exceptional unit economics |

**Gross Margins:**
- **Infrastructure costs**: $2,000-5,000/month (Convex, Clerk, Mapbox, servers, LLM APIs)
- **Gross margin per customer**: 80-90% at scale
- **Break-even**: 1 customer covers all costs

---

#### Customer Economics: ROI Analysis

**What Sunup Costs:**
- 250 users × $100/month = **$25,000/month**

**What Customer Saves:**

**Time Savings (Direct Cost Reduction):**
- 50-100 hours/week company-wide recovered
- Average loaded labor cost: $50/hour (blended across roles)
- **Monthly time savings value**: 50-100 hrs/week × 4.3 weeks × $50/hr = **$10,750 - 21,500/month**

**Eliminated SaaS Subscriptions:**
- Current tools being replaced: Salesforce/HubSpot, Zoom, separate dialer, project management, separate commission tracker
- Estimated current spend: $500-2,000/month
- **Monthly savings**: **$500-2,000/month**

**Revenue Increase (Indirect Value):**
- 20-30% sales revenue increase (conservative estimate from improved conversion rates, reduced turnover)
- Mid-market solar installer revenue: $10-50M/year
- Even 20% of $10M = $2M/year = **$166,000/month additional revenue**

**Total Monthly Value Created:**
- Time savings: $10,750-21,500
- SaaS savings: $500-2,000
- Revenue increase: $166,000+ (not included in ROI calc - too variable)
- **Conservative measurable savings**: $11,250-23,500/month

**ROI Calculation:**
- **Cost**: $25,000/month
- **Measurable savings**: $11,250-23,500/month
- **Net**: -$13,750 to -$1,500/month (cost > direct savings)
- **But with revenue increase**: $166,000 - $25,000 = **+$141,000/month net benefit**

**ROI: 5.6x - 6.6x** (including revenue increase)

**Why Customers Will Pay:**
The $25,000/month cost is **less than half** what they're currently spending on fragmented tools + labor waste, while dramatically increasing revenue.

---

#### Break-Even Analysis

**Scenario 1: First Customer (Most Likely)**

**Customer:** Current employer (250 users)
- **Monthly Revenue**: $25,000
- **Monthly Costs**: $2,000-3,000 (infrastructure)
- **Monthly Profit**: $22,000-23,000
- **Annual Profit**: $264,000-276,000

**Break-even**: **Day 1 of first customer contract**

---

**Scenario 2: Growth Trajectory**

| Quarter | Customers | Total Users | MRR | Annual Run Rate | Profit Margin |
|---------|-----------|-------------|-----|-----------------|---------------|
| **Q1 (MVP Launch)** | 1 | 250 | $25,000 | $300,000 | $264,000 |
| **Q2** | 2-3 | 500-750 | $50,000-75,000 | $600,000-900,000 | $552,000-852,000 |
| **Q3** | 5-8 | 1,250-2,000 | $125,000-200,000 | $1.5M-2.4M | $1.38M-2.28M |
| **Q4** | 10-15 | 2,500-3,750 | $250,000-375,000 | $3M-4.5M | $2.76M-4.32M |

**Year 1 Target**: 10-15 customers, $3-4.5M ARR, $2.7-4.3M profit (90%+ margin)

**Reinvestment Strategy:**
- Hire 2-3 engineers (Quarter 2-3) to accelerate Phase 2 features
- Hire 1 customer success manager (Quarter 3) to ensure customer retention
- Marketing (Quarter 4) to expand beyond word-of-mouth
- Continue bootstrapping with revenues, avoid external funding unless growth accelerates dramatically

---

#### Strategic Milestones & Financial Gates

**Milestone 1: First Customer Success (Month 6)**
- **Financial Gate**: $300,000 ARR locked in
- **Strategic Proof**: ROI validated, case study secured, product-market fit confirmed
- **Decision**: Hire Engineer #1 to accelerate Phase 2 features

**Milestone 2: Market Validation (Month 12)**
- **Financial Gate**: $1.5-2.4M ARR (5-8 customers)
- **Strategic Proof**: Repeatable sales motion, customer retention >90%, expansion into Tier 2 roles
- **Decision**: Hire 2 more engineers + CSM, formalize sales process

**Milestone 3: Market Leadership (Month 24)**
- **Financial Gate**: $10-15M ARR (40-60 customers, ~10,000 users)
- **Strategic Proof**: Dominant player in solar vertical, strong brand recognition, network effects forming
- **Decision**: Expand to adjacent sales-intensive industries (HVAC, roofing, windows)

**Milestone 4: Category Dominance (Month 36)**
- **Financial Gate**: $50M+ ARR (200+ customers, 50,000+ users, 50% market penetration in solar)
- **Strategic Proof**: De facto standard for solar sales platforms, lead marketplace viable, multi-vertical expansion underway
- **Decision**: Consider strategic funding for aggressive expansion OR continue profitable bootstrapped growth

---

### Company Objectives Alignment

#### Founder Objectives

**Phase 1: Product-Market Fit (Months 1-12)**
- Make first customer "very, very happy" (retention, expansion, advocacy)
- Validate core thesis: Integration eliminates fragmentation tax
- Achieve profitability on Day 1 (first customer covers all costs)
- Build case study and referral engine

**Phase 2: Market Penetration (Months 13-24)**
- Acquire 20-50 solar installation companies
- Establish Sunup as the go-to platform for solar sales
- Expand within customers (Tier 1 → Tier 2 → Tier 3 roles)
- Build repeatable sales motion (founder-led → scalable sales team)

**Phase 3: Category Leadership (Months 25-36)**
- Dominate solar vertical (100,000+ seats across industry)
- Become category-defining brand ("Sunup for solar" = "Salesforce for enterprise")
- Launch lead marketplace (network effects, additional revenue stream)
- Begin multi-vertical expansion (HVAC, roofing, other sales-intensive industries)

**Phase 4: Platform Expansion (Year 4+)**
- Multi-vertical dominance (solar, HVAC, roofing, windows, etc.)
- 500,000+ seats across industries
- Platform business model (marketplace, integrations, ecosystem)
- Evaluate funding options IF growth demands it (otherwise continue profitable bootstrap)

---

#### Market Objectives

**Solar Industry Transformation:**
- Replace fragmented Google Sheets + point solutions with unified platform
- Reduce industry-wide contractor turnover by 30-50%
- Increase average solar company sales productivity by 20-30%
- Enable mid-market solar companies to compete with enterprise players through technology leverage

**Broader Impact:**
- Validate AI-enabled niche vertical SaaS as viable business model
- Prove small teams can profitably serve specialized industries
- Demonstrate that industry-specific software beats generic horizontal tools
- Create blueprint for other "too niche" industries to get purpose-built solutions

---

### Strategic Initiatives

#### Initiative 1: AI-First Development Culture

**Objective**: Maintain 10-20x productivity advantage over traditional development

**Strategy:**
- LLM-driven TDD approach for all new features
- Founder reviews all code (quality, architecture, security)
- Continuous improvement of AI prompts and development workflows
- Document and refine AI-assisted development practices

**Success Metric**: Maintain <5 FTE engineering team through $10M ARR

---

#### Initiative 2: Customer Success Over Growth

**Objective**: Achieve 95%+ retention through exceptional product and support

**Strategy:**
- White-glove onboarding for every customer
- Quarterly business reviews (QBR) showing ROI metrics
- Proactive issue resolution (99.5% uptime, <2 hour response time)
- Customer advisory board for product direction

**Success Metric**: Net Revenue Retention >120% (expansion > churn)

---

#### Initiative 3: Network Effects via Lead Marketplace

**Objective**: Create sustainable competitive moat through marketplace

**Strategy:**
- Launch lead marketplace when 20-30 customers on platform
- Enable lead buying/selling between solar companies
- Take 10-15% transaction fee on marketplace leads
- Create liquidity and stickiness (more companies = more leads = more value)

**Success Metric**: 30% of customers actively using marketplace by Month 24

---

#### Initiative 4: Vertical Dominance Before Horizontal Expansion

**Objective**: Own solar before expanding to adjacent industries

**Strategy:**
- Focus 100% on solar until 50%+ market penetration (50,000+ seats)
- Build deep domain expertise, case studies, brand recognition
- Once dominant in solar, replicate playbook in HVAC, roofing, windows
- Leverage multi-vertical to sell horizontal platform

**Success Metric**: 50% of US solar installers (by seat count) using Sunup before expanding

---

#### Initiative 5: Bootstrap to Profitability, Fund if Accelerates

**Objective**: Maintain optionality while staying profitable

**Strategy:**
- Reinvest 60-80% of profits into team growth and product development
- Maintain 6-12 months runway even at aggressive reinvestment rates
- Build business that doesn't NEED funding but could LEVERAGE funding
- Only raise if: (a) growth accelerates beyond self-funded capacity, OR (b) strategic opportunity requires capital

**Success Metric**: Profitable every quarter, option to 3x growth rate with external capital if desired

---

## MVP Scope

### Strategic Framing: Integration IS the Value Proposition

**Core Thesis:** Sunup's competitive advantage is **eliminating the fragmentation tax through end-to-end integration**, not being "best in class" at any single feature.

If Sunup only delivered Consultant Meeting View OR Setter Dashboard in isolation, companies would still need:
- Separate dialer for Setters
- Separate commission tracking system
- Separate pipeline management
- Manual handoffs between disconnected systems
- **Result:** Still fragmented, still feels cobbled together, Sunup becomes "just another tool to integrate"

**Therefore:** MVP must deliver the **minimum integrated solution** that eliminates fragmentation for core revenue-generating roles (Setters, Consultants, Sales Managers).

---

### Core Features (Must Have for MVP)

**Phase 0: Architecture Foundation (Weeks 1-6)**

These are non-negotiable - without this foundation, nothing else works:

- ✅ **Multi-tenant database architecture** (Row-Level Security with Convex)
- ✅ **User authentication & roles** (Clerk integration, multi-tenant aware)
- ✅ **WebRTC video infrastructure** (signaling server, TURN/STUN, 1-to-1 video sessions)
- ✅ **Pipeline foundation** (configurable stages per tenant: Lead → Set → Met → QMet → Sale → Installation)
- ✅ **Event system** (status changes trigger notifications, updates, commission calculations)
- ✅ **Notification infrastructure** (real-time alerts, in-app notifications)

---

**Phase 1: Core Systems (Weeks 4-6 - Parallel with Foundation)**

- ✅ **Campaign management** (Setter dialer campaigns, lead assignment, call routing)
- ✅ **Person data model** (People, Organizations, relationships, contact history)
- ✅ **Script management system** (Sales Manager creates/manages scripts for Setters, Consultants)
- ✅ **Mapbox integration** (satellite property views for Setters and Consultants)
- ✅ **Basic commission engine** (simple kW-based calculations: panels = X per kW, batteries = flat amount)
  - *Note: Enhanced multi-factor rules engine deferred to Phase 1.5*

---

**Phase 2: Setter Dashboard & Leaderboard (Weeks 7-13)**

**Setter Dashboard (Weeks 7-10):**
- ✅ **Payment visibility dashboard** - Real-time tracking: Sets → Mets → QMets → Sales → Commission
- ✅ **Hours tracking** (minimum 30 hours/week requirement, daily/weekly totals)
- ✅ **Personal KPI visibility** (Sets, QMets, conversion rates, today/week/month views)
- ✅ **Campaign join/availability** (join campaigns, set availability status)
- ✅ **Daily announcements** (Setter Manager welcome messages, contests, wins)
- ✅ **Knowledge base access** (searchable documentation, training materials)
- ✅ **Property map viewer** (satellite view during calls to assess solar viability)
- ✅ **Script interface** (overlay during calls, progress tracking, easy to follow)
- ✅ **Appointment scheduling** (book Consultant meetings with qualification enforcement - can't book until all required questions answered)
- ✅ **QMet alerts** (instant notification when Set qualifies to Met → QMet)
- ✅ **Communication tools** (message Setter Manager, Finance, assigned Consultants)

**Setter Leaderboard (Weeks 11-13):**
- ✅ **Ranking system** (by Sets, QMets, conversion rates, time period filters)
- ✅ **Achievement badges** (unlock milestones, display on profile)
- ✅ **Peer comparison** (see where you rank, top performer highlights)
- ✅ **Top performer call recordings** (listen and learn from best practices)
- ✅ **Visual rankings** (charts, progress bars, gamified UI)

**SunCRM Pipeline Extension (Built in Parallel - CRITICAL):**
- ✅ **Extend pipeline stages**: Set → Met → QMet → Sale
- ✅ **Bidirectional visibility**: Setters see outcomes (did my Set close?), Consultants see installation progress
- ✅ **Event-driven notifications**: Pipeline status changes trigger alerts across roles
- ✅ **Commission trigger events**: QMet and Sale stages trigger commission calculations

---

**Phase 3: Consultant Meeting View (Weeks 14-21)**

**Unified Consultation Interface:**
- ✅ **Built-in video conferencing** (WebRTC, no Zoom/Teams needed)
- ✅ **Person/Organization details panel** (all historical notes, contact info, pipeline status)
- ✅ **Script presentation** (main script + rebuttal scripts, progress tracking, scrolling display)
- ✅ **Satellite/map viewer** (Mapbox property visualization)
- ✅ **Slideshow/presentation viewer** (PDF or slide deck display)
- ✅ **Calculator tool** (ROI, payback period, financial calculations)
- ✅ **Pre-filled agreement** (contract ready to present)
- ✅ **Financing options suggester** (best options based on Person location, credit, property)
- ✅ **Flexible layout controls** (collapse, resize, rearrange panels for current presentation phase)
- ✅ **Knowledge base access** (instant search without leaving meeting)
- ✅ **Chat channel access** (ask questions of team without interrupting meeting)

**Meeting Handoff System:**
- ✅ **Pre-meeting alerts** (15 minutes before, toast notification: Take Meeting or Handoff)
- ✅ **Manual handoff** (Consultant can handoff anytime with reason required)
- ✅ **Availability toggle** (Consultants set "Available for handoffs" or not)
- ✅ **Handoff broadcast** (alert available Consultants with Person context, meeting details)
- ✅ **Person reassignment** (accepting Consultant gets full Person access, history, notes)
- ✅ **Automated assignment** (10 minutes before meeting: auto-assign using simple round-robin if no acceptance)
  - *Note: Effort-based algorithm (tracking intro calls, reschedules, handoff acceptances) deferred to Phase 1.5*
- ✅ **Sales Manager escalation** (if no coverage at 10 min mark: 5 intervention options)

**Supporting Features:**
- ✅ **Intro call management** (Consultant calls new Persons to schedule initial consultation)
- ✅ **Rescheduling tools** (manage meeting changes, availability)
- ✅ **Today's appointments view** (schedule, upcoming meetings, preparation info)

---

**Phase 4: Sales Manager Tools (Integrated Throughout)**

- ✅ **Team performance dashboard** (visual charts, trends, comparisons for all Consultants)
- ✅ **Individual Consultant metrics** (call volume, conversion rates, script adherence %, performance over time)
- ✅ **Commission oversight** (review, approve, audit trail for all commission calculations)
- ✅ **Pipeline analytics** (conversion rates, bottlenecks, forecasted revenue, capacity planning)
- ✅ **Handoff pattern visibility** (who's handing off frequently, reasons, team capacity insights)
- ✅ **Top performer identification** (highlight what they're doing differently)

---

### Out of Scope for MVP (Phase 2+)

**Deferred to Phase 2 (Post-MVP):**

- ❌ **Recruiting module** (Recruiter role, applicant tracking, video interviews, onboarding)
- ❌ **Training module** (Trainer role, cohort management, 200-person video sessions, quizzes, graduation)
- ❌ **SunProject module** (Project Manager, Installer roles, installation workflow, mobile app)
- ❌ **SunDesk module** (Support Staff role, post-sale communications, scripted outreach)
- ❌ **Executive dashboards** (C-level strategic visibility, high-level KPIs)
- ❌ **Operations module** (cross-module efficiency monitoring, process optimization)
- ❌ **Finance module enhancements** (ACH payment processing, 1099 generation, advanced financial reporting)
- ❌ **Setter Manager module** (team composition, advanced effort tracking beyond basics)

**Advanced AI Features (Phase 2+):**

- ❌ **Tonality analysis** (voice modulation, confidence detection, desperation signals)
- ❌ **Success pattern detection** (AI identifies what top performers do differently)
- ❌ **Real-time AI coaching** (live feedback during calls/meetings)
- ❌ **AI script adherence tracking** (automatic detection of script sections completed)
- ❌ **AI-driven "optimal next action" recommendations**

**Future Innovations (Phase 3+):**

- ❌ **Lead Marketplace** (network effects, 10,000+ companies, lead buying/selling)
- ❌ **Proposal scraping & inline display** (paste URL, scrape proposal, display in meeting without screen-sharing switch)
- ❌ **Self-service site survey app** (customer mobile app with AI photo validation, subject detection)
- ❌ **Advanced approval workflow engine** (multi-level workflows for commission changes, executive approvals)
- ❌ **Multi-tier trouble ticketing** (internal user → System Admin → Sunup SaaS Support)

**Explicitly Out of Scope (Not Building):**

- ❌ **Proposal generation tool** (complex photogrammetry-based 3D solar design - stays external, no API)
  - *Future possibility: Scrape and display proposals, but generation remains external*

---

### Phase 1.5 Enhancements (Post-MVP, Pre-Phase 2)

**These features start simple in MVP, get enhanced after core validation:**

**1. Effort-Based Round-Robin Algorithm**

**MVP (Phase 1):** Simple round-robin
- Next available Consultant gets handoff assignment
- Fair rotation, no prioritization

**Enhanced (Phase 1.5):** Effort-based priority
- Track: Intro calls made, reschedule calls made, handoff acceptances
- Priority based on **effort metrics**, not sales outcomes
- Rewards hard work and team collaboration
- Applies to: Meeting handoffs + new Person distribution from Sundialer

**2. Advanced Commission Rules Engine**

**MVP (Phase 1):** Basic kW-based calculations
- Panels: Fixed amount per kW installed
- Batteries: Flat commission per unit
- Simple, tenant-configurable rates

**Enhanced (Phase 1.5):** Multi-factor rules engine
- Product-specific formulas (commission varies by panel make/model)
- Multi-factor calculations (kW × efficiency rating × location multiplier)
- Multiple payment types (commissions, bonuses, contests, one-time payments)
- Configurable per tenant (each company has unique commission structures)
- Sales Manager configuration UI (define rules without code)
- Approval workflow integration (System Admin + Executive approval for changes)

---

### MVP Success Criteria

**The MVP is successful if, within 6 months of deployment to first customer:**

**Adoption Metrics:**
- ✅ 80%+ of Setters and Consultants log in daily
- ✅ 60%+ of Setters check leaderboard weekly
- ✅ 70%+ of users report "wouldn't go back to old system"

**Business Impact:**
- ✅ **20%+ increase in sales revenue** (the North Star metric)
- ✅ 15-25% improvement in conversion rates (Sets→Mets→QMets→Sales)
- ✅ 50+ hours/week company-wide time savings (validated through time-tracking)
- ✅ Eliminate 3-5 redundant SaaS subscriptions ($500-2000/month savings)

**User Satisfaction:**
- ✅ Setters: 90%+ "I always know what I'm earning" (payment visibility solved)
- ✅ Consultants: 70%+ "significantly less stressful" (app-switching eliminated)
- ✅ Sales Managers: 40%+ of time spent coaching vs 20% baseline (data gathering reduced)

**Platform Reliability:**
- ✅ 99.5%+ uptime (downtime = lost sales calls)
- ✅ 90% of support issues resolved <2 hours
- ✅ <2 second page load time (P95)

**Retention Signal:**
- ✅ Customer willing to provide case study/referral
- ✅ Customer expands to additional roles (Tier 2: Setter Managers, Finance, System Admins)
- ✅ Customer renews at Year 1 (ROI clearly demonstrated: 5-10x subscription cost)

---

### MVP Development Timeline

**Total: 21 weeks from start to production launch**

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 0: Foundation** | Weeks 1-6 | Multi-tenancy, WebRTC, Pipeline, Events, Notifications |
| **Phase 1: Core Systems** | Weeks 4-6 (parallel) | Campaigns, Scripts, Mapbox, Basic Commissions |
| **Phase 2: Setter Features** | Weeks 7-13 | Dashboard, Leaderboard, SunCRM Pipeline Extension |
| **Phase 3: Consultant Features** | Weeks 14-21 | Unified Meeting View, Handoff System, Sales Manager Tools |

**Phase 1.5 Enhancements:** Weeks 22-26 (4-5 weeks post-MVP)
- Effort-based round-robin algorithm
- Advanced commission rules engine

**Phase 2 (New Modules):** Month 7+
- Recruiting, Training, SunProject, SunDesk, Advanced AI features

---

## Post-MVP Vision

### Phase 2 Features (Months 7-18)

**Priority Order - Completing the Solar Lifecycle:**

The Phase 2 roadmap focuses on **completing end-to-end solar company operations** before expanding to new verticals.

---

#### **Priority 1: SunProject Module (Months 7-10)**

**Rationale:** Complete the customer lifecycle from lead to installed system. Installation visibility is critical for Consultants (see outcomes) and customers (track progress).

**Roles Enabled:**
- Project Managers (coordinate installation from sale to completion)
- Installers (field crews executing installation)

**Core Features:**
- **Project dashboard** (all installations, status, timeline, crew assignments)
- **Solar-specific milestones**: Permits submitted → Permits approved → Equipment ordered → Equipment received → Installation scheduled → Installation complete → Inspection scheduled → Inspection passed → System activated
- **Crew scheduling** (assign Installer teams to projects, availability tracking)
- **Mobile app for Installers** (work orders, checklists, photo uploads, time tracking)
- **Equipment/parts tracking** (inventory management, what's needed for each project)
- **Permit management** (submission, tracking, documentation storage)
- **Inspection coordination** (schedule, results, remediation tracking)
- **Customer communication** (installation date updates, completion notifications)
- **Bidirectional visibility**: Consultants see installation progress, PMs see sales context
- **Final commission triggers**: Installation Complete stage triggers final commission payments

**Success Metric:** Installation cycle time reduced by 15-20%, customer satisfaction scores increase

---

#### **Priority 2: SunDesk Module (Months 11-13)**

**Rationale:** Post-sale customer support completes the full customer journey and reduces churn through proactive engagement.

**Roles Enabled:**
- Support Staff (customer communications, onboarding, warranty support)

**Core Features:**
- **Configurable communication purposes** (onboarding, check-ins, warranty support, troubleshooting)
- **Script management per purpose** (Sales Manager creates support scripts)
- **Priority system** for communication types (urgent vs routine, configurable)
- **Disposition tracking** (outcome logged after every customer interaction)
- **Daily schedule view** (today's calls, workload management)
- **Routing & triage system**: Route to SunCRM (order changes), route to SunProject (installation questions), escalate to technical support
- **Customer communication history** (all touchpoints visible: sales, installation, support)
- **Proactive outreach campaigns** (30-day post-install check-in, annual maintenance reminder)
- **Issue ticketing integration** (create tickets for technical problems, track resolution)

**Success Metric:** Customer retention +10-15%, support ticket resolution time reduced by 30%

---

#### **Priority 3: Advanced AI Features (Months 14-18)**

**Rationale:** AI-powered coaching and insights create significant competitive differentiation and drive performance improvements.

**AI Capabilities:**

**1. Call/Meeting Tonality Analysis**
- Voice modulation detection (where voice goes up/down)
- Confidence vs desperation signals
- Pausing patterns (does Consultant let Person talk?)
- Talk ratio analysis (ideal: 40% Consultant, 60% Person)
- Real-time feedback: "Great pausing! Consider slowing down slightly."

**2. Success Pattern Detection**
- Analyze top performers: word choice, phrases, timing, objection handling
- Surface insights to Sales Managers: "Top performers pause 3 seconds after asking budget question"
- Identify what separates top 20% from average performers
- Generate coaching recommendations per individual

**3. Script Adherence Tracking**
- AI detects which script sections completed (automatically check off)
- Flags when Consultant goes off-script
- Identifies commonly skipped sections (opportunities for training)
- Visual progress bar during meeting

**4. AI-Driven "Optimal Next Action" Recommendations**
- **For Setters**: "You have 2 hours left today. Prioritize reschedule calls (higher QMet conversion)"
- **For Consultants**: "John Smith is most likely to close this week based on engagement signals"
- **For Sales Managers**: "Focus today's team meeting on objection handling - 60% of team struggling"

**5. Real-Time AI Coaching (Advanced - Month 18)**
- Live feedback during calls (visible only to Setter/Consultant)
- "Person mentioned budget concern - use rebuttal script section 4"
- "Great tone! Now pause and let them respond."
- Non-intrusive suggestions that improve performance

**Success Metric:** Conversion rates increase additional 10-15%, coaching effectiveness scores improve 40%

---

#### **Priority 4: Recruiting Module (Months 16-20)**

**Rationale:** High Setter turnover (50-70% annually) requires continuous recruiting pipeline. Automation reduces recruiting burden.

**Roles Enabled:**
- Recruiters (high-volume hiring for Setter roles)

**Core Features:**
- **Internal application portal** (public job listings, mobile-responsive, no login required)
- **Applicant self-scheduling** (calendar integration, automated reminders)
- **Two-way integration with employment sites**: Indeed, LinkedIn, ZipRecruiter
  - Post jobs from Sunup to external boards
  - Receive applications via webhooks
  - Track performance per platform (views, clicks, applications, cost per applicant)
- **Video interview platform** (built-in WebRTC, structured interview scripts)
- **Recording & transcription** (AI-generated summaries, accessible by Recruiters/Managers/Trainers)
- **Hiring dispositions**: Hired → auto-creates Setter Trainee account, triggers onboarding
- **Onboarding checklist**: W-9, I-9, background check, contracts, equipment setup
- **Handoff to Trainer** (seamless transition with full applicant history)
- **Recruiter dashboard** (interview schedule, application funnel, source effectiveness)

**Success Metric:** Time-to-hire reduced by 30%, cost per hire reduced by 20%

---

#### **Priority 5: Training Module (Months 21-24)**

**Rationale:** Standardized training ensures consistent Setter quality and reduces ramp time.

**Roles Enabled:**
- Trainers (train cohorts of up to 200 Setter Trainees)

**Core Features:**
- **Training session management** (1-5 day sessions, up to 200 participants)
- **Hybrid delivery**: Live video sessions (WebRTC 1-to-200) + self-paced materials (text, videos)
- **Content library** (training videos, documentation, downloadable resources)
- **Assessment system**:
  - Automated quiz grading
  - Trainer override capability
  - Configurable passing scores
  - Retake approval workflow
- **Graduation requirements**: Pass all quizzes + Trainer approval → auto-change role to "Setter"
- **Intelligent Setter Manager assignment**:
  - Balance team capacity
  - Distribute high/medium/low performers evenly (fairness)
  - Prevent team imbalances
- **Trainer dashboard** (session enrollment, quiz grading queue, graduation approvals)
- **Full trainee history** (Setter Managers see complete journey: application → interview → training → performance)

**Success Metric:** Training completion rate >85%, time to first Set reduced by 25%

---

### Long-term Vision (Years 2-5)

#### **Year 2: Solar Vertical Dominance**

**Objective:** Become the indispensable platform for solar sales and support

**Key Milestones:**
- **Market penetration**: 20-30% of US solar installers using Sunup (20,000-30,000 seats)
- **Feature completeness**: All 12 roles fully supported (Tier 1 + Tier 2 + Tier 3)
- **Lead Marketplace launch**: 20-30 customers trading leads, creating network effects
- **Brand recognition**: "Sunup" becomes synonymous with "solar sales platform"
- **Customer retention**: >95% annual retention, >120% net revenue retention

**Revenue Target:** $10-15M ARR

---

#### **Year 3: Category Leadership**

**Objective:** Own 50%+ of solar market, prepare for multi-vertical expansion

**Key Milestones:**
- **Market dominance**: 50%+ of US solar installers by seat count (50,000+ seats)
- **Platform maturity**: Advanced AI features fully deployed, marketplace thriving
- **Customer success stories**: 50+ case studies showing 20-30% revenue increases
- **Industry standard**: New solar companies default to Sunup (like "use Salesforce" for enterprise)
- **Network effects**: Lead marketplace creates significant switching costs

**Revenue Target:** $30-50M ARR

**Strategic Decision Point:** Expand to adjacent verticals (HVAC, roofing, windows) OR continue deepening solar offering

---

#### **Year 4-5: Multi-Vertical Platform**

**Objective:** Replicate solar success in adjacent sales-intensive industries

**Expansion Trigger:** Sufficient revenues to support all Sunup solar activities AND fund new vertical development

**Target Verticals (Priority Order):**
1. **HVAC** (similar sales model: high-ticket, home improvement, contractor workforce)
2. **Roofing** (overlapping customer base with solar, similar workflows)
3. **Window Replacement** (home improvement, similar sales cycle)
4. **Pool Installation** (seasonal, high-ticket, contractor sales)

**Expansion Strategy:**
- **Leverage solar platform**: 80% of features reusable (pipeline, dialer, commissions, AI)
- **Industry-specific customization**: 20% per vertical (workflow tweaks, terminology, integrations)
- **Rapid deployment**: 3-6 months per new vertical (vs 21 weeks for solar MVP)
- **Cross-selling**: Solar companies often do HVAC/roofing → natural expansion path

**Revenue Target (Year 5):** $100M+ ARR across 4-5 verticals (500,000+ seats)

---

#### **5-Year Vision Statement**

**By Year 5, Sunup is:**

- **The indispensable platform** for solar sales and support (single source of truth, impossible to replace)
- **Category-defining brand** in solar vertical ("We use Sunup" = standard operating procedure)
- **Multi-vertical leader** expanding into HVAC, roofing, windows with proven playbook
- **Network effects moat** via lead marketplace (more companies = more leads = more value)
- **AI-powered intelligence** that continuously improves performance for all users
- **Highly profitable** (90%+ gross margins, bootstrap-funded or strategically funded for acceleration)
- **Team of 20-30**: Small, high-leverage team vs 100+ person traditional SaaS company
- **Revenue**: $50-100M ARR with path to $500M+ as multi-vertical platform scales

**Ultimate Goal:** Prove that AI-enabled small teams can dominate "too niche" verticals that traditional VC-backed SaaS ignores, creating massive value for underserved industries.

---

### Expansion Opportunities

#### **Immediate Opportunities (Year 2-3)**

**1. Lead Marketplace**
- **Launch timing**: When 20-30 customers on platform (critical mass for liquidity)
- **Mechanics**: Companies post excess leads, others purchase, 10-15% Sunup transaction fee
- **Network effects**: More companies = more leads = higher platform value = switching costs
- **Revenue model**: Transaction fees (additional revenue stream beyond subscriptions)

**2. Integration Ecosystem**
- **Partner integrations**: Financing companies, equipment suppliers, inspection services
- **API platform**: Enable third-party developers to build on Sunup
- **Marketplace**: Sell integrations, revenue share model

**3. Data & Analytics Products**
- **Industry benchmarking**: Anonymous aggregate data (how do you compare to industry?)
- **Market intelligence**: Lead quality scores by geography, conversion rate trends
- **Predictive analytics**: Solar market forecasting, demand prediction

---

#### **Adjacent Verticals (Year 4-5)**

**Selection Criteria:**
- ✅ Sales-intensive (multiple touches, complex sales cycle)
- ✅ Contractor workforce (independent contractors, high turnover, commission-based)
- ✅ High-ticket sales ($5,000-50,000+ per project)
- ✅ Home improvement or B2B services
- ✅ Overlapping customer base with solar (cross-sell potential)

**Target Verticals:**

**HVAC (Heating, Ventilation, Air Conditioning):**
- Similar workflow: lead gen → appointment setting → consultation → sale → installation
- Overlapping companies (many solar installers also do HVAC)
- Larger market than solar (every home/building needs HVAC)

**Roofing:**
- Direct overlap: solar requires roof assessment, many solar customers need roofing
- Same contractor model: Setters, Consultants, Installers
- Simpler product (fewer configuration options than solar)

**Window Replacement:**
- Home improvement, high-ticket, complex sales
- Measurement/survey requirements similar to solar site surveys
- Seasonal patterns (similar to solar)

**Pool Installation:**
- High-ticket ($30,000-100,000+)
- Complex sales with site surveys
- Seasonal, contractor-heavy workforce

---

#### **Moonshot Opportunities (Year 5+)**

**1. Horizontal Platform Play**
- After dominating 4-5 verticals, position Sunup as **the platform for sales-intensive contractor businesses**
- White-label option: Companies rebrand Sunup for their industry
- Platform economies of scale: Shared AI training data, shared feature development

**2. Franchise Management Platform**
- Many solar/HVAC/roofing companies operate as franchises
- Sunup could become the franchise management system (standardize operations across locations)

**3. Workforce Marketplace**
- Connect contractors (Setters, Consultants, Installers) across companies
- Gig economy platform for sales contractors
- Revenue share on contractor placements

**4. Financing Integration**
- Partner with financing companies to offer embedded financing
- Revenue share on financed deals
- Simplify financing for customers, streamline sales process

---

#### **International Expansion (Year 6+)**

**Initial Markets:**
- **Canada**: Similar market to US, English-speaking, strong solar growth
- **Australia**: High solar adoption, English-speaking, similar sales models
- **UK/Europe**: Mature solar markets, regulatory complexity (later)

**Expansion Strategy:**
- Localization: Currency, language, regulatory compliance
- Partnership model: Local partners for sales/support
- Incremental rollout: One country at a time, validate before next

---

## Technical Considerations

### Platform Requirements

**Browser Support:**
- Chrome/Edge (latest 2 versions) - Primary target
- Firefox (latest 2 versions) - Secondary
- Safari (latest 2 versions) - Secondary
- No IE11 support

**Mobile Support:**
- React Native mobile app for Installers (iOS and Android)
- Web-responsive design for all other roles (mobile browser access)

**Accessibility:**
- **WCAG 2.1 Level AA compliance mandatory**
- Semantic HTML, keyboard navigation, screen reader support
- Color contrast requirements, motion sensitivity support
- Testing: axe-core for automated accessibility testing

**Performance:**
- Page load time: <2 seconds (P95)
- Time to interactive: <3 seconds
- Real-time updates: Sub-second latency for critical flows (pipeline updates, notifications, commission calculations)
- Video latency: <200ms for WebRTC sessions

**Reliability:**
- 99.5%+ uptime SLA
- Graceful degradation when services unavailable
- Error tracking and monitoring (Sentry)
- Zero-downtime deployments

**Security:**
- Multi-tenant Row-Level Security (RLS) at database query layer
- OWASP Top 10 protection mandatory
- No XSS, SQL injection, CSRF vulnerabilities
- Authentication via Clerk (OAuth2, multi-tenant aware)
- Role-based access control (12 distinct roles)

---

### Technology Preferences

**Frontend Stack:**

**Core Framework:**
- **Next.js 16+** (App Router, latest features, no deprecated APIs)
- **React 19.2+** (latest patterns, avoid deprecated APIs like `forwardRef`)
- **TypeScript 5.8+** (strict mode, end-to-end type safety with Convex)

**Styling & UI:**
- **TailwindCSS 4+** (utility-first styling)
- **shadcn/ui** (component library with MCP server for discovery)
- **tweakcn** (theming framework - mandatory light/dark mode support)

**State Management:**
- **Convex React hooks** (primary state, real-time subscriptions, optimistic updates)
- **XState 5+** (multi-step forms state machines)
- **React Hook Form 7.66.0+** (form display + client-side validation)
- **Zod 3+** (schema validation - NOT Zod 4 due to convex-helpers compatibility)

**Backend & Database:**

**Serverless Backend:**
- **Convex** (real-time database, serverless functions, WebSocket subscriptions)
- **Multi-tenant architecture**: Pool model (shared DB/schema) with Row-Level Security via `convex-helpers`
- **End-to-end TypeScript**: Shared types between frontend and backend
- **Patterns**: Custom functions, presence system, authorization from `stack.convex.dev`

**Authentication:**
- **Clerk** (multi-tenant aware, role-based access for 12 roles)
- OAuth2, social login support, session management

**Real-Time Communication:**

**Video Conferencing:**
- **WebRTC** (custom implementation with Mediasoup SFU)
- **1-to-1 sessions**: Setters, Consultants, Recruiters
- **1-to-200 sessions**: Training module (Trainer → up to 200 Setter Trainees)
- **Signaling**: Custom signaling server
- **TURN/STUN**: Infrastructure for NAT traversal

**AI & ML:**

**Development:**
- **gpt-oss-20b** (free local LLM for development)

**Production:**
- **GPT-5** (paid API for production AI features)

**Computer Vision:**
- **On-device**: TensorFlow Lite (80% of photos validated locally at $0 cost)
- **Cloud fallback**: Google Cloud Vision API (complex cases requiring cloud processing)
- **Hybrid approach**: Minimize cloud API costs while maintaining accuracy

**Infrastructure:**

**Hosting & Deployment:**
- **Vercel** (Next.js hosting, edge functions, automatic scaling)
- **GitHub Actions** (CI/CD pipeline)

**Monitoring & Observability:**
- **Vercel Analytics** (performance monitoring)
- **Vercel Logs** (application logs)
- **Vercel Observability** (tracing)
- **Sentry** (error tracking, crash reporting)

**Maps & Geolocation:**
- **Mapbox** (satellite imagery for property visualization, mapping features)

**Email:**
- **Resend** (transactional email delivery)

**Testing:**

**Test-Driven Development (TDD) Mandatory:**
- **Playwright 1.56+** (E2E tests - Red-Green-Refactor cycle)
- **Vitest 4.0.7+** (unit/integration tests)
- **Storybook 10+** (visual tests, component library, design system)
- **axe-core** (automated accessibility testing)

**Mobile:**
- **React Native** (Installer mobile app)
- **Offline-first architecture**: Local state, background sync when connectivity available
- **Camera integration**: Photo capture for site surveys, inspections
- **GPS tracking**: Location-based features

---

### Architecture Considerations

**Architectural Pattern: Modular Monolith**

**Rationale:**
- Single codebase with clear module boundaries (SunCRM, Sundialer, SunProject, SunDesk, etc.)
- Shared infrastructure (auth, database, notifications)
- Clear interfaces between modules
- Easier to develop/test/deploy than microservices at this scale
- Can extract to microservices later if needed

**Module Structure:**
```
/sunup
  /modules
    /suncrm         - Pipeline, Person/Org management, commission engine
    /sundialer      - Predictive dialer, campaign management, call routing
    /sunmeeting     - Video conferencing, unified meeting interface
    /sunproject     - Installation project management
    /sundesk        - Post-sale support
    /sunrecruit     - Recruiting & applicant tracking
    /suntrain       - Training platform
  /shared
    /auth           - Clerk integration, role-based access
    /pipeline       - Pipeline foundation, event system
    /notifications  - Real-time alerts
    /ui             - Shared UI components (shadcn/ui)
```

**Event-Driven Architecture:**

**Core Principle:** Pipeline status changes trigger cascading side effects

**Event Flow Example:**
```
Consultant moves Person from "Met" → "QMet"
  ↓
Event: PipelineStatusChanged { personId, from: "Met", to: "QMet", timestamp }
  ↓
Listeners:
  - CommissionEngine: Calculate QMet commission for Setter
  - NotificationService: Send QMet alert to Setter
  - AnalyticsEngine: Update conversion funnel metrics
  - AuditLog: Record status change
```

**Benefits:**
- Decoupled modules (each module subscribes to relevant events)
- Extensible (add new listeners without changing core logic)
- Auditable (all state changes produce events)
- Real-time (events trigger immediate UI updates via Convex subscriptions)

**Multi-Tenant Isolation:**

**Pool Model with Row-Level Security (RLS):**

**Architecture:**
- Single database, single schema
- All tables have `tenantId` column (indexed)
- **RLS enforced at query layer** (using `convex-helpers` patterns)
- **No queries can cross tenant boundaries** (enforced by framework)

**Security Implementation:**
```typescript
// Every Convex query/mutation checks tenantId
export const getPerson = query({
  args: { personId: v.id("persons") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const tenantId = user.tenantId;

    const person = await ctx.db.get(args.personId);
    if (!person || person.tenantId !== tenantId) {
      throw new Error("Not found");
    }
    return person;
  }
});
```

**Database Indexes:**
- **Composite indexes**: (tenantId, otherField) for efficient tenant-scoped queries
- **Performance**: Tenant-scoped queries execute as fast as single-tenant systems

**Real-Time Requirements:**

**Critical Flows Requiring Sub-Second Latency:**
- Pipeline status changes (Set → Met → QMet → Sale)
- QMet alerts to Setters
- Commission calculations and visibility
- Meeting handoff broadcasts
- Notification delivery

**Convex Subscriptions:**
- WebSocket-based real-time updates
- Automatic re-querying when data changes
- Optimistic updates for perceived instant response

**Offline Capabilities (Mobile App Only):**

**Installer Mobile App:**
- **Offline-first**: Work without connectivity (common on job sites)
- **Local state**: Store work orders, checklists, photos locally
- **Background sync**: Automatically sync when connectivity returns
- **Conflict resolution**: Last-write-wins with timestamp tracking

**Web App:**
- **No offline mode** - requires connectivity (not a constraint for office/remote workers)

**Test-Driven Development Philosophy:**

**Mandatory Red-Green-Refactor Cycle:**

1. **Red**: Write failing test first (defines expected behavior)
2. **Green**: Write minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

**Test Coverage Requirements:**
- **E2E tests (Playwright)**: Critical user flows (Setter sets appointment, Consultant conducts meeting, commission calculated)
- **Integration tests (Vitest)**: Module interactions (pipeline event triggers commission calculation)
- **Unit tests (Vitest)**: Complex logic (commission rules engine, round-robin algorithm)
- **Visual tests (Storybook)**: UI components, design system consistency

**AI-Driven Development:**
- LLMs write tests first, then implementation
- Founder reviews PRs for quality, architecture, security
- Maintain high test coverage to catch regressions

**Scalability Considerations:**

**Current Scale (Year 1):**
- 10-15 customers
- 2,500-3,750 users
- ~10,000-50,000 API requests/day

**Target Scale (Year 3):**
- 200+ customers
- 50,000+ users
- ~500,000-1M API requests/day

**Scaling Strategy:**
- **Convex auto-scales** (serverless, handles load automatically)
- **Vercel edge functions** (globally distributed, low latency)
- **Database optimization**: Proper indexing, query optimization, caching strategies
- **WebRTC SFU**: Mediasoup scales to 200-person video sessions
- **Monitoring**: Vercel Analytics + Sentry for performance tracking

**Security Considerations:**

**OWASP Top 10 Protection:**
- **Injection attacks**: Parameterized queries (Convex handles), input validation (Zod schemas)
- **XSS**: React auto-escaping, CSP headers, sanitize user-generated content
- **CSRF**: Token-based auth (Clerk), SameSite cookies
- **Authentication**: Clerk handles OAuth2, session management, MFA
- **Authorization**: RLS at database layer, role-based access control
- **Sensitive data**: Environment variables (never in code), encryption at rest/transit

**Penetration Testing:**
- Annual penetration testing (Year 2+)
- Bug bounty program (Year 3+)

**Code Review Requirements:**

**Founder Review of All PRs:**
- **Code quality**: Readability, maintainability, follows patterns
- **Architecture**: Fits modular structure, proper module boundaries
- **Security**: No vulnerabilities, proper input validation, RLS enforcement
- **Testing**: Adequate test coverage, tests pass
- **Performance**: No obvious performance issues

**AI-Assisted Code:**
- LLMs generate initial implementation
- Founder refines, improves, ensures quality
- All code held to same standards (human or AI-written)

---

## Constraints and Assumptions

### Constraints

**Development Resources:**
- **Team size**: 1-2 senior engineers (founder + potential hire in Q2-Q3)
- **No external funding**: Bootstrapped development, minimal cash burn
- **Time constraint**: 5-month MVP timeline (21 weeks) to reach first customer
- **Skill dependencies**: WebRTC expertise, Convex patterns, multi-tenant architecture - steep learning curve

**Budget Constraints:**
- **Cash burn**: <$4,000 for 5-month MVP development
- **Infrastructure costs**: Must stay within free tiers during development
- **LLM API costs**: Minimize production AI costs (use local models where possible)
- **No marketing budget**: Founder-led sales only, rely on industry connections

**Technical Constraints:**
- **Convex limitations**: Serverless constraints (cold starts, execution time limits, query complexity)
- **WebRTC complexity**: Building custom SFU for 200-person sessions is non-trivial
- **Multi-tenant RLS**: Must be enforced at every query - no exceptions, adds development complexity
- **Real-time performance**: Sub-second latency requirements challenging with serverless architecture
- **Mobile offline-first**: Complex state management and sync logic for Installer app

**Market Access Constraints:**
- **Founder-led sales**: Limited sales bandwidth (founder building + selling)
- **Industry connections**: Initial customers from existing network only
- **No sales team**: Cannot scale sales until profitable (catch-22: need customers to hire sales)
- **Trust building**: New vendor selling to industry with high friction (need case studies, references)

**Regulatory/Compliance:**
- **Data privacy**: Must comply with GDPR (if expanding internationally), CCPA (California)
- **Accessibility**: WCAG 2.1 Level AA mandatory - increases development time
- **SOC 2**: Not required initially, but larger customers will demand (Year 2+)
- **1099 contractor data**: Tax implications, must handle sensitive financial data properly

**Dependency Risks:**
- **Clerk availability**: Authentication is single point of failure
- **Convex availability**: Entire app depends on Convex uptime
- **Vercel availability**: Hosting downtime = app downtime
- **Mapbox availability**: Property visualization breaks if Mapbox down
- **Third-party APIs**: Indeed, LinkedIn, ZipRecruiter, Google Cloud Vision - no control over pricing changes

---

### Key Assumptions

**Development Assumptions:**

1. **AI-enabled productivity gains are real**
   - Assumption: LLMs + TDD can achieve 10-20x productivity vs traditional development
   - Validation: Founder has successfully used AI for development
   - Risk: Productivity gains may not sustain at scale, complex features may resist AI automation

2. **5-month MVP is achievable**
   - Assumption: 21-week timeline sufficient for integrated MVP (Setter, Consultant, Sales Manager features)
   - Validation: Detailed feature breakdown suggests feasibility
   - Risk: WebRTC complexity, multi-tenancy, real-time requirements could extend timeline

3. **Modular monolith scales to target**
   - Assumption: Single codebase can handle 10-15 customers (Year 1) and 50,000+ users (Year 3)
   - Validation: Similar architectures proven at this scale
   - Risk: May need microservices extraction earlier than expected

**Market Assumptions:**

4. **First customer is current employer**
   - Assumption: Founder's current company (250 users) will be first customer
   - Validation: Product solves acute pain founder experiences daily
   - Risk: Company may not adopt (internal politics, budget constraints, risk aversion)

5. **Solar companies will pay $100/user/month**
   - Assumption: Premium pricing justified by vertical-specific value + time savings
   - Validation: Current tool spend is higher ($500-2000/month + labor waste)
   - Risk: Companies may balk at "yet another SaaS subscription" despite ROI

6. **Integration is the killer value prop**
   - Assumption: Unified platform beats "best of breed" point solutions
   - Validation: Founder experiences fragmentation pain daily
   - Risk: Companies may prefer existing tools + integrations ("better the devil you know")

7. **Contractor transparency drives retention**
   - Assumption: Payment visibility reduces Setter/Consultant turnover
   - Validation: Anecdotal evidence (founder's experience, peer conversations)
   - Risk: Turnover may be driven by other factors (compensation, job satisfaction, industry dynamics)

**Business Assumptions:**

8. **Market size sufficient for $50-100M ARR**
   - Assumption: 100,000+ solar industry seats × $100/user/month = $10M+ MRR potential
   - Validation: Solar industry growth (federal incentives, climate initiatives)
   - Risk: Market consolidation, economic downturn, solar adoption slower than projected

9. **Customer acquisition via founder network**
   - Assumption: Industry connections generate initial customers without marketing spend
   - Validation: Founder is practicing Consultant, has industry relationships
   - Risk: Network exhausted faster than expected, need marketing/sales earlier

10. **95%+ retention achievable**
    - Assumption: If Sunup delivers 20-30% revenue increase, customers won't churn
    - Validation: High switching costs (re-training, data migration), sticky platform
    - Risk: Competitors emerge, integration breaks, performance issues cause churn

**User Behavior Assumptions:**

11. **Users will adopt gamification**
    - Assumption: Leaderboards, badges, peer comparison drive Setter engagement
    - Validation: Gaming psychology, competition is motivating
    - Risk: Some users demotivated by public comparison, prefer private metrics

12. **Peer learning culture will emerge**
    - Assumption: Setters will listen to top performer recordings, learn from each other
    - Validation: Founder's personal success using this method
    - Risk: Culture depends on management buy-in, not inherent to tool

13. **Consultants will embrace unified interface**
    - Assumption: Eliminating app-switching outweighs learning curve of new tool
    - Validation: Current pain is severe (10+ tools, constant screen-sharing switches)
    - Risk: Change resistance, "I'm used to my current setup" inertia

14. **Sales Managers will shift to coaching**
    - Assumption: Data visibility frees up time currently spent on manual aggregation
    - Validation: Logical - if data is automatic, more time for coaching
    - Risk: Managers may fill freed-up time with other tasks, not coaching

**Technical Assumptions:**

15. **WebRTC can scale to 200-person training sessions**
    - Assumption: Mediasoup SFU can handle 1-to-200 video streams
    - Validation: Mediasoup is battle-tested, designed for large sessions
    - Risk: Infrastructure costs, bandwidth requirements, complexity of implementation

16. **Convex RLS provides sufficient security**
    - Assumption: Query-layer RLS prevents cross-tenant data leakage
    - Validation: Patterns proven in production (documented on stack.convex.dev)
    - Risk: Developer error (forgetting to check tenantId) could leak data

17. **Offline-first mobile app is tractable**
    - Assumption: React Native + local state + background sync is achievable
    - Validation: Common pattern for field service apps
    - Risk: Conflict resolution complexity, sync edge cases, testing challenges

18. **AI costs remain manageable**
    - Assumption: Hybrid on-device (TensorFlow Lite) + cloud (Google Cloud Vision) keeps costs low
    - Validation: 80% on-device validation at $0 cost
    - Risk: Google Cloud Vision pricing increases, more photos require cloud processing

19. **GPT-5 will be available for production**
    - Assumption: GPT-5 (or equivalent) will be released and accessible via API
    - Validation: Historical pattern (GPT-3 → GPT-4 → GPT-4.5 → GPT-5)
    - Risk: GPT-5 delayed, pricing prohibitive, performance not as expected

**Economic Assumptions:**

20. **Solar industry growth continues**
    - Assumption: Federal/state incentives, climate initiatives drive solar adoption
    - Validation: Inflation Reduction Act, state-level solar mandates
    - Risk: Policy changes, economic downturn, interest rates impact solar financing

21. **No major competitor emerges**
    - Assumption: Solar vertical remains underserved by software vendors
    - Validation: No current vertical-specific competitor (only generic CRMs + cobbled integrations)
    - Risk: Salesforce/HubSpot builds solar-specific features, well-funded startup enters space

---

## Risks and Open Questions

### Key Risks

**1. Technical Execution Risk (HIGH)**

**WebRTC Complexity:**
- **Risk**: Building custom SFU for 1-to-200 video sessions is highly complex
- **Impact**: MVP timeline extends beyond 21 weeks, first customer delayed
- **Mitigation**: Start with 1-to-1 sessions (MVP), defer 200-person sessions to Training module (Phase 2, Month 21+)
- **Probability**: MEDIUM - Mediasoup is battle-tested, but implementation is non-trivial

**Multi-Tenant RLS Security:**
- **Risk**: Developer error (forgetting tenantId check) leaks data across tenants
- **Impact**: CATASTROPHIC - loss of trust, regulatory issues, legal liability
- **Mitigation**: Code review mandatory, automated linting rules, security audits, test coverage for RLS enforcement
- **Probability**: LOW with proper processes - but consequence severity demands extreme vigilance

**Real-Time Performance:**
- **Risk**: Serverless architecture (Convex) can't meet sub-second latency requirements
- **Impact**: Poor user experience, commission delays, missed QMet alerts
- **Mitigation**: Load testing early, optimize queries, consider caching strategies, WebSocket subscriptions
- **Probability**: LOW - Convex designed for real-time, but need to validate at scale

---

**2. Market Adoption Risk (MEDIUM-HIGH)**

**First Customer May Not Adopt:**
- **Risk**: Current employer doesn't adopt despite founder's confidence
- **Impact**: No revenue, no case study, extended runway to find alternate first customer
- **Mitigation**: Pre-sell during development (validate commitment), involve key stakeholders early, phased rollout
- **Probability**: MEDIUM - internal politics, budget freezes, risk aversion could derail adoption

**Pricing Resistance:**
- **Risk**: Companies balk at $100/user/month despite ROI
- **Impact**: Need to lower pricing, reducing margins and profitability projections
- **Mitigation**: Flexible early-customer discounts ($75-80/month), emphasize ROI (5-6x), case studies showing revenue increase
- **Probability**: MEDIUM - new vendor, unproven platform, economic uncertainty

**Change Resistance:**
- **Risk**: Users resist learning new tool ("I'm used to my current setup")
- **Impact**: Low adoption, poor DAU, customers churn, word-of-mouth damage
- **Mitigation**: Exceptional onboarding, training, user champions, phased rollout, quick wins
- **Probability**: HIGH - change is hard, contractors may resist disruption to established workflows

---

**3. Competitive Response Risk (MEDIUM)**

**Salesforce/HubSpot Builds Solar Features:**
- **Risk**: Incumbents recognize opportunity, build solar-specific modules
- **Impact**: Competitive positioning weakens, harder to win customers
- **Mitigation**: Move fast (first-mover advantage), deep domain expertise, better UX, faster iteration
- **Probability**: LOW (short-term) - solar too niche for Salesforce priority, MEDIUM (long-term) if Sunup gains traction

**Well-Funded Startup Enters Space:**
- **Risk**: VC-backed competitor with 10-20 person team moves faster
- **Impact**: Customer acquisition harder, need to differentiate on quality/domain expertise
- **Mitigation**: Bootstrap profitability first, build defensible moat (network effects, customer lock-in, domain expertise)
- **Probability**: MEDIUM - if Sunup succeeds, copycats follow

---

**4. Resource Constraint Risk (HIGH)**

**Solo Founder Bandwidth:**
- **Risk**: Founder building + selling + supporting = burnout, quality issues, slow progress
- **Impact**: MVP delayed, first customer onboarding poor, founder health suffers
- **Mitigation**: Ruthless prioritization, hire Engineer #1 early (Q2), outsource non-core work, sustainable pace
- **Probability**: HIGH - solo founding is inherently high-risk

**No Sales Team:**
- **Risk**: Can't scale beyond founder network without sales team, but can't afford sales until profitable
- **Impact**: Growth slower than projected, stuck in catch-22
- **Mitigation**: Perfect first customer experience → referrals, case studies, inbound interest, hire sales rep after 5-8 customers
- **Probability**: MEDIUM - classic bootstrap challenge

---

**5. Dependency Risk (MEDIUM)**

**Third-Party Service Failures:**
- **Risk**: Clerk, Convex, Vercel, Mapbox experience outages or pricing changes
- **Impact**: App downtime, unexpected costs, need to migrate services
- **Mitigation**: Multi-vendor strategy where feasible, monitor service health, maintain cash reserves for price increases
- **Probability**: LOW (outages) - services are generally reliable, MEDIUM (pricing changes) - SaaS vendors adjust pricing

**Regulatory Compliance:**
- **Risk**: SOC 2, GDPR, CCPA requirements block enterprise sales
- **Impact**: Can't sell to larger companies, TAM shrinks
- **Mitigation**: Plan for SOC 2 audit (Year 2), design for GDPR/CCPA compliance from start, budget for compliance costs
- **Probability**: MEDIUM - larger customers increasingly demand compliance certifications

---

**6. Economic/Market Risk (MEDIUM)**

**Solar Industry Downturn:**
- **Risk**: Policy changes, economic recession, interest rate impacts reduce solar installations
- **Impact**: Customer budgets shrink, harder to sell, existing customers downsize
- **Mitigation**: Diversify to adjacent verticals (HVAC, roofing) earlier if solar weakens, position as cost-saving (not just growth) tool
- **Probability**: MEDIUM - solar is policy-dependent, economic cycles affect home improvement spending

**Market Size Overestimated:**
- **Risk**: Total addressable market smaller than 100,000 seats
- **Impact**: Revenue ceiling lower, need to expand verticals sooner
- **Mitigation**: Validate TAM research, expand to HVAC/roofing as backup plan
- **Probability**: LOW - solar industry employment data supports estimates

---

### Open Questions

**Technical Questions:**

1. **WebRTC SFU Implementation:**
   - Q: Should we build custom Mediasoup SFU or use managed service (e.g., Daily.co, LiveKit)?
   - Trade-offs: Custom = full control + lower long-term cost, Managed = faster to market + higher cost
   - Decision needed by: Week 4 of MVP development

2. **Commission Rules Engine Configurability:**
   - Q: How flexible should the Phase 1.5 commission engine be? Visual rule builder or config files?
   - Trade-offs: Visual UI = better UX but more dev time, Config files = faster to build but requires technical knowledge
   - Decision needed by: Phase 1.5 planning (Week 22)

3. **Video Call Recording Storage:**
   - Q: Where do we store call recordings? S3? Convex file storage? How long do we retain?
   - Trade-offs: Storage costs vs compliance requirements vs user expectations
   - Decision needed by: Week 10 (before Leaderboard with call recordings)

4. **Knowledge Base Content Strategy:**
   - Q: Who creates initial knowledge base content? Founder? First customer? AI-generated from documentation?
   - Decision needed by: Week 14 (before Consultant Meeting View with knowledge base access)

5. **Mobile App Rollout:**
   - Q: React Native app for Installers - iOS first, Android first, or simultaneous launch?
   - Trade-offs: Sequential = validate on one platform first, Simultaneous = reach all users but higher dev cost
   - Decision needed by: Phase 2 SunProject planning (Month 7)

---

**Business Questions:**

6. **Discounting Strategy:**
   - Q: How much discount for first 3-5 customers? $75/month? $80/month? Annual prepay required?
   - Decision needed by: Before first sales conversation (Month 5)

7. **Support Model:**
   - Q: What level of support to offer? Email only? Chat? Phone? Response time SLA?
   - Trade-offs: Higher support = better customer success but higher cost
   - Decision needed by: Before MVP launch (Month 5)

8. **Expansion Trigger:**
   - Q: At what revenue level do we expand to HVAC/roofing? $10M ARR? $30M ARR? 50% solar market share?
   - Decision needed by: Year 2 strategic planning

9. **Lead Marketplace Mechanics:**
   - Q: How do we price leads? Auction? Fixed price per lead? Revenue share if lead closes?
   - Decision needed by: Lead Marketplace design (Month 18-20)

10. **Financing API Integrations:**
    - Q: Which solar financing companies to integrate with? Sunlight Financial? Mosaic? GoodLeap? All of them?
    - Decision needed by: Week 16 (Consultant Meeting View - financing options suggester)

---

**Product Questions:**

11. **Script Management:**
    - Q: Can Consultants customize scripts per Person or strictly follow Sales Manager-defined scripts?
    - Trade-offs: Customization = flexibility but harder to measure adherence, Strict = consistency but less adaptable
    - Decision needed by: Week 12 (before Consultant Meeting View implementation)

12. **Effort-Based Round-Robin:**
    - Q: Should effort-based algorithm also consider negative factors (late to meetings, handoff too frequently)?
    - Decision needed by: Phase 1.5 planning (Week 22)

13. **AI Feature Prioritization:**
    - Q: In Phase 2 Advanced AI, which comes first: Tonality analysis, success pattern detection, or real-time coaching?
    - Decision needed by: Phase 2 planning (Month 18)

14. **Proposal Scraping:**
    - Q: Is proposal scraping technically feasible? Legal to scrape proposal tool's web app?
    - Decision needed by: Before adding to Phase 2 roadmap

15. **Self-Service Site Survey App:**
    - Q: Customer-facing mobile app or web app? How much AI validation on-device vs cloud?
    - Decision needed by: If/when prioritized (Phase 3+)

---

### Areas Needing Further Research

**1. WebRTC Architecture Validation (URGENT - Before MVP Start)**

**Questions:**
- Mediasoup SFU implementation complexity for 1-to-1 and 1-to-200 sessions
- TURN/STUN infrastructure costs at scale (Year 3: 50,000 users = how many concurrent video sessions?)
- Alternative: Managed services (Daily.co, LiveKit, Agora) cost comparison
- Bandwidth requirements per user, infrastructure cost modeling

**Action:**
- Build prototype WebRTC 1-to-1 session (Week 1-2)
- Load test with 200 simulated users (can Mediasoup handle it?)
- Decision: Custom vs managed by Week 4

---

**2. Convex Performance at Scale (MEDIUM URGENCY - Validate by Q2)**

**Questions:**
- How does Convex perform with 50,000 concurrent users (Year 3 target)?
- Query performance with millions of records per tenant (pipeline events, commission calculations, audit logs)
- WebSocket subscription limits per connection
- Cost modeling: Convex pricing at scale (compute units, storage, bandwidth)

**Action:**
- Load testing with simulated data (10K users, 1M pipeline records)
- Consult Convex team on scaling patterns
- Identify potential bottlenecks early (caching strategies, query optimization)

---

**3. Competitor Landscape Monitoring (ONGOING)**

**Questions:**
- Are Salesforce/HubSpot building solar-specific features?
- Any stealth startups in solar vertical SaaS?
- What are solar companies currently using? (Survey target customers)
- How much are they paying for current tools?

**Action:**
- Monthly competitor research (Google, LinkedIn, industry forums)
- Survey 10-20 solar companies (during sales conversations)
- Set up Google Alerts for "solar CRM", "solar sales software", "solar management platform"

---

**4. Regulatory Compliance Requirements (MEDIUM URGENCY - Year 2 Planning)**

**Questions:**
- What does SOC 2 certification cost? (legal, audit, infrastructure changes)
- GDPR compliance requirements for international expansion
- CCPA compliance for California customers (already required)
- 1099 contractor tax compliance (IRS Form 1099-NEC generation, deadlines)

**Action:**
- Consult compliance expert (Year 1, Q4)
- Budget $50K-100K for SOC 2 audit (Year 2)
- Implement GDPR-compliant data handling from start (easier than retrofitting)

---

**5. Financing API Integrations Research (MEDIUM URGENCY - Before Week 16)**

**Questions:**
- Which financing companies have APIs? (Sunlight Financial, Mosaic, GoodLeap, Dividend, others)
- What data do they provide? (rates, terms, approval status, credit check integration)
- What are integration costs? (setup fees, per-transaction fees, revenue share)
- Legal agreements required? (referral fees, co-marketing)

**Action:**
- Reach out to financing company BD teams (Week 10-12)
- Evaluate API documentation, integration complexity
- Decision by Week 14: Which 1-2 financing partners for MVP

---

**6. AI Cost Modeling (MEDIUM URGENCY - Phase 2 Planning)**

**Questions:**
- GPT-5 pricing (not released yet - estimate based on GPT-4 pricing trends)
- How many AI API calls per user per day? (tonality analysis, success patterns, coaching, site survey validation)
- On-device vs cloud split for computer vision (validate 80% on-device assumption)
- LLM fine-tuning costs for solar-specific models (is this necessary?)

**Action:**
- Model AI costs at scale (1,000 users, 10,000 users, 50,000 users)
- Prototype on-device TensorFlow Lite photo validation (validate cost savings)
- Re-evaluate when GPT-5 pricing announced

---

**7. Mobile Offline-First Architecture (LOW URGENCY - Phase 2 SunProject Planning)**

**Questions:**
- React Native + local state patterns for offline-first (best practices, libraries)
- Conflict resolution strategies (last-write-wins sufficient? or CRDTs needed?)
- Sync performance: How long does background sync take with 50+ photos per installation?
- Battery/data usage optimization for field workers

**Action:**
- Research field service app case studies (ServiceTitan, Housecall Pro)
- Prototype offline-first mobile app (Month 6-7)
- User testing with Installers (validate UX, performance)

---

**8. Lead Marketplace Economics (LOW URGENCY - Year 2 Planning)**

**Questions:**
- What's a fair price for a solar lead? ($50? $100? $200? varies by qualification level?)
- Auction model (highest bidder wins) or fixed price?
- Revenue share if lead closes (Sunup gets % of sale)?
- Legal: Any issues with lead buying/selling? Compliance with lead generation regulations?

**Action:**
- Survey solar companies: What do they currently pay for leads?
- Research lead generation legal requirements (TCPA compliance, opt-in requirements)
- Model marketplace economics (10-15% transaction fee sustainable?)

---

**9. Multi-Vertical Expansion Feasibility (LOW URGENCY - Year 3 Planning)**

**Questions:**
- How much of Sunup is reusable for HVAC/roofing/windows? (validate 80% estimate)
- What's different for each vertical? (commission structures, product configurations, workflows)
- Go-to-market strategy: Enter via existing solar customers doing HVAC? Or separate sales motion?
- Pricing: Same $100/user/month? Or adjust per vertical?

**Action:**
- Interview solar companies that also do HVAC/roofing (understand workflows)
- Map Sunup features to HVAC/roofing (identify overlaps, gaps)
- Validate expansion hypothesis before Year 3 commitment

---

**10. AI-Assisted Development Productivity (ONGOING - Validate Monthly)**

**Questions:**
- Are we actually achieving 10-20x productivity with AI-assisted development?
- Which features are easy for AI (CRUD, forms, styling) vs hard (WebRTC, real-time state, complex algorithms)?
- How much time does founder spend reviewing/refining AI-generated code?
- Is TDD slowing us down or speeding us up?

**Action:**
- Track velocity: Story points per week, features shipped per sprint
- Identify productivity bottlenecks (where is founder spending most time?)
- Adjust AI prompts, TDD process, architecture to optimize flow

---

## Appendices

### A. Research Summary

This Product Brief is informed by extensive prior research across 5 critical technical and market areas. All research documents are located in the `/docs` directory.

**1. Solar Installation Project Management Best Practices**
- **File**: `docs/research-solar-pm-best-practices.md`
- **Scope**: Industry-standard workflows for solar installation projects from sale to activation
- **Key Findings**:
  - Standard milestone sequence: Permits → Equipment → Installation → Inspection → Activation
  - Critical success factors: Crew scheduling, equipment tracking, permit management
  - Common pain points: Manual coordination, lack of real-time visibility, installer communication gaps
- **Application to Sunup**: Informed SunProject module design (Phase 2, Priority 1)

**2. WebRTC Scaling Architecture with Google Meet Features**
- **File**: `docs/research-webrtc-scaling-google-meet.md`
- **Scope**: Building WebRTC infrastructure for 1-to-1 and 1-to-200 video sessions
- **Key Findings**:
  - Mediasoup SFU proven for large-scale video sessions
  - TURN/STUN infrastructure required for NAT traversal
  - Bandwidth management critical for 200-person sessions
  - Alternative: Managed services (Daily.co, LiveKit) trade cost for convenience
- **Application to Sunup**: Informed MVP WebRTC design (1-to-1) and Training module planning (1-to-200)

**3. Multi-Tenancy Architecture (Pool Model with Convex RLS)**
- **File**: `docs/research-multi-tenancy-convex-rls.md`
- **Scope**: Implementing secure multi-tenant architecture using Convex Row-Level Security
- **Key Findings**:
  - Pool model (shared DB/schema) optimal for Sunup's needs
  - `convex-helpers` provides battle-tested RLS patterns
  - Composite indexes (tenantId, otherField) ensure performant tenant-scoped queries
  - Security critical: Every query must enforce tenantId check (no exceptions)
- **Application to Sunup**: Core architecture pattern for entire platform

**4. AI/Computer Vision for Site Surveys with Subject Validation**
- **File**: `docs/research-ai-computer-vision-site-surveys.md`
- **Scope**: Using AI to validate site survey photos and detect correct subjects
- **Key Findings**:
  - Hybrid approach optimal: 80% on-device (TensorFlow Lite) + 20% cloud (Google Cloud Vision)
  - Subject detection feasible (e.g., "Is this photo an electrical panel schedule?")
  - Cost model: $0 for on-device, minimal cloud API costs
  - Real-time validation improves data quality, reduces rework
- **Application to Sunup**: Informed SunProject mobile app (Phase 2) and site survey validation features

**5. Employment Site API Integrations (Indeed, LinkedIn, ZipRecruiter)**
- **File**: `docs/research-employment-api-integrations.md`
- **Scope**: Integrating with job boards for two-way applicant flow and analytics
- **Key Findings**:
  - Indeed, LinkedIn, ZipRecruiter all offer APIs for job posting + applicant webhooks
  - Cost: Pay-per-applicant or pay-per-post models
  - Analytics: Track performance per platform (views, clicks, applications, cost per hire)
  - Automation reduces recruiting burden for high-turnover Setter roles
- **Application to Sunup**: Informed Recruiting module design (Phase 2, Priority 4)

**Research Impact on Product Brief:**
- Validated technical feasibility of core MVP features (WebRTC, multi-tenancy, real-time performance)
- Informed Phase 2 roadmap priorities (SunProject, Recruiting, Training)
- Identified cost optimization strategies (on-device AI, Convex serverless)
- Surfaced open questions requiring further validation (managed vs custom WebRTC, financing API partners)

---

### B. Stakeholder Input

**Primary Stakeholder: Greg (Founder / Product Manager / Architect)**

**Domain Expertise:**
- Currently working as Solar Consultant (Setter → Consultant promotion path)
- Experienced all pain points firsthand as Setter and Consultant
- Deep understanding of solar industry workflows, roles, and pain
- Senior software architect/engineer with AI-assisted development experience

**Input Sources:**

**1. Lived Experience (Primary)**
- Daily experience of fragmentation tax (10+ tools during consultations, app-switching nightmare, screen-sharing fumbles)
- Personal success story: Self-directed learning via top performer call recordings, peer learning, expert mentorship
- Observed inefficiencies across all 12 roles (commission disputes, payment opacity, manual data aggregation)
- Contractor perspective: 1099 worker frustrated by lack of transparency, isolation, limited growth visibility

**2. Peer Conversations (Informal Research)**
- Discussions with other Setters and Consultants about shared pain points
- Insights from Sales Managers on time sink (data gathering vs coaching)
- Finance team frustration with manual commission reconciliation
- Recruiter challenges with high Setter turnover (50-70% annually)

**3. Brainstorming Sessions (Documented)**
- **Session 1** (2025-10-30): Explored all 12 roles, defined meeting handoff system
- **Session 2** (2025-11-03): Designed recruiting/training systems, dependency mapping, action planning
- Documented in: `docs/brainstorming-session-results-2025-10-30.md` and `docs/brainstorming-session-results-2025-11-03.md`

**4. Research Synthesis**
- 5 critical research areas completed (see Research Summary above)
- Validated technical assumptions (WebRTC, multi-tenancy, AI/computer vision)
- Informed product decisions (architecture, tech stack, Phase 2 priorities)

**Validation Approach:**
- **Pre-selling during development**: Engage first customer (likely current employer) early to validate assumptions
- **Iterative feedback**: Phased rollout with frequent check-ins
- **User testing**: Usability testing with Setters/Consultants during MVP development

**Notable Absence:**
- No formal user research interviews conducted yet (relying on founder's domain expertise)
- Mitigation: Founder is target user (Setter/Consultant), brings authentic voice of customer
- Future: Conduct formal user interviews during first customer onboarding (Month 5-6)

---

### C. References

**Industry Reports & Market Data:**

1. **Solar Industry Growth**
   - Inflation Reduction Act (IRA) solar incentives
   - State-level solar mandates and renewable energy targets
   - Solar industry employment data (supporting TAM estimates)

2. **Solar Installation Process**
   - Standard industry workflows (permits, inspections, equipment, installation)
   - Best practices from existing solar installers

**Technical Documentation:**

3. **Convex**
   - Official documentation: https://docs.convex.dev
   - Stack patterns: https://stack.convex.dev
   - Multi-tenancy with Row-Level Security patterns
   - Real-time subscriptions and event-driven architecture

4. **Mediasoup SFU**
   - WebRTC selective forwarding unit for large-scale video sessions
   - Architecture patterns for 1-to-200 participant sessions
   - TURN/STUN infrastructure requirements

5. **Clerk Authentication**
   - Multi-tenant authentication patterns
   - Role-based access control (RBAC) for 12 distinct roles
   - OAuth2, session management, MFA

6. **Next.js, React, TypeScript**
   - Next.js 16+ App Router patterns
   - React 19.2+ latest features (avoiding deprecated APIs)
   - TypeScript 5.8+ strict mode, end-to-end type safety

**Testing & Accessibility:**

7. **Test-Driven Development (TDD)**
   - Red-Green-Refactor cycle
   - Playwright 1.55+ for E2E tests
   - Vitest 4.0.7+ for unit/integration tests
   - Storybook 10+ for visual tests

8. **WCAG 2.1 Level AA**
   - Web Content Accessibility Guidelines
   - axe-core for automated accessibility testing
   - Keyboard navigation, screen reader support, color contrast requirements

**AI & Machine Learning:**

9. **AI-Assisted Development**
   - LLM-driven TDD approach (gpt-oss-20b for development, GPT-5 for production)
   - Productivity gains: 10-20x vs traditional development
   - Founder code review and PR approval process

10. **Computer Vision**
    - TensorFlow Lite for on-device photo validation
    - Google Cloud Vision API for cloud fallback
    - Hybrid approach: 80% on-device (cost optimization)

**Competitive Intelligence:**

11. **CRM Platforms**
    - Salesforce, HubSpot (generic horizontal CRMs)
    - Limitations for solar vertical (lack industry-specific workflows)
    - High cost, cobbled integrations, poor contractor engagement features

**Business Model & Economics:**

12. **Vertical SaaS Economics**
    - Niche market viability with AI-enabled development
    - Bootstrap-to-profitability models
    - Unit economics: LTV:CAC ratios, gross margins, customer retention

13. **SaaS Pricing**
    - Per-user-per-month pricing models
    - Vertical SaaS premium positioning
    - Early customer discounting strategies

**Regulatory & Compliance:**

14. **SOC 2 Certification**
    - Audit requirements for enterprise SaaS
    - Timeline and cost estimates ($50K-100K)

15. **GDPR & CCPA**
    - Data privacy requirements (international expansion, California customers)
    - Compliance-by-design patterns

16. **1099 Contractor Tax Compliance**
    - IRS Form 1099-NEC generation requirements
    - Financial data handling for independent contractors

**Employment & Recruiting:**

17. **Job Board APIs**
    - Indeed, LinkedIn, ZipRecruiter integration capabilities
    - Cost models: pay-per-applicant, pay-per-post
    - Applicant tracking system (ATS) patterns

**Infrastructure & Deployment:**

18. **Vercel**
    - Next.js hosting, edge functions, automatic scaling
    - Analytics, logs, observability

19. **GitHub Actions**
    - CI/CD pipeline automation
    - Automated testing, deployment workflows

20. **Mapbox**
    - Satellite imagery for property visualization
    - Mapping API for site location features

---

**Additional Resources:**

**Internal Documentation:**
- Brainstorming session notes: `docs/brainstorming-session-results-2025-10-30.md`, `docs/brainstorming-session-results-2025-11-03.md`
- Research documents: `docs/research-*.md` (5 documents)
- BMM workflow status: `docs/bmm-workflow-status.md`

**External Resources:**
- Solar industry forums and communities
- Software architecture patterns (modular monolith, event-driven, multi-tenancy)
- AI/LLM best practices for software development
- TDD and testing best practices

---

_All research, brainstorming, and stakeholder input synthesized into this comprehensive Product Brief to inform PRD development and implementation planning._

---

_This Product Brief serves as the foundational input for Product Requirements Document (PRD) creation._

_Next Steps: Handoff to Product Manager for PRD development using the `workflow prd` command._
