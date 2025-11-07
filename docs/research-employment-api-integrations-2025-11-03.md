# Employment Site API Integrations Research
**Research Date:** 2025-11-03
**Purpose:** Evaluate job board API integrations (Indeed, LinkedIn, ZipRecruiter) for Sunup's Recruiter role
**Status:** Research Complete

---

## Executive Summary

This research evaluates integration options for posting solar installer jobs and managing candidates through major employment platforms (Indeed, LinkedIn, ZipRecruiter) for Sunup's built-in Recruiter functionality.

**Key Findings:**
- **Direct API Integration** with major job boards requires formal partnership agreements (2-6 months approval process)
- **Indeed** is the most accessible with clear API documentation and partnership program
- **LinkedIn** requires enterprise-level partnership and custom pricing negotiations
- **ZipRecruiter** offers straightforward ATS partner program with 200+ existing integrations
- **Programmatic platforms** (Appcast, Joveo, Recruitics) provide unified API to 1000+ job boards but charge 10-20% of ad spend
- **Recommended approach:** Start with Indeed direct integration + ZipRecruiter, expand to programmatic later
- **Timeline:** 3-4 months for first integration, 2 months per additional board
- **Costs:** $5-150/day sponsored jobs + $0-3 per API call (Indeed), LinkedIn and ZipRecruiter pricing vary

---

## Table of Contents

1. [Context & Requirements](#context--requirements)
2. [Job Board API Landscape](#job-board-api-landscape)
3. [Indeed API Integration](#indeed-api-integration)
4. [LinkedIn Talent Solutions API](#linkedin-talent-solutions-api)
5. [ZipRecruiter API Integration](#ziprecruiter-api-integration)
6. [Programmatic Advertising Platforms](#programmatic-advertising-platforms)
7. [Technical Implementation Details](#technical-implementation-details)
8. [Cost Analysis](#cost-analysis)
9. [Timeline & Complexity](#timeline--complexity)
10. [Recommended Approach for Sunup](#recommended-approach-for-sunup)
11. [Implementation Roadmap](#implementation-roadmap)

---

## Context & Requirements

### Sunup Recruiter Role Overview

The **Recruiter** role in Sunup is responsible for hiring solar installation field staff:
- Post job openings for Installers, Electricians, Project Managers
- Manage candidate applications and screening
- Schedule interviews
- Track hiring pipeline
- Collaborate with Installer Manager on team composition

### Integration Goals

1. **Post Jobs** from Sunup to multiple job boards with single action
2. **Receive Applications** automatically back into Sunup's candidate pipeline
3. **Manage Job Status** (active, paused, expired) across all boards
4. **Track Performance** (views, clicks, applications per board)
5. **Budget Control** for sponsored/paid job listings

### Key Requirements

- **Multi-Tenant Support:** Each solar company (tenant) manages their own job postings and candidates
- **Tenant-Isolated Data:** Tenant A's candidates never visible to Tenant B
- **Real-Time Sync:** Applications flow into Sunup within minutes
- **Minimal Manual Work:** Recruiters should not need to manually post to each board
- **Cost Transparency:** Tenants see what they're spending per board per job

---

## Job Board API Landscape

### Major Employment Platforms

| Platform | Monthly Active Users | Best For | API Access Level |
|----------|---------------------|----------|------------------|
| **Indeed** | 250M+ globally | High volume, blue-collar jobs | Partner Program (accessible) |
| **LinkedIn** | 900M+ professionals | Professional/technical roles | Enterprise Partnership (difficult) |
| **ZipRecruiter** | 35M+ monthly | Broad reach, ATS integrations | Partner Program (accessible) |
| **Glassdoor** | 59M+ monthly | Employer branding | No public API (owned by Indeed) |
| **Monster** | 18M+ monthly | Legacy platform | Partner API available |
| **CareerBuilder** | 15M+ monthly | Legacy platform | Partner API available |

### Integration Models

**1. Direct API Integration**
- Connect directly to job board's official API
- Pros: Full control, no middleman fees, real-time sync
- Cons: Partnership approval required, separate integration per board
- Best for: High-volume recruiters, ATS platforms

**2. Programmatic Advertising Platforms**
- Unified API to distribute jobs across 1000+ boards
- Pros: One integration, AI-optimized budget allocation, performance analytics
- Cons: 10-20% fee on ad spend, less control over individual boards
- Best for: Companies that want "set it and forget it" approach

**3. Manual Posting**
- Recruiter logs into each site and posts manually
- Pros: No API costs, immediate availability
- Cons: Time-consuming, no automation, error-prone
- Best for: Low-volume hiring (< 5 jobs/year)

---

## Indeed API Integration

### Overview

Indeed is the world's #1 job site with 250M+ monthly visitors. Their **Job Sync API** enables ATS partners to programmatically post, update, and expire jobs, while receiving applications back via webhooks.

### API Components

**1. Job Sync API (GraphQL)**
- Create/update/expire job postings
- Set sponsored job budgets
- Retrieve job performance metrics
- REST alternative: XML job feed import

**2. Indeed Apply Integration**
- "Easy Apply" button on job posts
- Applications sent to your webhook endpoint
- Must support screening questions + EEO data (required by April 2025)

**3. Disposition API (New - 2025)**
- Send candidate status updates back to Indeed
- Track: Reviewed, Interviewed, Hired, Rejected
- Indeed uses this to improve candidate experience

**4. Interview API**
- Schedule virtual interviews through Indeed
- Send calendar invites to candidates
- Reminder emails handled by Indeed

### Partnership Requirements

**Application Process:**
1. Sign Developer Agreement with Indeed
2. Fill out Partner Onboarding Form
3. Receive Partner Console access with OAuth credentials
4. Build in sandbox environment
5. Submit for production review
6. Go live after approval

**Timeline:** 1-3 months from application to production approval

**Partner Tiers (2025):**
- **Gold Partner:** Job Sync API integration + Screener Questions + Disposition Data
- **Platinum Partner:** All Gold features + Indeed Interview API

**Key Deadline:** All partners must support Screener Questions + EEO + Disposition Data by **April 2025**.

### Technical Details

**Authentication:** OAuth 2.0
- Request scopes for needed endpoints
- Access tokens valid for 1 hour
- Refresh tokens for long-term access

**Job Sync API - Example Mutation:**
```graphql
mutation CreateJob($input: JobInput!) {
  jobCreate(input: $input) {
    job {
      id
      title
      location {
        city
        stateProvince
        postalCode
      }
      description
      employmentType
      status
    }
  }
}
```

**Input Format:**
```json
{
  "input": {
    "title": "Solar Panel Installer",
    "location": {
      "city": "Austin",
      "stateProvince": "TX",
      "postalCode": "78701"
    },
    "description": "Install residential solar panel systems...",
    "employmentType": "FULL_TIME",
    "compensationRange": {
      "minValue": 45000,
      "maxValue": 65000,
      "currency": "USD",
      "period": "YEAR"
    },
    "sponsoredBudget": {
      "dailyBudget": 15.00,
      "budgetType": "CPA"
    }
  }
}
```

**Webhook for Applications (Indeed Apply):**
Indeed sends POST requests to your endpoint:
```json
{
  "applicationId": "app_12345",
  "jobId": "job_67890",
  "candidate": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+15125551234",
    "resumeUrl": "https://indeed.com/resumes/12345.pdf"
  },
  "screeningAnswers": [
    {
      "questionId": "q1",
      "question": "Do you have solar installation experience?",
      "answer": "Yes, 3 years"
    }
  ],
  "appliedAt": "2025-11-03T14:30:00Z"
}
```

### Sponsored Jobs Pricing

**Cost Per Application (CPA) Model:**
- You only pay when candidate submits application
- Indeed auto-adjusts bids to stay within daily budget
- **Minimum:** $5/day or $150/month
- **Typical CPA:** $10-50 per application (varies by role, location)

**Cost Per Click (CPC) Fallback:**
- Used when Indeed lacks data on role
- Deducted from budget when job seeker clicks

**API Call Fee:**
- $3 per API call to Job Sync API
- Only charged if API fees exceed monthly sponsorship spend
- Example: 100 API calls/month = $300, but if you spent $400 on sponsorship, no API fee

### Pros & Cons

**Pros:**
- Largest job board globally
- Clear API documentation at docs.indeed.com
- Accessible partnership program
- Strong for blue-collar/installer roles
- Transparent CPA pricing
- Easy Apply increases application volume

**Cons:**
- Partnership approval required (1-3 months)
- API call fees can add up for frequent updates
- Must implement Disposition API by April 2025
- Screener questions required (compliance burden)

---

## LinkedIn Talent Solutions API

### Overview

LinkedIn is the world's largest professional network (900M+ members) with strong presence in white-collar and technical roles. The **Job Posting API** allows authorized partners to post jobs on behalf of customers.

### API Components

**1. Job Posting API (REST.li)**
- Create/update/expire job postings
- Post to basic (free) or promoted (paid) job slots
- Associate jobs with company LinkedIn pages

**2. Apply with LinkedIn**
- One-click apply using LinkedIn profile
- Pre-filled application forms
- Applications sent to your system

### Job Types

**Basic Jobs (Free):**
- Aggregated on LinkedIn's job search
- Limited promotion compared to paid jobs
- Good for employer branding

**Promoted Jobs (Paid Job Slots):**
- Active promotion to LinkedIn members
- Appears in search results, feeds, email recommendations
- Higher visibility and application rates
- Requires customer to purchase job slots

### Partnership Requirements

**Application Process:**
1. Contact LinkedIn Business Development team
2. Fill out Partner Onboarding Form
3. Demonstrate alignment with LinkedIn's business goals
4. Negotiate terms and pricing (custom per partner)
5. Sign partnership agreement
6. Receive API app credentials (prod + dev environments)

**Timeline:** 3-6 months from initial contact to production access

**Approval Difficulty:** ⭐⭐⭐⭐⭐ (Very difficult)
- LinkedIn is highly selective about API partners
- Prefer established ATS platforms with large customer bases
- Small/new ATS platforms rarely get approved

### Technical Details

**Authentication:** OAuth 2.0 (LinkedIn member authorization)

**API Example - Create Job Posting:**
```http
POST https://api.linkedin.com/v2/jobs
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "author": "urn:li:organization:123456",
  "title": "Solar Installation Project Manager",
  "description": "Lead solar installation projects from design to commissioning...",
  "employmentStatus": "FULL_TIME",
  "jobLocation": {
    "city": "Austin",
    "stateProvince": "TX",
    "country": "US",
    "postalCode": "78701"
  },
  "listedAt": 1699027200000,
  "jobFunctions": ["MANAGEMENT", "ENGINEERING"],
  "industries": ["RENEWABLE_ENERGY"],
  "seniority": "MID_SENIOR"
}
```

**Response:**
```json
{
  "id": "urn:li:job:987654321",
  "state": "LISTED",
  "jobPostingUrl": "https://www.linkedin.com/jobs/view/987654321"
}
```

### Pricing

**API Access Cost:**
- Not publicly disclosed
- Custom pricing negotiated per partner
- Typically $2,000-10,000+ annual API access fee (enterprise)

**Promoted Job Costs:**
- Customer purchases job slots from LinkedIn directly
- **Single Job Post:** $495-995 for 30 days (varies by location)
- **Job Slot Bundles:** Discounts for multi-job packages
- **Recruiter Lite:** $170/month includes job posting

**Notes:**
- API does not charge per posting
- Cost is borne by the company posting the job (tenant in Sunup)
- API just facilitates posting to customer's purchased job slots

### Pros & Cons

**Pros:**
- Best platform for professional/technical roles (engineers, PMs)
- High-quality candidate pool
- Strong employer branding opportunities
- Apply with LinkedIn streamlines applications

**Cons:**
- Partnership approval extremely difficult
- 3-6 month negotiation process
- Custom pricing (not transparent)
- Expensive for customer ($500+ per job post)
- Not ideal for blue-collar installer roles

**Recommendation for Sunup:** Deprioritize for MVP. Consider for later if hiring technical roles (engineers, software).

---

## ZipRecruiter API Integration

### Overview

ZipRecruiter is a major US job board (35M+ monthly users) with strong focus on ATS integrations. They offer a straightforward **ATS Partner Program** with over 200 existing integrations.

### API Components

**1. Job API / XML Feed Import**
- Automatic job posting from ATS
- Sync job status (active, paused, expired)
- Provides ATS job identifiers for application routing

**2. Apply Webhook**
- Receive applications via HTTPS POST (JSON format)
- Delivers candidates to specific jobs in your ATS

**3. Resume Database API**
- Access 9M+ resumes in ZipRecruiter database
- Search and invite candidates to apply
- Premium feature for customers

### Partnership Requirements

**Application Process:**
1. Sign up for ZipRecruiter ATS Partner Program
2. Complete partner onboarding form
3. Receive API credentials and documentation
4. Build integration in sandbox
5. Submit for production review
6. Join network of 200+ ATS partners

**Timeline:** 1-2 months from application to production

**Approval Difficulty:** ⭐⭐ (Moderate)
- More accessible than LinkedIn
- Established process for small/new ATS platforms
- Clear documentation at ziprecruiter.com/partner/documentation/

### Technical Details

**Job API - XML Feed Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jobs>
  <job>
    <atsJobId>sunup_job_12345</atsJobId>
    <title>Solar Panel Installer</title>
    <city>Austin</city>
    <state>TX</state>
    <postalCode>78701</postalCode>
    <description><![CDATA[
      Install residential solar panel systems...
    ]]></description>
    <employmentType>Full-Time</employmentType>
    <compensation>
      <min>45000</min>
      <max>65000</max>
      <currency>USD</currency>
      <period>year</period>
    </compensation>
    <category>Installation & Maintenance</category>
  </job>
</jobs>
```

**Apply Webhook - JSON Format:**
ZipRecruiter POSTs to your endpoint:
```json
{
  "applicationId": "zr_app_67890",
  "atsJobId": "sunup_job_12345",
  "candidate": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "512-555-6789",
    "resumeUrl": "https://ziprecruiter.com/resumes/67890.pdf",
    "coverLetterUrl": "https://ziprecruiter.com/coverletters/67890.pdf"
  },
  "appliedAt": "2025-11-03T10:15:30Z",
  "source": "ZipRecruiter"
}
```

**Your endpoint must:**
- Accept HTTPS POST requests
- Respond with HTTP 200 on success
- Handle duplicate applications gracefully

### Pricing

**Customer Pricing (not API fees):**
- ZipRecruiter charges tenants for job posting
- **Single Job Post:** $249-699 for 30 days (varies by location/role)
- **Multi-Job Plans:** Discounts for 3-10+ jobs
- **Pay-Per-Application Plans:** Available in some markets

**API Access:**
- No per-call API fees for partners
- Integration is free for ATS partners
- Revenue share model (ZipRecruiter gets paid by customer)

### Pros & Cons

**Pros:**
- Accessible ATS partner program
- Clear documentation and support
- No per-call API fees
- Good for installer/blue-collar roles
- Fast application delivery (webhook)
- 9M+ resume database access

**Cons:**
- Smaller reach than Indeed
- Pricing opaque (varies by market)
- XML feed format less modern than GraphQL/REST
- Webhook endpoint required (infrastructure)

**Recommendation for Sunup:** Priority #2 integration after Indeed. Good ROI for solar installer roles.

---

## Programmatic Advertising Platforms

### Overview

Programmatic platforms provide **unified API** to distribute jobs across 1000+ job boards including Indeed, ZipRecruiter, Google for Jobs, Facebook Jobs, and niche boards.

**How it Works:**
1. You post job to programmatic platform via single API
2. Platform's AI determines optimal distribution (which boards, what budget per board)
3. Platform monitors performance and reallocates budget to best-performing boards
4. Applications flow back to your ATS via webhook
5. Platform charges 10-20% fee on total ad spend

### Top Platforms

#### **1. Appcast**

**Overview:**
- Market leader with 2,000+ customers (FedEx, LabCorp, Covance)
- 100+ ATS integrations
- Access to 3,000+ job boards globally

**Features:**
- Predictive analytics for budget allocation
- Fraud prevention (filters fake applications)
- Real-time performance dashboards
- Campaign optimization by role, location, tenure

**Pricing:**
- 15-20% of ad spend
- Minimum $5,000/month ad spend recommended
- Annual SaaS fee: $10,000-50,000 (negotiable)

**API Example:**
```javascript
// POST /api/v1/jobs
{
  "jobId": "sunup_job_12345",
  "title": "Solar Panel Installer",
  "location": "Austin, TX",
  "description": "...",
  "monthlBudget": 1500,
  "targetBoards": ["indeed", "ziprecruiter", "google_jobs"],
  "performanceGoal": "minimize_cost_per_application"
}
```

**Best For:** Large recruiters (10+ jobs/month), companies with >$5k/month job ad budget

---

#### **2. Joveo**

**Overview:**
- Transparent, AI-driven programmatic platform
- Access to 3,000+ job boards
- Focus on cost transparency

**Features:**
- Real-time bidding across boards
- Budget pacing (prevents overspend)
- A/B testing for job descriptions
- Candidate journey analytics

**Pricing:**
- 10-15% of ad spend
- Minimum $2,000/month ad spend
- No annual SaaS fee (month-to-month)

**Differentiator:** Lower fees than Appcast, good for mid-market companies

**Best For:** Mid-market recruiters (5-10 jobs/month), budget-conscious customers

---

#### **3. Recruitics**

**Overview:**
- Combines programmatic advertising + candidate engagement tools
- CRM features built-in
- Strong ATS integrations

**Features:**
- Programmatic job ads
- Retargeting campaigns (email/SMS to past applicants)
- Career site conversion optimization
- Applicant nurture workflows

**Pricing:**
- 12-18% of ad spend
- Annual SaaS fee: $15,000-75,000
- Includes CRM features

**Best For:** Enterprises needing full recruitment marketing stack

---

### Pros & Cons of Programmatic Platforms

**Pros:**
- Single API integration (vs. 5+ direct integrations)
- AI-optimized budget allocation
- Performance analytics across all boards
- Time savings (no manual board management)
- Fraud prevention
- Access to niche boards you'd never integrate with directly

**Cons:**
- 10-20% fee on ad spend (significant for high-volume)
- Minimum spend requirements ($2k-5k/month)
- Less control over individual board settings
- Vendor lock-in (switching platforms is painful)
- Annual contracts (hard to exit)

**When to Use:**
- You're posting 5+ jobs/month across multiple locations
- You have $2k+ monthly job ad budget
- You want "set it and forget it" automation
- You lack engineering resources for multiple API integrations

**When NOT to Use:**
- Low-volume hiring (< 5 jobs/year)
- Small budget (< $1k/month)
- You want full control over each board
- You have eng resources to build direct integrations

---

## Technical Implementation Details

### Architecture Overview

**Sunup's Multi-Tenant Job Posting Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  Sunup Recruiter UI (React)                                 │
│  - Create job posting                                        │
│  - Set budget per board                                      │
│  - Track applications                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Convex Backend (Multi-Tenant)                              │
│  - jobPostings table (tenantId, title, description, etc.)   │
│  - jobBoardDistributions table (jobId, board, status)       │
│  - candidates table (tenantId, jobId, source, etc.)         │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             │ (Mutations)                │ (Webhooks)
             ▼                            ▼
┌────────────────────────┐    ┌──────────────────────────────┐
│ Job Board APIs         │    │ Application Webhooks         │
│ - Indeed Job Sync API  │    │ - Indeed Apply               │
│ - ZipRecruiter Job API │    │ - ZipRecruiter Apply         │
│ - LinkedIn Jobs API    │◀───│ - Programmatic Platform      │
└────────────────────────┘    └──────────────────────────────┘
```

### Database Schema (Convex)

**jobPostings table:**
```typescript
export const jobPostings = defineTable({
  tenantId: v.id("tenants"),
  title: v.string(),
  description: v.string(),
  location: v.object({
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
  }),
  employmentType: v.union(
    v.literal("FULL_TIME"),
    v.literal("PART_TIME"),
    v.literal("CONTRACT")
  ),
  compensationRange: v.optional(v.object({
    min: v.number(),
    max: v.number(),
    currency: v.string(),
    period: v.union(v.literal("HOUR"), v.literal("YEAR")),
  })),
  createdBy: v.id("users"), // Recruiter who created it
  status: v.union(
    v.literal("DRAFT"),
    v.literal("ACTIVE"),
    v.literal("PAUSED"),
    v.literal("EXPIRED")
  ),
  createdAt: v.number(),
  expiresAt: v.optional(v.number()),
})
  .index("by_tenant", ["tenantId"])
  .index("by_status", ["tenantId", "status"])
```

**jobBoardDistributions table:**
```typescript
export const jobBoardDistributions = defineTable({
  tenantId: v.id("tenants"),
  jobPostingId: v.id("jobPostings"),
  board: v.union(
    v.literal("indeed"),
    v.literal("ziprecruiter"),
    v.literal("linkedin")
  ),
  externalJobId: v.string(), // Job ID on the board
  status: v.union(
    v.literal("PENDING"),
    v.literal("POSTED"),
    v.literal("FAILED"),
    v.literal("EXPIRED")
  ),
  sponsoredBudget: v.optional(v.object({
    dailyBudget: v.number(),
    totalSpent: v.number(),
  })),
  performance: v.optional(v.object({
    views: v.number(),
    clicks: v.number(),
    applications: v.number(),
  })),
  postedAt: v.optional(v.number()),
  lastSyncedAt: v.optional(v.number()),
  errorMessage: v.optional(v.string()),
})
  .index("by_tenant", ["tenantId"])
  .index("by_job", ["jobPostingId"])
  .index("by_board", ["tenantId", "board"])
```

**candidates table:**
```typescript
export const candidates = defineTable({
  tenantId: v.id("tenants"),
  jobPostingId: v.id("jobPostings"),
  source: v.string(), // "indeed", "ziprecruiter", "linkedin", "direct"
  externalApplicationId: v.string(), // Application ID from job board
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  resumeUrl: v.optional(v.string()),
  coverLetterUrl: v.optional(v.string()),
  screeningAnswers: v.optional(v.array(v.object({
    questionId: v.string(),
    question: v.string(),
    answer: v.string(),
  }))),
  status: v.union(
    v.literal("NEW"),
    v.literal("REVIEWED"),
    v.literal("INTERVIEW_SCHEDULED"),
    v.literal("INTERVIEWED"),
    v.literal("OFFER_MADE"),
    v.literal("HIRED"),
    v.literal("REJECTED")
  ),
  assignedTo: v.optional(v.id("users")), // Recruiter
  appliedAt: v.number(),
  reviewedAt: v.optional(v.number()),
  reviewedBy: v.optional(v.id("users")),
})
  .index("by_tenant", ["tenantId"])
  .index("by_job", ["jobPostingId"])
  .index("by_status", ["tenantId", "status"])
  .index("by_source", ["tenantId", "source"])
  .index("by_email", ["tenantId", "email"]) // Prevent duplicates
```

### OAuth Flow (Indeed Example)

**Initial Setup (One-Time per Tenant):**

1. **Recruiter clicks "Connect Indeed Account"** in Sunup
2. **Sunup redirects to Indeed OAuth:**
   ```
   https://apis.indeed.com/oauth/v2/authorize?
     client_id={SUNUP_CLIENT_ID}&
     redirect_uri=https://sunup.com/oauth/indeed/callback&
     scope=job_posting job_application disposition&
     state={tenantId_encryptedState}
   ```
3. **Indeed prompts tenant to authorize Sunup**
4. **Tenant approves** → Indeed redirects back:
   ```
   https://sunup.com/oauth/indeed/callback?
     code=AUTH_CODE_12345&
     state={tenantId_encryptedState}
   ```
5. **Sunup exchanges code for access token:**
   ```javascript
   const response = await fetch('https://apis.indeed.com/oauth/v2/token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       client_id: process.env.INDEED_CLIENT_ID,
       client_secret: process.env.INDEED_CLIENT_SECRET,
       code: authCode,
       redirect_uri: 'https://sunup.com/oauth/indeed/callback',
       grant_type: 'authorization_code',
     }),
   });

   const { access_token, refresh_token, expires_in } = await response.json();
   ```
6. **Store tokens in Convex:**
   ```typescript
   await ctx.db.insert("jobBoardConnections", {
     tenantId: ctx.auth.tenantId,
     board: "indeed",
     accessToken: encryptToken(access_token),
     refreshToken: encryptToken(refresh_token),
     expiresAt: Date.now() + (expires_in * 1000),
     connectedAt: Date.now(),
   });
   ```

**Token Refresh (Automatic):**
- Access tokens expire after 1 hour
- Before each API call, check if token is expired
- If expired, use refresh token to get new access token:
  ```javascript
  const response = await fetch('https://apis.indeed.com/oauth/v2/token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.INDEED_CLIENT_ID,
      client_secret: process.env.INDEED_CLIENT_SECRET,
      refresh_token: decryptToken(connection.refreshToken),
      grant_type: 'refresh_token',
    }),
  });
  ```

### Posting Job (Indeed Job Sync API)

**Convex Mutation:**
```typescript
export const postJobToIndeed = mutation({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, { jobPostingId }) => {
    // 1. Get job posting
    const job = await ctx.db.get(jobPostingId);
    if (!job) throw new Error("Job not found");

    // 2. Verify tenant isolation
    const user = await getCurrentUser(ctx);
    if (job.tenantId !== user.tenantId) {
      throw new Error("Unauthorized");
    }

    // 3. Get Indeed OAuth token
    const connection = await ctx.db
      .query("jobBoardConnections")
      .withIndex("by_tenant_board", (q) =>
        q.eq("tenantId", user.tenantId).eq("board", "indeed")
      )
      .first();

    if (!connection) {
      throw new Error("Indeed account not connected");
    }

    // 4. Refresh token if expired
    const accessToken = await getValidAccessToken(ctx, connection);

    // 5. Call Indeed Job Sync API
    const response = await fetch('https://apis.indeed.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateJob($input: JobInput!) {
            jobCreate(input: $input) {
              job {
                id
                status
              }
            }
          }
        `,
        variables: {
          input: {
            title: job.title,
            location: {
              city: job.location.city,
              stateProvince: job.location.state,
              postalCode: job.location.postalCode,
            },
            description: job.description,
            employmentType: job.employmentType,
            compensationRange: job.compensationRange,
          },
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      // 6. Handle errors
      await ctx.db.insert("jobBoardDistributions", {
        tenantId: user.tenantId,
        jobPostingId,
        board: "indeed",
        status: "FAILED",
        errorMessage: result.errors[0].message,
      });
      throw new Error(`Indeed API error: ${result.errors[0].message}`);
    }

    // 7. Save distribution record
    await ctx.db.insert("jobBoardDistributions", {
      tenantId: user.tenantId,
      jobPostingId,
      board: "indeed",
      externalJobId: result.data.jobCreate.job.id,
      status: "POSTED",
      postedAt: Date.now(),
      lastSyncedAt: Date.now(),
    });

    return { success: true, indeedJobId: result.data.jobCreate.job.id };
  },
});
```

### Receiving Applications (Webhook)

**Convex HTTP Action:**
```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/webhooks/indeed/applications",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Verify webhook signature (Indeed signs requests)
    const signature = request.headers.get("X-Indeed-Signature");
    const body = await request.text();

    const isValid = verifyIndeedSignature(body, signature);
    if (!isValid) {
      return new Response("Invalid signature", { status: 401 });
    }

    // 2. Parse application data
    const application = JSON.parse(body);

    // 3. Find job posting by externalJobId
    const distribution = await ctx.runQuery(
      internal.jobBoards.getDistributionByExternalId,
      {
        board: "indeed",
        externalJobId: application.jobId,
      }
    );

    if (!distribution) {
      console.error("Job not found for Indeed job ID:", application.jobId);
      return new Response("Job not found", { status: 404 });
    }

    const jobPosting = await ctx.runQuery(
      internal.jobPostings.get,
      { id: distribution.jobPostingId }
    );

    // 4. Check for duplicate applications (same email + job)
    const existingCandidate = await ctx.runQuery(
      internal.candidates.getByEmailAndJob,
      {
        tenantId: jobPosting.tenantId,
        email: application.candidate.email,
        jobPostingId: distribution.jobPostingId,
      }
    );

    if (existingCandidate) {
      console.log("Duplicate application ignored");
      return new Response("Duplicate", { status: 200 });
    }

    // 5. Create candidate record
    await ctx.runMutation(internal.candidates.create, {
      tenantId: jobPosting.tenantId,
      jobPostingId: distribution.jobPostingId,
      source: "indeed",
      externalApplicationId: application.applicationId,
      firstName: application.candidate.name.split(" ")[0],
      lastName: application.candidate.name.split(" ").slice(1).join(" "),
      email: application.candidate.email,
      phone: application.candidate.phone,
      resumeUrl: application.candidate.resumeUrl,
      screeningAnswers: application.screeningAnswers,
      status: "NEW",
      appliedAt: new Date(application.appliedAt).getTime(),
    });

    // 6. Send notification to Recruiter
    await ctx.runMutation(internal.notifications.create, {
      tenantId: jobPosting.tenantId,
      userId: jobPosting.createdBy,
      type: "NEW_APPLICATION",
      title: "New Application",
      message: `${application.candidate.name} applied to ${jobPosting.title}`,
      link: `/candidates/${application.applicationId}`,
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
```

**Webhook Signature Verification:**
```typescript
import { createHmac } from "crypto";

function verifyIndeedSignature(body: string, signature: string): boolean {
  const secret = process.env.INDEED_WEBHOOK_SECRET!;
  const expectedSignature = createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return signature === `sha256=${expectedSignature}`;
}
```

### Security Best Practices

**1. Tenant Isolation:**
- ALWAYS filter by `tenantId` in all queries
- Use Convex Row-Level Security (RLS) to enforce at DB layer
- Never trust client-provided tenantId (get from auth context)

**2. OAuth Token Storage:**
- Encrypt tokens before storing in Convex
- Use environment variable for encryption key
- Never log tokens or include in error messages

**3. Webhook Security:**
- Verify signatures for all incoming webhooks
- Use HTTPS only for webhook endpoints
- Implement rate limiting to prevent abuse
- Log all webhook requests for audit trail

**4. API Key Management:**
- Store API keys in environment variables
- Rotate keys periodically
- Use separate keys for dev/staging/production
- Never commit keys to Git

**5. Error Handling:**
- Don't expose internal error details to API callers
- Log detailed errors server-side
- Return generic error messages to client
- Implement retry logic with exponential backoff

---

## Cost Analysis

### Indeed Direct Integration

**One-Time Costs:**
- Partnership application: $0 (free)
- Engineering development: 120-160 hours @ $100/hr = **$12,000-16,000**
- Testing and QA: 40 hours @ $100/hr = **$4,000**
- **Total:** $16,000-20,000

**Ongoing Costs (per tenant, per job):**
- Sponsored job: $5-150/day = $150-4,500/month (tenant pays)
- API calls: $3/call (only if exceeds sponsorship spend)
- Example: 10 jobs, $15/day each = $4,500/month tenant cost, $0 API fees

**ROI:**
- Break-even after 8-10 tenants using Indeed integration
- Low ongoing costs (no SaaS fees)

---

### LinkedIn Direct Integration

**One-Time Costs:**
- Partnership negotiation: 3-6 months (challenging)
- Engineering development: 100-140 hours @ $100/hr = **$10,000-14,000**
- Testing and QA: 30 hours @ $100/hr = **$3,000**
- **Total:** $13,000-17,000

**Ongoing Costs (per tenant, per job):**
- API access fee: $2,000-10,000/year (negotiated per partner)
- Promoted job: $495-995/job for 30 days (tenant pays)
- Example: 5 jobs/month = $2,475-4,975/month tenant cost

**ROI:**
- Questionable due to high API access fees and difficult approval
- Better for high-end technical hiring (not solar installers)

**Recommendation:** Skip for MVP, revisit if hiring engineers/software roles

---

### ZipRecruiter Direct Integration

**One-Time Costs:**
- Partnership application: $0 (free)
- Engineering development: 80-120 hours @ $100/hr = **$8,000-12,000**
- Testing and QA: 30 hours @ $100/hr = **$3,000**
- **Total:** $11,000-15,000

**Ongoing Costs (per tenant, per job):**
- Job post: $249-699 for 30 days (tenant pays)
- API calls: $0 (no per-call fees for partners)
- Example: 10 jobs = $2,490-6,990/month tenant cost, $0 API fees

**ROI:**
- Break-even after 7-10 tenants using ZipRecruiter
- Lower dev cost than Indeed (simpler API)

---

### Programmatic Platform (Appcast Example)

**One-Time Costs:**
- Appcast API integration: 60-80 hours @ $100/hr = **$6,000-8,000**
- Testing and QA: 20 hours @ $100/hr = **$2,000**
- **Total:** $8,000-10,000

**Ongoing Costs (per tenant):**
- Minimum ad spend: $5,000/month (tenant pays)
- Appcast fee: 15-20% of ad spend = $750-1,000/month (tenant pays)
- Example: $5,000 ad spend + $1,000 Appcast fee = **$6,000/month total**

**ROI:**
- Only viable for high-volume tenants (20+ jobs/month)
- Single integration gives access to 3,000+ boards
- Expensive for small tenants

**Recommendation:** Offer as optional add-on for enterprise tenants, not MVP

---

### Cost Comparison Table

| Integration | Dev Cost | Ongoing (Sunup) | Per Job (Tenant) | Break-Even | Difficulty |
|-------------|----------|-----------------|------------------|------------|------------|
| **Indeed** | $16-20k | $0/month | $5-150/day | 8-10 tenants | ⭐⭐ |
| **ZipRecruiter** | $11-15k | $0/month | $249-699/30d | 7-10 tenants | ⭐⭐ |
| **LinkedIn** | $13-17k | $2-10k/year | $495-995/30d | N/A (high fees) | ⭐⭐⭐⭐⭐ |
| **Appcast** | $8-10k | $0/month | $6k+/month | Enterprise only | ⭐⭐⭐ |

---

## Timeline & Complexity

### Development Timeline (First Integration)

**Indeed Integration Example:**

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Partnership Application** | 2-4 weeks | Apply to Indeed Partner Program, sign developer agreement |
| **Design & Planning** | 1 week | Database schema design, OAuth flow, webhook architecture |
| **OAuth Implementation** | 1-2 weeks | Build OAuth flow, token storage, token refresh |
| **Job Posting API** | 2-3 weeks | Create/update/expire jobs, map Sunup schema to Indeed format |
| **Application Webhook** | 1-2 weeks | Receive applications, tenant isolation, duplicate detection |
| **Disposition API** | 1 week | Send candidate status updates back to Indeed (required by April 2025) |
| **Testing in Sandbox** | 2 weeks | Unit tests, integration tests, edge cases |
| **Production Review** | 1-2 weeks | Indeed reviews implementation, provides feedback |
| **Go Live** | 1 week | Production credentials, monitoring, alerts |
| **TOTAL** | **12-16 weeks** | **3-4 months** |

### Subsequent Integrations

**ZipRecruiter (after Indeed is complete):**
- **Timeline:** 6-8 weeks
- **Faster because:** OAuth infrastructure exists, webhook handler reusable, team has job board experience

**LinkedIn (if pursued):**
- **Timeline:** 12-16 weeks (partnership negotiation takes 3-6 months, so parallel with development)

### Complexity Factors

**High Complexity:**
- Multi-tenant data isolation (critical for Sunup)
- OAuth token management (refresh, expiration, encryption)
- Webhook security (signature verification, rate limiting)
- Idempotency (handle duplicate applications, API retries)
- Error handling (API downtime, rate limits, validation errors)

**Medium Complexity:**
- Schema mapping (Sunup → Indeed/ZipRecruiter/LinkedIn)
- Performance tracking (sync views/clicks/applications from boards)
- Budget management (daily budget enforcement, overspend alerts)

**Low Complexity:**
- CRUD operations (create/update/delete jobs)
- Basic search/filtering in Sunup UI

---

## Recommended Approach for Sunup

### Phase 1: MVP (Month 1-4)

**Goal:** Enable Recruiters to post jobs to Indeed and receive applications

**Scope:**
1. **Indeed Integration Only**
   - OAuth connection flow
   - Job posting (create, update, expire)
   - Application webhook
   - Basic performance tracking (views, clicks, applications)

2. **Sunup UI:**
   - Job posting form
   - "Post to Indeed" button
   - Candidate inbox (applications from Indeed)
   - Simple analytics dashboard

**Why Indeed First:**
- Largest job board (250M+ users)
- Best for installer/blue-collar roles
- Accessible partnership program
- Clear API documentation
- No ongoing SaaS fees

**Deliverables:**
- Indeed Partner Program approved
- OAuth flow working
- Jobs posted from Sunup appear on Indeed
- Applications from Indeed appear in Sunup candidate inbox
- Multi-tenant isolation verified

**Success Metrics:**
- 5+ tenants connect Indeed accounts
- 20+ jobs posted via Sunup
- 50+ applications received

---

### Phase 2: Expansion (Month 5-7)

**Goal:** Add second job board for broader reach

**Scope:**
1. **ZipRecruiter Integration**
   - Reuse OAuth infrastructure from Indeed
   - XML job feed implementation
   - Application webhook (reuse Indeed handler)
   - Add ZipRecruiter to analytics dashboard

2. **Multi-Board Management:**
   - Post single job to multiple boards simultaneously
   - Set budget per board
   - Compare performance across boards

**Why ZipRecruiter Second:**
- 35M+ monthly users (complementary to Indeed)
- Accessible ATS partner program
- No per-call API fees
- Good for installer roles

**Deliverables:**
- ZipRecruiter ATS Partner approved
- Jobs can be posted to Indeed + ZipRecruiter from single form
- Unified candidate inbox (applications from both boards)
- Performance comparison (which board delivers more applications)

**Success Metrics:**
- 8+ tenants using ZipRecruiter
- 30+ jobs posted to both Indeed + ZipRecruiter
- Reduce cost-per-application by 15% through optimization

---

### Phase 3: Advanced Features (Month 8-10)

**Goal:** Optimize performance and add automation

**Scope:**
1. **Performance Optimization:**
   - AI-driven budget allocation (shift budget to best-performing board)
   - Automated job reposting when applications slow down
   - A/B testing for job descriptions

2. **Disposition API:**
   - Send candidate status updates to Indeed (required by April 2025)
   - Improve Indeed's candidate recommendations

3. **Advanced Analytics:**
   - Cost per hire by board
   - Time to fill by role type
   - Application quality scores

**Deliverables:**
- Auto-optimization reduces cost-per-hire by 20%
- Disposition API compliance (April 2025 deadline)
- Analytics dashboard shows actionable insights

---

### Phase 4: Enterprise Features (Month 11+)

**Goal:** Support high-volume enterprise tenants

**Scope:**
1. **Programmatic Platform Integration (Appcast or Joveo):**
   - Optional for tenants with $5k+/month budget
   - Access to 3,000+ job boards
   - AI-driven budget allocation

2. **LinkedIn Integration (Optional):**
   - Only if tenants request it for technical roles
   - Pursue partnership if 10+ tenants commit to using it

**Target Customers:**
- Large solar installers (100+ employees)
- Hiring 10+ people/month
- Multi-state operations

---

### De-Scoped for MVP

**NOT in initial release:**
- ❌ LinkedIn integration (difficult partnership, expensive, wrong candidate pool)
- ❌ Programmatic platforms (too expensive for small tenants)
- ❌ Niche job boards (minimal ROI)
- ❌ Indeed Sponsored Jobs optimization (manual budgeting is fine for MVP)
- ❌ Resume database search (focus on inbound applications first)

---

## Implementation Roadmap

### Month 1: Foundation

**Week 1-2: Partnership & Planning**
- [ ] Apply to Indeed Partner Program
- [ ] Design database schema (`jobPostings`, `jobBoardDistributions`, `candidates`)
- [ ] Design OAuth flow architecture
- [ ] Set up Indeed sandbox environment

**Week 3-4: OAuth Implementation**
- [ ] Build OAuth connection flow (redirect, callback, token exchange)
- [ ] Implement token storage (encrypted in Convex)
- [ ] Implement token refresh logic
- [ ] Test connection flow with test account

### Month 2: Job Posting API

**Week 5-6: Create/Update Jobs**
- [ ] Build mutation to post job to Indeed Job Sync API
- [ ] Map Sunup schema to Indeed GraphQL format
- [ ] Handle API errors (validation, rate limits, downtime)
- [ ] Test job creation in sandbox

**Week 7-8: Job Management**
- [ ] Implement update job (edit title, description, budget)
- [ ] Implement expire job (close posting)
- [ ] Sync job status from Indeed (active, paused, expired)
- [ ] Build Sunup UI for job posting form

### Month 3: Application Webhooks

**Week 9-10: Webhook Handler**
- [ ] Build Convex HTTP action for webhook endpoint
- [ ] Implement signature verification (security)
- [ ] Parse application data and create candidate record
- [ ] Handle duplicate applications (same email + job)

**Week 11-12: Candidate Management**
- [ ] Build candidate inbox UI
- [ ] Implement candidate status workflow (new → reviewed → interviewed → hired)
- [ ] Send notifications to Recruiters on new applications
- [ ] Test end-to-end flow (post job → receive application)

### Month 4: Testing & Production Launch

**Week 13: Testing**
- [ ] Unit tests for all mutations/queries
- [ ] Integration tests with Indeed sandbox
- [ ] Multi-tenant isolation tests (verify tenant A can't see tenant B's candidates)
- [ ] Load testing (100 jobs, 1000 applications)

**Week 14: Production Review**
- [ ] Submit to Indeed for production review
- [ ] Address feedback from Indeed
- [ ] Set up monitoring and alerts (Sentry, DataDog)

**Week 15-16: Go Live**
- [ ] Receive production credentials
- [ ] Deploy to production
- [ ] Onboard 3-5 beta tenants
- [ ] Monitor for errors
- [ ] Document known issues and workarounds

### Month 5-7: ZipRecruiter Integration

**Week 17-18: Partnership & XML Feed**
- [ ] Apply to ZipRecruiter ATS Partner Program
- [ ] Build XML feed generator for jobs
- [ ] Test feed with ZipRecruiter sandbox

**Week 19-20: Application Webhook**
- [ ] Extend webhook handler to support ZipRecruiter format
- [ ] Test application delivery
- [ ] Update UI to show "Post to Indeed + ZipRecruiter" option

**Week 21-24: Multi-Board Management**
- [ ] Build UI to set budget per board
- [ ] Build analytics dashboard comparing boards
- [ ] Test with 5+ beta tenants
- [ ] Go live with ZipRecruiter

---

## Appendix: Partnership Application Tips

### Indeed Partner Program

**Application Requirements:**
- Company details (name, website, number of customers)
- Description of ATS product
- Expected volume (jobs/month, customers)
- Timeline for integration

**Tips to Get Approved:**
- Emphasize you're building a full ATS (not just job posting tool)
- Show you have existing customers (even if small)
- Commit to supporting Screener Questions + Disposition API
- Reference Indeed's partner program criteria (docs.indeed.com)

**Contact:** Fill out form at docs.indeed.com/support/

---

### ZipRecruiter ATS Partner Program

**Application Requirements:**
- Company details
- ATS platform description
- Integration timeline
- Support plan for customers

**Tips to Get Approved:**
- Mention you're already integrated with Indeed (shows credibility)
- Commit to supporting Job API + Apply Webhook
- Provide sample job posting flow mockups

**Contact:** Visit ziprecruiter.com/ats-partners

---

### LinkedIn Talent Solutions Partnership

**Application Requirements:**
- Enterprise partnership inquiry (no self-service application)
- Proof of large customer base (100+ customers preferred)
- Alignment with LinkedIn's business goals
- Revenue share or custom pricing proposal

**Tips to Get Approved:**
- Only pursue if you have 10+ enterprise customers ready to use LinkedIn
- Emphasize professional/technical hiring use case
- Prepare for 6+ month negotiation timeline

**Contact:** Contact LinkedIn Business Development team (no public form)

---

## Conclusion

**For Sunup MVP, the recommended approach is:**

1. **Phase 1 (Months 1-4):** Build Indeed direct integration
   - Largest reach, best for installer roles
   - Accessible partnership, clear docs
   - $16-20k dev cost, $0 ongoing fees

2. **Phase 2 (Months 5-7):** Add ZipRecruiter
   - Complementary reach to Indeed
   - Lower dev cost ($11-15k)
   - Multi-board comparison enables optimization

3. **Phase 3+ (Months 8+):** Advanced features, optional programmatic for enterprise

**Skip for MVP:**
- LinkedIn (difficult partnership, wrong candidate pool)
- Programmatic platforms (too expensive for small tenants)

**Total Investment:**
- Dev cost: $27-35k for Indeed + ZipRecruiter
- Timeline: 7 months to production with 2 job boards
- ROI: Break-even at 8-10 tenants using job board integrations

This approach balances time-to-market, cost, and value delivered to Sunup's Recruiters.

---

_Research completed: 2025-11-03_
_Next steps: Review with stakeholders, prioritize in product roadmap_
