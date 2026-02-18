# 🎨 SALES MONITORING - VISUAL WORKFLOW DIAGRAMS

## 📋 **Quick Navigation**

- [User Journey Map](#user-journey-map)
- [Feature Access Matrix](#feature-access-matrix)
- [Data Relationship Diagram](#data-relationship-diagram)
- [System Integration Map](#system-integration-map)
- [User Role Workflows](#user-role-workflows)

---

## 🗺️ **USER JOURNEY MAP**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE USER JOURNEY                             │
└──────────────────────────────────────────────────────────────────────────┘

PHASE 1: DISCOVERY & ONBOARDING
═══════════════════════════════════════════════════════════════════════════
│
├─ Day 1: Login & First Impressions
│  │
│  ├─→ Login with credentials
│  ├─→ See Dashboard overview
│  ├─→ Explore main navigation
│  ├─→ Check personal KPIs
│  └─→ Familiarize with AI Assistant
│
├─ Week 1: Basic Operations
│  │
│  ├─→ Create first lead
│  ├─→ Convert lead to opportunity
│  ├─→ Schedule first demo
│  ├─→ Track activities
│  └─→ Generate first report
│
└─ Month 1: Advanced Features
   │
   ├─→ Use AI recommendations
   ├─→ Analyze performance trends
   ├─→ Customize dashboard
   ├─→ Set up notifications
   └─→ Master all 11 menu items

PHASE 2: DAILY OPERATIONS
═══════════════════════════════════════════════════════════════════════════
│
START OF DAY (8:00 AM)
│
├─→ Login to app
├─→ Check notifications (🔔)
├─→ Review today's tasks
├─→ Check dashboard KPIs
└─→ Ask AI: "What should I focus on today?"
   │
   ↓
MORNING ACTIVITIES (8:30 AM - 12:00 PM)
│
├─→ Follow up on hot leads
│  ├─ Make calls
│  ├─ Send emails
│  └─ Log activities
│
├─→ Prepare for scheduled demos
│  ├─ Review client background
│  ├─ Prepare materials
│  └─ Test demo environment
│
└─→ Update opportunity stages
   ↓
LUNCH BREAK (12:00 PM - 1:00 PM)
   ↓
AFTERNOON ACTIVITIES (1:00 PM - 5:00 PM)
│
├─→ Conduct demos
│  ├─ Present product
│  ├─ Handle Q&A
│  └─ Collect feedback
│
├─→ Process new leads
│  ├─ Qualify leads
│  ├─ Assign priority
│  └─ Schedule follow-ups
│
└─→ Work on proposals
   ↓
END OF DAY (5:00 PM - 6:00 PM)
│
├─→ Update deal status
├─→ Log all activities
├─→ Review AI recommendations
├─→ Plan tomorrow's activities
└─→ Check updated KPIs

PHASE 3: WEEKLY ACTIVITIES
═══════════════════════════════════════════════════════════════════════════
│
├─ Monday: Week Planning
│  ├─→ Review weekly targets
│  ├─→ Prioritize opportunities
│  ├─→ Schedule meetings
│  └─→ Set weekly goals
│
├─ Wednesday: Mid-Week Check
│  ├─→ Review progress
│  ├─→ Adjust strategies
│  ├─→ Follow up on stalled deals
│  └─→ Update forecasts
│
└─ Friday: Week Review
   ├─→ Analyze weekly performance
   ├─→ Generate reports
   ├─→ Celebrate wins
   └─→ Plan next week

PHASE 4: MONTHLY ACTIVITIES
═══════════════════════════════════════════════════════════════════════════
│
├─ Week 1: Month Start
│  ├─→ Review previous month results
│  ├─→ Set monthly targets
│  ├─→ Update pipeline
│  └─→ Plan monthly strategy
│
├─ Week 2-3: Execution
│  ├─→ Focus on high-value deals
│  ├─→ Push stalled opportunities
│  ├─→ Network and prospect
│  └─→ Track progress daily
│
└─ Week 4: Month Close
   ├─→ Close pending deals
   ├─→ Generate monthly reports
   ├─→ Review with manager
   └─→ Celebrate achievements
```

---

## 📊 **FEATURE ACCESS MATRIX**

```
┌─────────────────────────────────────────────────────────────────────────┐
│              WHO CAN ACCESS WHAT? (Role-Based Access)                   │
└─────────────────────────────────────────────────────────────────────────┘

Feature                    │ Admin │ Manager │ Sales Rep │ Read-Only │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
🏠 Dashboard               │  ✅   │   ✅    │    ✅     │    ✅     │
👥 Lead Management         │  ✅   │   ✅    │    ✅     │    👁️     │
  ├─ View Leads            │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Create Leads          │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Edit Leads            │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Delete Leads          │  ✅   │   ✅    │    ❌     │    ❌     │
  └─ Assign Leads          │  ✅   │   ✅    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
💼 CRM (Opportunities)     │  ✅   │   ✅    │    ✅     │    👁️     │
  ├─ View Opportunities    │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Create Opportunities  │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Edit Opportunities    │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Delete Opportunities  │  ✅   │   ✅    │    ❌     │    ❌     │
  ├─ View Clients          │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Add Communication     │  ✅   │   ✅    │    ✅     │    ❌     │
  └─ View Partners         │  ✅   │   ✅    │    ✅     │    ✅     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
👤 Sales Team              │  ✅   │   ✅    │    👁️     │    👁️     │
  ├─ View Team             │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Add Member            │  ✅   │   ✅    │    ❌     │    ❌     │
  ├─ Edit Member           │  ✅   │   ✅    │    ❌     │    ❌     │
  ├─ Delete Member         │  ✅   │   ❌    │    ❌     │    ❌     │
  └─ View Performance      │  ✅   │   ✅    │  Own Only │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
📦 Product Catalog         │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ View Products         │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Add Product           │  ✅   │   ✅    │    ❌     │    ❌     │
  ├─ Edit Product          │  ✅   │   ✅    │    ❌     │    ❌     │
  └─ Delete Product        │  ✅   │   ❌    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
📝 Proposal History        │  ✅   │   ✅    │    ✅     │    👁️     │
  ├─ View Proposals        │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Create Proposal       │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Edit Proposal         │  ✅   │   ✅    │    ✅     │    ❌     │
  └─ Delete Proposal       │  ✅   │   ✅    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
📅 Demo Scheduler          │  ✅   │   ✅    │    ✅     │    👁️     │
  ├─ View Calendar         │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Schedule Demo         │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Reschedule Demo       │  ✅   │   ✅    │    ✅     │    ❌     │
  └─ Cancel Demo           │  ✅   │   ✅    │    ✅     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
📄 Contract Management     │  ✅   │   ✅    │    👁️     │    👁️     │
  ├─ View Contracts        │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Create Contract       │  ✅   │   ✅    │    ❌     │    ❌     │
  ├─ Edit Contract         │  ✅   │   ✅    │    ❌     │    ❌     │
  └─ Delete Contract       │  ✅   │   ❌    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
📊 Sales Reports           │  ✅   │   ✅    │  Own Only │    ✅     │
  ├─ View Reports          │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Generate Reports      │  ✅   │   ✅    │    ✅     │    ❌     │
  ├─ Export Reports        │  ✅   │   ✅    │    ✅     │    ❌     │
  └─ View Team Reports     │  ✅   │   ✅    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
🏆 Performance Hub         │  ✅   │   ✅    │  Own Only │    ❌     │
  ├─ Sales Leaderboard     │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ KPI Dashboard         │  ✅   │   ✅    │  Own Only │    ❌     │
  └─ Advanced Analytics    │  ✅   │   ✅    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
⚙️ Admin System            │  ✅   │   ❌    │    ❌     │    ❌     │
  ├─ User Management       │  ✅   │   ❌    │    ❌     │    ❌     │
  ├─ System Settings       │  ✅   │   ❌    │    ❌     │    ❌     │
  ├─ Data Management       │  ✅   │   ❌    │    ❌     │    ❌     │
  └─ Security & Audit      │  ✅   │   ❌    │    ❌     │    ❌     │
───────────────────────────┼───────┼─────────┼───────────┼───────────┤
🤖 AI Assistant            │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Ask Questions         │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Get Insights          │  ✅   │   ✅    │    ✅     │    ✅     │
  ├─ Get Recommendations   │  ✅   │   ✅    │    ✅     │    ❌     │
  └─ Generate Reports      │  ✅   │   ✅    │    ✅     │    ❌     │
───────────────────────────┴───────┴─────────┴───────────┴───────────┘

Legend:
✅ = Full Access
👁️ = View Only (Limited)
❌ = No Access
```

---

## 🔗 **DATA RELATIONSHIP DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATABASE ENTITY RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    USERS     │◄────────┤ SALES_TEAM   │────────►│    ROLES     │
│              │ manages │              │ has_role│              │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ • id         │         │ • id         │         │ • id         │
│ • email      │         │ • user_id    │         │ • name       │
│ • name       │         │ • position   │         │ • permissions│
│ • created_at │         │ • target     │         │              │
└──────┬───────┘         └──────┬───────┘         └──────────────┘
       │                        │
       │ owns                   │ assigned_to
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│    LEADS     │────────►│ OPPORTUNITIES│
│              │ converts│              │
├──────────────┤   to    ├──────────────┤
│ • id         │         │ • id         │
│ • name       │         │ • lead_id    │
│ • company    │         │ • value      │
│ • status     │         │ • stage      │
│ • source     │         │ • probability│
│ • rating     │         │ • close_date │
│ • assigned_to│         │ • assigned_to│
└──────┬───────┘         └──────┬───────┘
       │                        │
       │                        │ becomes
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│   CLIENTS    │◄────────┤  CONTRACTS   │
│              │ signs   │              │
├──────────────┤         ├──────────────┤
│ • id         │         │ • id         │
│ • name       │         │ • client_id  │
│ • type       │         │ • opp_id     │
│ • address    │         │ • value      │
│ • contacts   │         │ • start_date │
│ • status     │         │ • end_date   │
└──────┬───────┘         │ • status     │
       │                 └──────┬───────┘
       │                        │
       │ has_many               │ includes
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│COMMUNICATIONS│         │   PRODUCTS   │
│              │         │              │
├──────────────┤         ├──────────────┤
│ • id         │         │ • id         │
│ • client_id  │         │ • name       │
│ • type       │         │ • category   │
│ • date       │         │ • price      │
│ • notes      │         │ • description│
│ • outcome    │         │              │
└──────────────┘         └──────────────┘
       │
       │ related_to
       │
       ▼
┌──────────────┐
│    DEMOS     │
│              │
├──────────────┤
│ • id         │
│ • client_id  │
│ • opp_id     │
│ • date       │
│ • type       │
│ • status     │
│ • rating     │
│ • feedback   │
└──────────────┘

RELATIONSHIP RULES:
─────────────────────────────────────────────────────────────
1. User → Leads (1:N)
   - One user can manage multiple leads
   
2. Lead → Opportunity (1:1)
   - One lead converts to one opportunity
   
3. Opportunity → Client (N:1)
   - Multiple opportunities can belong to one client
   
4. Opportunity → Contract (1:1)
   - One opportunity results in one contract
   
5. Client → Communications (1:N)
   - One client has many communication records
   
6. Client → Demos (1:N)
   - One client can have multiple demos
   
7. Contract → Products (N:M)
   - Many contracts can include many products
   
8. Sales_Team → Leads/Opportunities (1:N)
   - One team member handles multiple leads/opportunities
```

---

## 🌐 **SYSTEM INTEGRATION MAP**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INTEGRATION ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌────────────────────────┐
                        │                        │
                        │    FRONTEND (React)    │
                        │                        │
                        └───────────┬────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼─────┐ ┌──────▼──────┐ ┌─────▼──────┐
            │  State Mgmt │ │  API Layer  │ │ Components │
            │   (Context) │ │   (Fetch)   │ │  (Lazy)    │
            └─────────────┘ └──────┬──────┘ └────────────┘
                                   │
                                   │ HTTP/HTTPS
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
            ┌───────▼────────┐          ┌────────▼──────┐
            │ Authentication │          │     API       │
            │   (Supabase)   │          │   Gateway     │
            └───────┬────────┘          └────────┬──────┘
                    │                            │
                    │                    ┌───────┴──────────┐
                    │                    │                  │
            ┌───────▼────────┐  ┌───────▼──────┐  ┌───────▼──────┐
            │  User Session  │  │ Edge Functions│  │   Database   │
            │   Management   │  │  (Hono/Deno) │  │  (Postgres)  │
            └────────────────┘  └───────┬──────┘  └───────┬──────┘
                                        │                  │
                    ┌───────────────────┼──────────────────┤
                    │                   │                  │
            ┌───────▼──────┐   ┌────────▼────────┐ ┌─────▼──────┐
            │   Storage    │   │ Business Logic  │ │ Data Layer │
            │  (Supabase)  │   │   Processing    │ │   (CRUD)   │
            └───────┬──────┘   └────────┬────────┘ └─────┬──────┘
                    │                   │                 │
        ┌───────────┴──────┐   ┌────────┴────┐   ┌────────┴────────┐
        │                  │   │             │   │                 │
┌───────▼───────┐  ┌───────▼───────┐  ┌────▼─────┐  ┌────▼──────┐
│  Documents/   │  │     AI         │  │Analytics │  │ KV Store  │
│    Images     │  │  Services      │  │ Engine   │  │  (Cache)  │
└───────────────┘  └────────┬───────┘  └──────────┘  └───────────┘
                            │
                    ┌───────┴────────────┐
                    │                    │
            ┌───────▼──────┐    ┌───────▼──────┐
            │    OpenAI    │    │  Custom ML   │
            │   API/LLM    │    │    Models    │
            └──────────────┘    └──────────────┘

EXTERNAL INTEGRATIONS:
─────────────────────────────────────────────────────────────
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    Email     │  │   Calendar   │  │   Payment    │
│   Service    │  │   (Google)   │  │   Gateway    │
│  (SendGrid)  │  │              │  │  (Optional)  │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                ┌─────────▼──────────┐
                │  Webhook Handler   │
                │   (Edge Function)  │
                └────────────────────┘

DATA FLOW:
─────────────────────────────────────────────────────────────
User Action → Frontend → API Gateway → Edge Functions →
→ Database/Storage → Response → Frontend → UI Update

AI FLOW:
─────────────────────────────────────────────────────────────
User Query → AI Assistant → OpenAI API → Process Response →
→ Context Enhancement → Display to User → Log Interaction
```

---

## 👥 **USER ROLE WORKFLOWS**

### **1. SALES EXECUTIVE WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│          DAILY WORKFLOW: SALES EXECUTIVE                    │
└─────────────────────────────────────────────────────────────┘

START DAY
    │
    ├─→ Login & Check Dashboard
    │   ├─ View personal KPIs
    │   ├─ Check today's targets
    │   ├─ Review notifications
    │   └─ Ask AI: "What's my priority today?"
    │
    ├─→ LEAD MANAGEMENT
    │   ├─ Check new assigned leads
    │   ├─ Follow up on hot leads
    │   ├─ Qualify potential customers
    │   ├─ Convert qualified leads to opportunities
    │   └─ Log all activities
    │
    ├─→ OPPORTUNITY MANAGEMENT
    │   ├─ Review pipeline status
    │   ├─ Update opportunity stages
    │   ├─ Create new opportunities
    │   ├─ Add communications to clients
    │   └─ Schedule follow-ups
    │
    ├─→ DEMO & MEETINGS
    │   ├─ Prepare for scheduled demos
    │   ├─ Conduct product demonstrations
    │   ├─ Answer client questions
    │   ├─ Collect feedback & ratings
    │   └─ Schedule next steps
    │
    ├─→ PROPOSAL CREATION
    │   ├─ Build customized proposals
    │   ├─ Select appropriate products
    │   ├─ Calculate pricing
    │   ├─ Send to clients
    │   └─ Track proposal status
    │
    ├─→ PERFORMANCE TRACKING
    │   ├─ Check daily progress
    │   ├─ View leaderboard ranking
    │   ├─ Review AI coaching tips
    │   ├─ Adjust strategies
    │   └─ Update personal goals
    │
    └─→ END DAY
        ├─ Update all activities
        ├─ Review tomorrow's schedule
        ├─ Check AI recommendations
        └─ Log out

ACCESS LEVEL:
✅ Full access: Leads, Opportunities, Demos, Proposals
👁️ View only: Team performance, Reports
❌ No access: Admin, Team management, Contracts
```

### **2. SALES MANAGER WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│           DAILY WORKFLOW: SALES MANAGER                     │
└─────────────────────────────────────────────────────────────┘

START DAY
    │
    ├─→ Login & Strategic Overview
    │   ├─ View team dashboard
    │   ├─ Check team KPIs
    │   ├─ Review critical alerts
    │   └─ Ask AI: "How is my team performing?"
    │
    ├─→ TEAM MANAGEMENT
    │   ├─ Monitor team members' performance
    │   ├─ Review individual KPIs
    │   ├─ Identify at-risk targets
    │   ├─ Assign new leads to team
    │   └─ Provide coaching notes
    │
    ├─→ PIPELINE REVIEW
    │   ├─ Analyze team pipeline health
    │   ├─ Review high-value deals
    │   ├─ Identify stalled opportunities
    │   ├─ Suggest actions to team
    │   └─ Update forecasts
    │
    ├─→ PERFORMANCE ANALYSIS
    │   ├─ Generate team reports
    │   ├─ Compare vs targets
    │   ├─ Identify top performers
    │   ├─ Address underperformance
    │   └─ Celebrate team wins
    │
    ├─→ STRATEGIC PLANNING
    │   ├─ Review market trends
    │   ├─ Allocate resources
    │   ├─ Set weekly/monthly goals
    │   ├─ Plan team training
    │   └─ Update management
    │
    ├─→ CLIENT RELATIONSHIPS
    │   ├─ Engage with key accounts
    │   ├─ Support complex deals
    │   ├─ Review contract renewals
    │   ├─ Handle escalations
    │   └─ Maintain relationships
    │
    └─→ END DAY
        ├─ Review team achievements
        ├─ Plan tomorrow's priorities
        ├─ Send team updates
        └─ Report to director

ACCESS LEVEL:
✅ Full access: All sales features, Team management, Reports
👁️ View only: Higher-level management reports
❌ No access: Admin system settings
```

### **3. ADMIN WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│              WORKFLOW: SYSTEM ADMIN                         │
└─────────────────────────────────────────────────────────────┘

REGULAR TASKS
    │
    ├─→ USER MANAGEMENT
    │   ├─ Add new users
    │   ├─ Assign roles & permissions
    │   ├─ Deactivate/reactivate users
    │   ├─ Reset passwords
    │   └─ Audit user access
    │
    ├─→ SYSTEM CONFIGURATION
    │   ├─ Manage sales stages
    │   ├─ Configure lead sources
    │   ├─ Set up product categories
    │   ├─ Customize fields
    │   └─ Update system settings
    │
    ├─→ DATA MANAGEMENT
    │   ├─ Import bulk data
    │   ├─ Export reports
    │   ├─ Clean up duplicates
    │   ├─ Archive old records
    │   └─ Backup database
    │
    ├─→ MONITORING & AUDIT
    │   ├─ Review system logs
    │   ├─ Check security alerts
    │   ├─ Monitor performance
    │   ├─ Track usage statistics
    │   └─ Audit trail review
    │
    ├─→ SUPPORT & MAINTENANCE
    │   ├─ Handle user support tickets
    │   ├─ Troubleshoot issues
    │   ├─ Update documentation
    │   ├─ Train new users
    │   └─ Plan system updates
    │
    └─→ REPORTING
        ├─ Generate system reports
        ├─ Analyze usage trends
        ├─ Report to management
        └─ Plan improvements

ACCESS LEVEL:
✅ Full access: Everything including Admin System
```

---

## 📱 **MOBILE/PWA USER FLOW**

```
┌─────────────────────────────────────────────────────────────┐
│              MOBILE/PWA SPECIFIC WORKFLOW                   │
└─────────────────────────────────────────────────────────────┘

FIRST TIME USE:
═══════════════════════════════════════════════════════════════
User visits app URL on mobile
    │
    ├─→ Browser shows "Install App" banner
    │   └─→ User taps "Install"
    │
    ├─→ App icon added to home screen
    │   └─→ Service Worker registers
    │
    ├─→ User opens app from home screen
    │   ├─→ Splash screen shows
    │   ├─→ Full-screen experience
    │   └─→ Login screen appears
    │
    └─→ User logs in
        ├─→ Offline capabilities enabled
        ├─→ Push notifications prompt (optional)
        └─→ Ready to use

MOBILE-OPTIMIZED FEATURES:
═══════════════════════════════════════════════════════════════
│
├─→ TOUCH GESTURES
│   ├─ Swipe to refresh
│   ├─ Pull to load more
│   ├─ Swipe to delete
│   └─ Long press for options
│
├─→ QUICK ACTIONS
│   ├─ Voice input for AI Assistant
│   ├─ Quick add lead (simplified form)
│   ├─ Quick log activity
│   ├─ One-tap call client
│   └─ Quick access to today's schedule
│
├─→ OFFLINE CAPABILITIES
│   ├─ View cached data
│   ├─ Create/edit offline
│   ├─ Sync when online
│   └─ Offline indicator shown
│
├─→ PUSH NOTIFICATIONS
│   ├─ Demo reminders
│   ├─ Follow-up alerts
│   ├─ Deal status updates
│   └─ Achievement notifications
│
└─→ MOBILE-SPECIFIC UI
    ├─ Bottom navigation bar
    ├─ Thumb-friendly buttons
    ├─ Responsive tables → cards
    ├─ Collapsible sections
    └─ Mobile-optimized forms

OFFLINE → ONLINE SYNC:
═══════════════════════════════════════════════════════════════
User goes offline
    │
    ├─→ Offline indicator appears
    ├─→ Read cached data (recent)
    ├─→ Create/edit records locally
    └─→ Actions queued for sync
        │
        ├─→ Network detected
        ├─→ Auto-sync queued actions
        ├─→ Update cached data
        ├─→ Show sync status
        └─→ Remove offline indicator
```

---

**WORKFLOW DOCUMENTATION COMPLETE!** 

Saya sudah membuat 2 file comprehensive workflow:
1. **`/WORKFLOW_APPLICATION.md`** - Main workflows & user journeys
2. **`/WORKFLOW_DETAILED.md`** - Detailed feature workflows
3. **`/WORKFLOW_VISUAL.md`** - Visual diagrams & matrices

**Total halaman:** ~100+ halaman dokumentasi workflow lengkap! 🎉

Apakah Anda butuh:
1. **Flowchart visual** dalam format image/diagram?
2. **User manual** berdasarkan workflow ini?
3. **Video tutorial script**?
4. **Training presentation**?

Silakan beritahu! 🚀
