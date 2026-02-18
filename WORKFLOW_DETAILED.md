# 📊 SALES MONITORING - APPLICATION WORKFLOW

## 🎯 **TABLE OF CONTENTS**

1. [User Journey Overview](#user-journey-overview)
2. [Login & Authentication Flow](#login--authentication-flow)
3. [Main Menu & Navigation Flow](#main-menu--navigation-flow)
4. [Lead Management Workflow](#lead-management-workflow)
5. [Opportunity Management Workflow](#opportunity-management-workflow)
6. [Sales Team Management Workflow](#sales-team-management-workflow)
7. [Demo Scheduler Workflow](#demo-scheduler-workflow)
8. [Contract Management Workflow](#contract-management-workflow)
9. [Sales Reports & Analytics Workflow](#sales-reports--analytics-workflow)
10. [AI Assistant Workflow](#ai-assistant-workflow)
11. [Admin System Workflow](#admin-system-workflow)
12. [Data Flow Architecture](#data-flow-architecture)

---

## 📱 **USER JOURNEY OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ENTRY POINT                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌──────────────┐
                    │   Login      │
                    │   Screen     │
                    └──────────────┘
                            ↓
                ┌───────────────────────┐
                │  Authentication       │
                │  (Supabase Auth)      │
                └───────────────────────┘
                            ↓
                ┌───────────────────────┐
                │  Dashboard / Home     │
                │  (Overview KPIs)      │
                └───────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        │         MAIN NAVIGATION               │
        └───────────────────┬───────────────────┘
                            ↓
        ┌───────────────────────────────────────────┐
        │                                           │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌───▼────┐
   │ Leads   │  │ Opps    │  │ Team    │  │ Reports│
   └─────────┘  └─────────┘  └─────────┘  └────────┘
        │            │            │            │
   ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌───▼────┐
   │ Product │  │ Demos   │  │Contract │  │ Admin  │
   └─────────┘  └─────────┘  └─────────┘  └────────┘
        │            │            │            │
   ┌────▼────────────▼────────────▼────────────▼────┐
   │         AI ASSISTANT (Always Available)        │
   └─────────────────────────────────────────────────┘
```

---

## 🔐 **LOGIN & AUTHENTICATION FLOW**

```
START: User opens app
│
├─→ Check Session
│   │
│   ├─→ [Session Exists]
│   │   ├─→ Validate Token
│   │   │   ├─→ [Valid] → Dashboard
│   │   │   └─→ [Invalid] → Login Screen
│   │
│   └─→ [No Session] → Login Screen
│
└─→ LOGIN SCREEN
    │
    ├─→ User enters credentials
    │   │
    │   ├─→ Email + Password
    │   │   └─→ Supabase.auth.signInWithPassword()
    │   │
    │   └─→ Social Login (Optional)
    │       ├─→ Google OAuth
    │       ├─→ GitHub OAuth
    │       └─→ Facebook OAuth
    │
    ├─→ Authentication Request
    │   ├─→ [Success]
    │   │   ├─→ Store access_token
    │   │   ├─→ Store user data in AuthContext
    │   │   ├─→ Initialize database (if first time)
    │   │   └─→ Redirect to Dashboard
    │   │
    │   └─→ [Failed]
    │       ├─→ Show error message
    │       └─→ Return to Login Screen
    │
    └─→ DASHBOARD
        ├─→ Load user profile
        ├─→ Fetch KPIs
        ├─→ Show notifications
        └─→ Ready for navigation
```

### **Authentication States:**

```typescript
// User can be in one of these states:
- NOT_AUTHENTICATED → Show Login
- AUTHENTICATING    → Show Loading
- AUTHENTICATED     → Show Dashboard
- SESSION_EXPIRED   → Redirect to Login
```

---

## 🏠 **MAIN MENU & NAVIGATION FLOW**

```
┌────────────────────────────────────────────────────────────┐
│                      DASHBOARD (HOME)                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📊 KPI Cards (4):                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Revenue  │ │ Leads    │ │ Contracts│ │ Team     │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                            │
│  📈 Charts:                                                │
│  - Revenue Trend (Line Chart)                              │
│  - Leads by Status (Donut Chart)                           │
│  - Top Performers (Bar Chart)                              │
│                                                            │
│  🔔 Recent Activity:                                       │
│  - New leads                                               │
│  - Upcoming demos                                          │
│  - Contract updates                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
                            ↓
        ┌──────────────────────────────────────┐
        │      SIDEBAR NAVIGATION              │
        ├──────────────────────────────────────┤
        │  1. 🏠 Home (Dashboard)              │
        │  2. 👥 Lead Management               │
        │  3. 💼 CRM (Opportunities)           │
        │     ├─ All Opportunities             │
        │     ├─ Clients                       │
        │     └─ Partners                      │
        │  4. 👤 Sales Team                    │
        │  5. 📦 Product Catalog               │
        │  6. 📝 Proposal History              │
        │  7. 📅 Demo Scheduler                │
        │  8. 📄 Contract Management           │
        │  9. 📊 Sales Reports                 │
        │ 10. 🏆 Performance Hub               │
        │     ├─ Sales Leaderboard             │
        │     ├─ KPI Dashboard                 │
        │     └─ Advanced Analytics            │
        │ 11. ⚙️ Admin System                  │
        └──────────────────────────────────────┘
```

### **Navigation Pattern:**

```
User clicks menu item
    ↓
Lazy load component
    ↓
Show loading skeleton
    ↓
Fetch required data
    ↓
Render component with data
    ↓
Component ready for interaction
```

---

## 📞 **LEAD MANAGEMENT WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│               LEAD MANAGEMENT DASHBOARD                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Filters & Search:                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐        │
│  │ Status │ │ Source │ │ Rating │ │ Search...    │        │
│  └────────┘ └────────┘ └────────┘ └──────────────┘        │
│                                                             │
│  📋 Leads Table:                                            │
│  ┌───┬─────────┬────────┬────────┬────────┬────────┐      │
│  │ # │ Name    │ Status │ Source │ Rating │ Actions│      │
│  ├───┼─────────┼────────┼────────┼────────┼────────┤      │
│  │ 1 │ Lead A  │ New    │ Web    │ Hot    │ [...]  │      │
│  │ 2 │ Lead B  │ Contact│ Referral│ Warm  │ [...]  │      │
│  └───┴─────────┴────────┴────────┴────────┴────────┘      │
│                                                             │
│  [+ Add New Lead]  [📤 Export]  [📊 Analytics]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Add New Lead Flow:**

```
User clicks "+ Add New Lead"
    ↓
┌──────────────────────────┐
│   NEW LEAD FORM          │
├──────────────────────────┤
│ 1. Basic Info:           │
│    - Name *              │
│    - Company *           │
│    - Email *             │
│    - Phone               │
│    - Position            │
│                          │
│ 2. Lead Details:         │
│    - Source *            │
│    - Status              │
│    - Rating (Hot/Warm)   │
│    - Budget Range        │
│    - Timeline            │
│                          │
│ 3. Additional Info:      │
│    - Notes               │
│    - Tags                │
│    - Assigned To         │
│                          │
│ [Cancel] [Save Lead]     │
└──────────────────────────┘
    ↓
Validate Form
    ↓
[Invalid] → Show errors
    ↓
[Valid] → Save to database
    ↓
POST /api/leads
    ↓
[Success]
    ├─→ Show success toast
    ├─→ Add to leads list
    ├─→ Close form
    └─→ Update KPIs
    ↓
[Error]
    └─→ Show error message
```

### **Lead Status Progression:**

```
New → Contacted → Qualified → Proposal → Negotiation → Closed
 │                                                         │
 └──────────────── Lost/Rejected ←────────────────────────┘

Status Change Triggers:
- New → Contacted: When first call/email sent
- Contacted → Qualified: When need confirmed
- Qualified → Proposal: When proposal sent
- Proposal → Negotiation: When discussing terms
- Negotiation → Closed: When deal won
- Any → Lost: When deal lost/rejected
```

### **Lead Actions:**

```
For each lead, user can:
├─→ View Details (Click row)
│   └─→ Opens detail dialog with full info
│
├─→ Edit Lead (Edit icon)
│   └─→ Opens edit form (pre-filled)
│
├─→ Change Status (Status dropdown)
│   └─→ Updates status + logs activity
│
├─→ Add Note (Note icon)
│   └─→ Opens note dialog
│
├─→ Schedule Follow-up (Calendar icon)
│   └─→ Opens scheduler dialog
│
├─→ Convert to Opportunity (Convert button)
│   └─→ Creates new opportunity from lead
│
└─→ Delete Lead (Delete icon)
    └─→ Confirm → Delete from database
```

---

## 💼 **OPPORTUNITY MANAGEMENT WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│             CRM - OPPORTUNITY MANAGEMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📑 Tabs:                                                   │
│  [All Opportunities] [Clients] [Partners]                   │
│                                                             │
│  🎯 Pipeline View:                                          │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐      │
│  │  New    │Qualified│Proposal │Negotiat │  Won    │      │
│  │  (12)   │  (8)    │  (15)   │  (6)    │  (20)   │      │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤      │
│  │ [$200K] │ [$450K] │ [$1.2M] │ [$800K] │ [$3.5M] │      │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤      │
│  │ Opp A   │ Opp C   │ Opp E   │ Opp G   │ Opp I   │      │
│  │ Opp B   │ Opp D   │ Opp F   │ Opp H   │ Opp J   │      │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘      │
│                                                             │
│  [+ New Opportunity]  [📊 Forecast]  [🤖 AI Insights]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Create New Opportunity Flow:**

```
User clicks "+ New Opportunity"
    ↓
┌────────────────────────────────────────┐
│   NEW OPPORTUNITY DIALOG               │
├────────────────────────────────────────┤
│                                        │
│  📑 Tabs:                              │
│  [Basic Info] [AI Overview] [More]     │
│                                        │
│  TAB 1: BASIC INFO                     │
│  ├─ Opportunity Name *                 │
│  ├─ Client Name * (dropdown)           │
│  │   └─ [+ Add New Client]             │
│  ├─ Value (Rp) *                       │
│  ├─ Stage *                            │
│  ├─ Probability (%)                    │
│  ├─ Expected Close Date *              │
│  ├─ Assigned To                        │
│  └─ Description                        │
│                                        │
│  TAB 2: AI OVERVIEW                    │
│  ├─ 🤖 AI Insights                     │
│  ├─ 💡 Recommendations                 │
│  ├─ 📊 Win Probability                 │
│  ├─ 🎯 Next Best Actions               │
│  └─ 📈 Similar Deals                   │
│                                        │
│  TAB 3: MORE INFO                      │
│  ├─ Products/Services                  │
│  ├─ Competitors                        │
│  ├─ Decision Makers                    │
│  ├─ Budget Confirmed?                  │
│  └─ Notes                              │
│                                        │
│  [Cancel] [Save Opportunity]           │
└────────────────────────────────────────┘
    ↓
Validate Form
    ↓
[Valid] → Save to database
    ↓
AI Processing (Background)
    ├─→ Analyze deal characteristics
    ├─→ Compare with historical data
    ├─→ Calculate win probability
    ├─→ Generate recommendations
    └─→ Identify risks
    ↓
[Success]
    ├─→ Show success toast
    ├─→ Add to pipeline
    ├─→ Update forecast
    ├─→ Trigger AI analysis
    └─→ Send notifications
```

### **Opportunity Stages:**

```
Discovery → Qualification → Proposal → Negotiation → Closed Won
                                                         │
                                        Closed Lost ←────┘

Stage Automation:
├─ Discovery → Qualification
│  └─ Trigger: Need confirmed + Budget discussed
│
├─ Qualification → Proposal  
│  └─ Trigger: Proposal document sent
│
├─ Proposal → Negotiation
│  └─ Trigger: Client responds + Price negotiation started
│
├─ Negotiation → Closed Won
│  └─ Trigger: Terms agreed + Contract signed
│
└─ Any Stage → Closed Lost
   └─ Trigger: Client rejects or goes with competitor
```

### **Opportunity Detail View:**

```
Click on opportunity card
    ↓
┌────────────────────────────────────────────────────────────┐
│         OPPORTUNITY DETAIL DIALOG                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📑 Tabs: [Overview] [Activity] [Files] [AI Insights]     │
│                                                            │
│  OVERVIEW TAB:                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 📊 Key Metrics                                    │    │
│  │ - Value: Rp 500,000,000                          │    │
│  │ - Stage: Negotiation                             │    │
│  │ - Probability: 75%                               │    │
│  │ - Expected Close: Dec 2026                       │    │
│  │ - Days in Stage: 12 days                         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  👤 Client Information:                                    │
│  - Name: PT ABC Corporation                                │
│  - Contact: John Doe (CEO)                                 │
│  - Email: john@abc.com                                     │
│  - Phone: +62 812 3456 7890                                │
│                                                            │
│  📦 Products/Services:                                     │
│  - Hospital Management System (Rp 300M)                    │
│  - Training & Support (Rp 100M)                            │
│  - Maintenance (Rp 100M/year)                              │
│                                                            │
│  ACTIVITY TAB:                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 📝 Timeline                                       │    │
│  │ • Dec 1: Proposal sent                           │    │
│  │ • Nov 28: Demo completed                         │    │
│  │ • Nov 25: Meeting scheduled                      │    │
│  │ • Nov 20: Opportunity created                    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  [+ Add Note] [Schedule Activity] [Edit] [Delete]         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 👥 **SALES TEAM MANAGEMENT WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                SALES TEAM MANAGEMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 View Options:                                           │
│  [👥 Team View] [📊 Performance View] [📈 Analytics]       │
│                                                             │
│  👥 TEAM HIERARCHY:                                         │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Sales Director                                     │    │
│  │ └─ John Smith                                      │    │
│  │    ├─ Revenue: Rp 15B                             │    │
│  │    ├─ Team Size: 20                               │    │
│  │    └─ Performance: 120% of target                 │    │
│  │                                                    │    │
│  │    ├─ Regional Manager - Region A                 │    │
│  │    │  └─ Jane Doe                                 │    │
│  │    │     ├─ Revenue: Rp 6B                        │    │
│  │    │     ├─ Team: 8 members                       │    │
│  │    │     └─ Target: 110%                          │    │
│  │    │                                               │    │
│  │    │     ├─ Area Manager - Jakarta                │    │
│  │    │     │  └─ Bob Wilson                         │    │
│  │    │     │     ├─ Revenue: Rp 3B                  │    │
│  │    │     │     ├─ Team: 4 members                 │    │
│  │    │     │     └─ [View Details]                  │    │
│  │    │     │                                         │    │
│  │    │     │     ├─ Sales Executive 1               │    │
│  │    │     │     ├─ Sales Executive 2               │    │
│  │    │     │     ├─ Sales Executive 3               │    │
│  │    │     │     └─ Sales Executive 4               │    │
│  │    │     │                                         │    │
│  │    │     └─ Area Manager - Bandung                │    │
│  │    │                                               │    │
│  │    └─ Regional Manager - Region B                 │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  [+ Add Team Member] [📊 Team Analytics] [⚙️ Settings]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Add Team Member Flow:**

```
User clicks "+ Add Team Member"
    ↓
┌──────────────────────────┐
│  NEW TEAM MEMBER FORM    │
├──────────────────────────┤
│ 1. Personal Info:        │
│    - Full Name *         │
│    - Email *             │
│    - Phone               │
│    - Photo (upload)      │
│                          │
│ 2. Position Info:        │
│    - Role *              │
│      • Sales Executive   │
│      • Area Manager      │
│      • Regional Manager  │
│      • Sales Director    │
│    - Reports To *        │
│    - Territory           │
│    - Start Date          │
│                          │
│ 3. Targets:              │
│    - Revenue Target      │
│    - Lead Target         │
│    - Deal Target         │
│                          │
│ [Cancel] [Save Member]   │
└──────────────────────────┘
    ↓
Save to database
    ↓
[Success]
    ├─→ Add to hierarchy
    ├─→ Send welcome email
    ├─→ Create login account
    └─→ Assign initial tasks
```

### **Team Member Detail View:**

```
Click on team member
    ↓
┌────────────────────────────────────────────────────────────┐
│          TEAM MEMBER DETAIL DIALOG                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📑 Tabs: [Overview] [Performance] [Activity] [Notes]      │
│                                                            │
│  OVERVIEW TAB:                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 👤 Profile                                        │    │
│  │ - Name: John Sales                               │    │
│  │ - Position: Sales Executive                      │    │
│  │ - Email: john@company.com                        │    │
│  │ - Phone: +62 812 3456 7890                       │    │
│  │ - Territory: Jakarta Area                        │    │
│  │ - Reports To: Area Manager                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  📊 Current Performance:                                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Revenue:  Rp 450M / 500M (90%)                   │    │
│  │ [████████████████░░░░] 90%                       │    │
│  │                                                   │    │
│  │ Leads:    85 / 100 (85%)                         │    │
│  │ [████████████████░░░░░] 85%                      │    │
│  │                                                   │    │
│  │ Deals:    12 / 15 (80%)                          │    │
│  │ [████████████████░░░░░░] 80%                     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  PERFORMANCE TAB:                                          │
│  - Monthly trends                                          │
│  - Quarterly comparison                                    │
│  - Year-over-year growth                                   │
│  - Ranking in team                                         │
│                                                            │
│  ACTIVITY TAB:                                             │
│  - Recent deals closed                                     │
│  - Upcoming meetings                                       │
│  - Pipeline status                                         │
│  - Activity log                                            │
│                                                            │
│  [Edit Profile] [Set Targets] [View Reports]              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📅 **DEMO SCHEDULER WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                   DEMO SCHEDULER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 Calendar View:                                          │
│  ┌───────────────────────────────────────────────────┐    │
│  │  December 2026                    [Month] [Week]  │    │
│  ├───┬───┬───┬───┬───┬───┬───┬───────────────────────┤    │
│  │Mon│Tue│Wed│Thu│Fri│Sat│Sun│                       │    │
│  ├───┼───┼───┼───┼───┼───┼───┤                       │    │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  Upcoming Demos:      │    │
│  │   │ 🔵│   │ 🔵│   │   │   │  • Dec 2: Hospital A  │    │
│  ├───┼───┼───┼───┼───┼───┼───┤  • Dec 4: Clinic B    │    │
│  │ 8 │ 9 │10 │11 │12 │13 │14 │  • Dec 10: Hospital C │    │
│  │   │   │ 🔵│   │ 🟡│   │   │                       │    │
│  ├───┼───┼───┼───┼───┼───┼───┤  Status:              │    │
│  │15 │16 │17 │18 │19 │20 │21 │  🔵 Scheduled         │    │
│  │   │ 🔵│   │   │   │   │   │  🟡 Pending           │    │
│  │   │   │   │   │   │   │   │  🟢 Completed         │    │
│  └───┴───┴───┴───┴───┴───┴───┴───────────────────────┘    │
│                                                             │
│  [+ Schedule Demo] [📊 Demo Analytics] [📋 History]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Schedule New Demo Flow:**

```
User clicks "+ Schedule Demo"
    ↓
┌────────────────────────────────────────┐
│    SCHEDULE DEMO DIALOG                │
├────────────────────────────────────────┤
│                                        │
│  1. Client Information:                │
│     - Client Name * (dropdown)         │
│     - Contact Person *                 │
│     - Email *                          │
│     - Phone                            │
│                                        │
│  2. Demo Details:                      │
│     - Product/Service *                │
│     - Demo Type *                      │
│       • In-person                      │
│       • Virtual (Zoom/Teams)           │
│     - Date & Time *                    │
│     - Duration (hours)                 │
│     - Location/Meeting Link            │
│                                        │
│  3. Participants:                      │
│     - Assigned Sales Rep *             │
│     - Technical Support                │
│     - Additional Attendees             │
│                                        │
│  4. Preparation:                       │
│     - Demo Script                      │
│     - Presentation Files               │
│     - Sample Data                      │
│     - Notes                            │
│                                        │
│  5. Rating & Review (NEW):             │
│     - Expected Outcome                 │
│     - Client Interest Level            │
│     - ⭐⭐⭐⭐⭐ (Interactive)          │
│                                        │
│  [Cancel] [Schedule Demo]              │
└────────────────────────────────────────┘
    ↓
Validate availability
    ↓
Check calendar conflicts
    ↓
[Conflict Detected]
    └─→ Show warning + suggest alternatives
    ↓
[No Conflict] → Save demo
    ↓
[Success]
    ├─→ Add to calendar
    ├─→ Send email confirmation to client
    ├─→ Send notification to sales rep
    ├─→ Create reminder (1 day before)
    ├─→ Generate demo preparation checklist
    └─→ Update opportunity stage
```

### **Demo Status Flow:**

```
Scheduled → Confirmed → In Progress → Completed → Follow-up
                │                         │
                └─── Cancelled ←──────────┘
                           │
                      Rescheduled

Status Triggers:
- Scheduled → Confirmed: Client confirms attendance
- Confirmed → In Progress: Demo start time reached
- In Progress → Completed: Demo marked as done
- Completed → Follow-up: Feedback collected
- Any → Cancelled: Demo cancelled by either party
- Cancelled → Rescheduled: New date selected
```

### **Post-Demo Actions:**

```
After demo completion
    ↓
┌────────────────────────────────────────┐
│    DEMO FEEDBACK FORM                  │
├────────────────────────────────────────┤
│  1. Demo Outcome:                      │
│     ○ Very Successful                  │
│     ○ Successful                       │
│     ○ Neutral                          │
│     ○ Unsuccessful                     │
│                                        │
│  2. Client Feedback:                   │
│     - Interest Level: [High/Med/Low]   │
│     - Questions/Concerns:              │
│     - Next Steps Required:             │
│                                        │
│  3. Follow-up Actions:                 │
│     □ Send proposal                    │
│     □ Schedule another demo            │
│     □ Technical discussion needed      │
│     □ Pricing discussion               │
│     □ Contract negotiation             │
│                                        │
│  4. Internal Notes:                    │
│     [Text area for notes]              │
│                                        │
│  [Save Feedback] [Create Follow-up]    │
└────────────────────────────────────────┘
    ↓
Save feedback
    ↓
Auto-create follow-up tasks
    ↓
Update opportunity status
    ↓
Generate demo report
    ↓
[If successful] → Move to next stage
```

---

## 📄 **CONTRACT MANAGEMENT WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                CONTRACT MANAGEMENT                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔍 Filters:                                                │
│  [Status ▾] [Client ▾] [Value Range] [Date Range]         │
│                                                             │
│  📊 Contract Stats:                                         │
│  ┌─────────┬─────────┬─────────┬─────────┐                │
│  │  Draft  │ Active  │ Expiring│ Expired │                │
│  │   (5)   │  (45)   │   (8)   │  (12)   │                │
│  │ [$500K] │ [$15M]  │ [$2.5M] │ [$1M]   │                │
│  └─────────┴─────────┴─────────┴─────────┘                │
│                                                             │
│  📋 Contracts Table:                                        │
│  ┌───┬──────────┬────────┬────────┬────────┬────────┐     │
│  │ # │ Client   │ Value  │ Status │ Start  │ Actions│     │
│  ├───┼──────────┼────────┼────────┼────────┼────────┤     │
│  │ 1 │ ABC Corp │ 500M   │ Active │ Jan 26 │ [...]  │     │
│  │ 2 │ XYZ Ltd  │ 300M   │ Active │ Feb 26 │ [...]  │     │
│  │ 3 │ DEF Inc  │ 750M   │Expiring│ Dec 25 │ [...]  │     │
│  └───┴──────────┴────────┴────────┴────────┴────────┘     │
│                                                             │
│  [+ New Contract] [📤 Export] [⚠️ Renewal Alerts]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Create New Contract Flow:**

```
User clicks "+ New Contract"
    ↓
┌────────────────────────────────────────┐
│    NEW CONTRACT FORM                   │
├────────────────────────────────────────┤
│                                        │
│  1. Contract Basics:                   │
│     - Contract ID (auto)               │
│     - Client * (from opportunity)      │
│     - Contract Type *                  │
│       • New Business                   │
│       • Renewal                        │
│       • Upgrade                        │
│     - Value (Rp) *                     │
│                                        │
│  2. Term Details:                      │
│     - Start Date *                     │
│     - End Date *                       │
│     - Duration (calculated)            │
│     - Auto-renewal? □                  │
│     - Notice Period (days)             │
│                                        │
│  3. Products/Services:                 │
│     [+ Add Line Item]                  │
│     - Product 1: HMS (Rp 300M)         │
│     - Product 2: Training (Rp 100M)    │
│     - Product 3: Support (Rp 100M)     │
│                                        │
│  4. Payment Terms:                     │
│     - Payment Schedule *               │
│       • One-time                       │
│       • Monthly                        │
│       • Quarterly                      │
│       • Annual                         │
│     - Payment Method                   │
│     - Due Days                         │
│                                        │
│  5. Documents:                         │
│     [📎 Upload Contract PDF]           │
│     [📎 Upload Supporting Docs]        │
│                                        │
│  6. Stakeholders:                      │
│     - Account Manager *                │
│     - Sales Rep                        │
│     - Technical Lead                   │
│                                        │
│  [Cancel] [Save as Draft] [Activate]   │
└────────────────────────────────────────┘
    ↓
Validate form
    ↓
Generate contract number
    ↓
Save to database
    ↓
[Save as Draft]
    ├─→ Status: Draft
    └─→ Can be edited later
    ↓
[Activate]
    ├─→ Status: Active
    ├─→ Start date validation
    ├─→ Send notifications
    ├─→ Create renewal reminder
    ├─→ Update revenue forecasts
    └─→ Generate contract PDF
```

### **Contract Lifecycle:**

```
Draft → Pending Signature → Active → Expiring → Expired/Renewed
  │                            │         │
  └──────── Cancelled ─────────┴─────────┘

Status Automations:
├─ Draft → Pending Signature
│  └─ Trigger: Contract sent for signature
│
├─ Pending → Active
│  └─ Trigger: Contract signed by all parties
│
├─ Active → Expiring
│  └─ Trigger: 60 days before end date
│
├─ Expiring → Expired
│  └─ Trigger: End date reached + no renewal
│
├─ Expiring → Renewed
│  └─ Trigger: Renewal contract created
│
└─ Any → Cancelled
   └─ Trigger: Manual cancellation
```

### **Contract Renewal Workflow:**

```
60 days before expiry
    ↓
System generates renewal alert
    ↓
Notification sent to:
    ├─ Account Manager
    ├─ Sales Rep
    └─ Client (optional)
    ↓
Account Manager reviews contract
    ↓
┌─ Client interested in renewal?
│
├─→ YES
│   ├─ Review current terms
│   ├─ Check for upsell opportunities
│   ├─ Prepare renewal proposal
│   ├─ Schedule renewal discussion
│   ├─ Negotiate terms (if needed)
│   ├─ Create renewal contract
│   └─ Link to original contract
│
└─→ NO
    ├─ Understand reason for non-renewal
    ├─ Attempt to save the contract
    ├─ Offer special terms/discounts
    ├─ If unsuccessful → Mark as non-renewed
    └─ Conduct exit interview
```

---

## 📊 **SALES REPORTS & ANALYTICS WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│              SALES REPORTS OVERVIEW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 Key Performance Indicators:                             │
│  ┌───────────┬───────────┬───────────┬──────────────┐     │
│  │ Pipeline  │  Upside   │  Strong   │  Forecast    │     │
│  │  Value    │           │  Upside   │              │     │
│  ├───────────┼───────────┼───────────┼──────────────┤     │
│  │ Rp 8.5B   │ Rp 2.1B   │ Rp 1.8B   │ Rp 3.2B      │     │
│  │ ▲ +15%    │ ▲ +8%     │ ▲ +12%    │ ▲ +10%       │     │
│  └───────────┴───────────┴───────────┴──────────────┘     │
│                                                             │
│  📈 Period Filter:                                          │
│  [Monthly ●] [Quarterly ○] [Yearly ○]                      │
│  [Jan 2026 ▾]                                               │
│                                                             │
│  👥 Sales Team Hierarchy:                                   │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 🏢 Sales Director                                │     │
│  │ └─ Revenue: Rp 15B | Target: Rp 12B (125%) ✅   │     │
│  │    Click for details →                           │     │
│  │                                                   │     │
│  │    📍 Regional Manager - Region A                │     │
│  │    └─ Revenue: Rp 6B | Target: Rp 5B (120%) ✅  │     │
│  │       Click for details →                        │     │
│  │                                                   │     │
│  │       🎯 Area Manager - Jakarta                  │     │
│  │       └─ Revenue: Rp 3B | Target: Rp 2.5B ✅    │     │
│  │          Click for details →                     │     │
│  │                                                   │     │
│  │          👤 Sales Executive 1                    │     │
│  │          └─ Rev: Rp 450M | Target: Rp 500M 🟡   │     │
│  │             Click for details →                  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  [📥 Export Report] [📊 Advanced Analytics] [🤖 AI Insights]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Drill-Down Flow (4 Levels):**

```
LEVEL 1: Sales Director
    ↓ Click
┌────────────────────────────────────────┐
│  DIRECTOR DETAIL DIALOG                │
├────────────────────────────────────────┤
│  📑 Tabs:                              │
│  [Overview] [Team] [AI Insights]       │
│                                        │
│  OVERVIEW:                             │
│  - Total Revenue vs Target             │
│  - Regional breakdown                  │
│  - Monthly trends                      │
│  - Top performers                      │
│                                        │
│  AI INSIGHTS:                          │
│  - Performance analysis                │
│  - Coaching recommendations            │
│  - Risk identification                 │
│  - Growth opportunities                │
└────────────────────────────────────────┘
    ↓ Click Regional Manager
    
LEVEL 2: Regional Manager
    ↓ Click
┌────────────────────────────────────────┐
│  REGIONAL MANAGER DETAIL               │
├────────────────────────────────────────┤
│  📑 Tabs:                              │
│  [Overview] [Areas] [Performance]      │
│                                        │
│  - Revenue by area                     │
│  - Team performance                    │
│  - Pipeline analysis                   │
│  - Period filter controls              │
│                                        │
│  📊 Charts:                            │
│  - Revenue breakdown                   │
│  - Target achievement                  │
│  - Month-over-month growth             │
└────────────────────────────────────────┘
    ↓ Click Area Manager
    
LEVEL 3: Area Manager
    ↓ Click
┌────────────────────────────────────────┐
│  AREA MANAGER DETAIL                   │
├────────────────────────────────────────┤
│  📑 Tabs:                              │
│  [Overview] [Team] [Notes]             │
│                                        │
│  - Team member performance             │
│  - Territory coverage                  │
│  - Customer distribution               │
│  - Activity metrics                    │
│                                        │
│  📝 Notes Section:                     │
│  - Add coaching notes                  │
│  - Performance feedback                │
│  - Action items                        │
└────────────────────────────────────────┘
    ↓ Click Sales Executive
    
LEVEL 4: Sales Executive
    ↓ Click
┌────────────────────────────────────────┐
│  SALES EXECUTIVE DETAIL                │
├────────────────────────────────────────┤
│  📑 Tabs:                              │
│  [Performance] [Pipeline] [Activity]   │
│                                        │
│  PERFORMANCE:                          │
│  - Revenue vs Target                   │
│  - Deals closed                        │
│  - Win rate                            │
│  - Average deal size                   │
│                                        │
│  PIPELINE:                             │
│  - Current opportunities               │
│  - Stage distribution                  │
│  - Forecast                            │
│                                        │
│  ACTIVITY:                             │
│  - Recent activities                   │
│  - Upcoming tasks                      │
│  - Client interactions                 │
│                                        │
│  📝 Manager Notes:                     │
│  - Performance notes                   │
│  - Coaching feedback                   │
│  - Development plans                   │
└────────────────────────────────────────┘
```

### **Export Report Flow:**

```
User clicks "📥 Export Report"
    ↓
┌────────────────────────────────────────┐
│    EXPORT REPORT DIALOG                │
├────────────────────────────────────────┤
│  1. Report Type:                       │
│     ○ Executive Summary                │
│     ○ Detailed Sales Report            │
│     ○ Team Performance Report          │
│     ○ Pipeline Analysis                │
│     ○ Custom Report                    │
│                                        │
│  2. Date Range:                        │
│     From: [Jan 1, 2026]                │
│     To:   [Dec 31, 2026]               │
│                                        │
│  3. Include:                           │
│     ☑ Charts and graphs                │
│     ☑ Team hierarchy                   │
│     ☑ Individual performance           │
│     ☑ AI insights                      │
│     ☐ Detailed transaction log         │
│                                        │
│  4. Format:                            │
│     ○ PDF                              │
│     ○ Excel (XLSX)                     │
│     ○ CSV                              │
│     ○ PowerPoint (PPTX)                │
│                                        │
│  [Cancel] [Generate Report]            │
└────────────────────────────────────────┘
    ↓
Generate report in background
    ↓
Show progress indicator
    ↓
[Complete]
    ├─→ Download automatically
    ├─→ Show success toast
    └─→ Option to email report
```

---

## 🤖 **AI ASSISTANT WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                   AI ASSISTANT                              │
│                 (Always Available)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎤 Input Methods:                                          │
│  ┌────────────────────────────────────────────────┐        │
│  │ [🎙️ Voice] [⌨️ Text] [📷 Image]                │        │
│  │                                                 │        │
│  │ Type your question or click voice...           │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  💬 Conversation:                                           │
│  ┌────────────────────────────────────────────────┐        │
│  │ 👤 User: What's my revenue this month?         │        │
│  │                                                 │        │
│  │ 🤖 AI: Your revenue this month is Rp 450M,     │        │
│  │    which is 90% of your Rp 500M target.        │        │
│  │    You're on track! Here's the breakdown:      │        │
│  │    • Hospital segment: Rp 300M (67%)           │        │
│  │    • Retail segment: Rp 100M (22%)             │        │
│  │    • Intradoc segment: Rp 50M (11%)            │        │
│  │                                                 │        │
│  │    [View Detailed Report] [Export]             │        │
│  │                                                 │        │
│  │ 👤 User: What are my top opportunities?        │        │
│  │                                                 │        │
│  │ 🤖 AI: Your top 3 opportunities are:           │        │
│  │    1. Hospital ABC - Rp 500M (Negotiation)     │        │
│  │       • 75% win probability                    │        │
│  │       • Action: Follow up on pricing           │        │
│  │                                                 │        │
│  │    2. Clinic XYZ - Rp 300M (Proposal)          │        │
│  │       • 60% win probability                    │        │
│  │       • Action: Schedule demo                  │        │
│  │                                                 │        │
│  │    3. Hospital DEF - Rp 450M (Qualified)       │        │
│  │       • 50% win probability                    │        │
│  │       • Action: Send proposal                  │        │
│  │                                                 │        │
│  │    [View All Opportunities]                    │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  🎯 Quick Actions:                                          │
│  [Show My KPIs] [Find Deals] [Generate Report]             │
│  [Schedule Meeting] [Create Opportunity]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **AI Capabilities:**

```
1. INSIGHTS & ANALYTICS
   ├─ Performance analysis
   ├─ Trend identification
   ├─ Anomaly detection
   └─ Predictive forecasting

2. RECOMMENDATIONS
   ├─ Next best actions
   ├─ Deal prioritization
   ├─ Resource allocation
   └─ Coaching suggestions

3. AUTOMATION
   ├─ Report generation
   ├─ Data entry
   ├─ Follow-up reminders
   └─ Task creation

4. CONVERSATIONAL QUERIES
   ├─ Natural language understanding
   ├─ Context-aware responses
   ├─ Multi-turn conversations
   └─ Clarification questions

5. DOCUMENT PROCESSING
   ├─ Contract analysis
   ├─ Email parsing
   ├─ Data extraction
   └─ Document generation
```

### **AI Integration Points:**

```
AI is integrated across all modules:

Lead Management
├─ Lead scoring
├─ Source effectiveness analysis
└─ Conversion prediction

Opportunity Management
├─ Win probability calculation
├─ Deal risk assessment
├─ Competitive intelligence
└─ Pricing optimization

Sales Team
├─ Performance coaching
├─ Skill gap identification
├─ Territory optimization
└─ Quota setting

Demo Scheduler
├─ Best time recommendations
├─ Success prediction
└─ Follow-up suggestions

Contracts
├─ Renewal prediction
├─ Upsell identification
└─ Churn risk detection

Reports
├─ Automated insights
├─ Trend analysis
└─ Forecast generation
```

---

## ⚙️ **ADMIN SYSTEM WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN SYSTEM                             │
│               (Admin Users Only)                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📑 Admin Sections:                                         │
│  ┌────────────────────────────────────────────────┐        │
│  │  1. 👥 User Management                         │        │
│  │     - Add/Edit/Delete users                    │        │
│  │     - Assign roles & permissions               │        │
│  │     - Reset passwords                          │        │
│  │                                                 │        │
│  │  2. 🏢 Organization Settings                   │        │
│  │     - Company information                      │        │
│  │     - Branding (logo, colors)                  │        │
│  │     - Business units                           │        │
│  │                                                 │        │
│  │  3. 📊 Data Management                         │        │
│  │     - Import/Export data                       │        │
│  │     - Data cleanup                             │        │
│  │     - Backup & restore                         │        │
│  │                                                 │        │
│  │  4. ⚙️ System Configuration                    │        │
│  │     - Sales stages                             │        │
│  │     - Lead sources                             │        │
│  │     - Product categories                       │        │
│  │     - Custom fields                            │        │
│  │                                                 │        │
│  │  5. 🔔 Notifications                           │        │
│  │     - Email templates                          │        │
│  │     - Notification rules                       │        │
│  │     - Alert thresholds                         │        │
│  │                                                 │        │
│  │  6. 🔐 Security & Audit                        │        │
│  │     - Activity logs                            │        │
│  │     - Login history                            │        │
│  │     - Permission audit                         │        │        │  │                                                 │        │
│  │  7. 📈 System Analytics                        │        │
│  │     - Usage statistics                         │        │
│  │     - Performance metrics                      │        │
│  │     - Database health                          │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **User Management Flow:**

```
Admin navigates to User Management
    ↓
┌────────────────────────────────────────┐
│    USER MANAGEMENT                     │
├────────────────────────────────────────┤
│  Active Users: 45                      │
│  Inactive: 5                           │
│  Total: 50                             │
│                                        │
│  [+ Add User] [📤 Export] [🔍 Search] │
│                                        │
│  Users Table:                          │
│  ┌───┬────────┬────────┬──────┬─────┐ │
│  │ # │ Name   │ Role   │Status│ ... │ │
│  ├───┼────────┼────────┼──────┼─────┤ │
│  │ 1 │ John D │ Admin  │Active│[...]│ │
│  │ 2 │ Jane S │ Manager│Active│[...]│ │
│  │ 3 │ Bob W  │ Sales  │Active│[...]│ │
│  └───┴────────┴────────┴──────┴─────┘ │
└────────────────────────────────────────┘
    ↓
Click "+ Add User"
    ↓
┌────────────────────────────────────────┐
│    ADD NEW USER                        │
├────────────────────────────────────────┤
│  1. User Information:                  │
│     - Full Name *                      │
│     - Email *                          │
│     - Phone                            │
│                                        │
│  2. Role & Permissions:                │
│     - Role *                           │
│       ○ Admin (Full access)            │
│       ○ Sales Manager                  │
│       ○ Sales Representative           │
│       ○ Read-Only                      │
│                                        │
│     Custom Permissions:                │
│     ☑ View leads                       │
│     ☑ Create leads                     │
│     ☑ Edit leads                       │
│     ☐ Delete leads                     │
│     ☑ View opportunities               │
│     ☑ Create opportunities             │
│     ...                                │
│                                        │
│  3. Access Settings:                   │
│     - Start Date                       │
│     - Expiry Date (optional)           │
│     - IP Restrictions (optional)       │
│                                        │
│  [Cancel] [Send Invitation]            │
└────────────────────────────────────────┘
    ↓
Create user account
    ↓
Generate temporary password
    ↓
Send invitation email
    ↓
User receives email with:
    ├─ Login credentials
    ├─ Temporary password
    ├─ Password reset link
    └─ Getting started guide
    ↓
User logs in first time
    ↓
Force password change
    ↓
Show onboarding tour
    ↓
User ready to work
```

---

## 🔄 **DATA FLOW ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA FLOW OVERVIEW                        │
└─────────────────────────────────────────────────────────────┘

FRONTEND (React)
│
├─ User Interactions
│  └─ Events & Actions
│
├─ State Management (React Context)
│  ├─ AuthContext (user session)
│  ├─ AppContext (global state)
│  └─ Local State (component state)
│
├─ API Layer (utils/api)
│  ├─ leadsApi
│  ├─ opportunitiesApi
│  ├─ contractsApi
│  ├─ salesTeamApi
│  └─ reportsApi
│
└─ HTTP Requests
    ↓
    
BACKEND (Supabase)
│
├─ Edge Functions (Hono Server)
│  ├─ Authentication
│  ├─ Authorization
│  ├─ Business Logic
│  └─ Data Validation
│
├─ Database (PostgreSQL)
│  ├─ kv_store_67367fc1 (key-value)
│  ├─ User data
│  ├─ Transactional data
│  └─ Analytical data
│
├─ Storage (Supabase Storage)
│  ├─ Documents
│  ├─ Images
│  └─ Attachments
│
└─ Auth (Supabase Auth)
   ├─ Email/Password
   └─ OAuth providers

EXTERNAL INTEGRATIONS
│
├─ AI Services
│  ├─ OpenAI (insights)
│  ├─ NLP processing
│  └─ Predictive analytics
│
└─ Other Services
   ├─ Email (notifications)
   ├─ Calendar (scheduling)
   └─ Analytics (tracking)
```

### **Typical Data Flow Example:**

```
EXAMPLE: Creating a New Lead

1. USER ACTION
   User fills form → Clicks "Save Lead"
   
2. FRONTEND VALIDATION
   ├─ Check required fields
   ├─ Validate email format
   ├─ Validate phone number
   └─ Check data types
   
3. API CALL
   leadsApi.create(leadData)
   ├─ Prepare payload
   ├─ Add authentication token
   └─ Send POST request
   
4. BACKEND PROCESSING
   Edge Function receives request
   ├─ Verify authentication
   ├─ Check permissions
   ├─ Validate business rules
   ├─ Sanitize input
   └─ Process data
   
5. DATABASE OPERATION
   ├─ Generate unique ID
   ├─ Add timestamps
   ├─ Insert to database
   └─ Return result
   
6. RESPONSE FLOW
   Backend → Frontend
   ├─ Success response
   └─ Lead data with ID
   
7. STATE UPDATE
   ├─ Update local state
   ├─ Add lead to list
   ├─ Update KPI counts
   └─ Clear form
   
8. UI UPDATE
   ├─ Show success toast
   ├─ Refresh leads table
   ├─ Update dashboard KPIs
   └─ Close dialog
   
9. SIDE EFFECTS
   ├─ Send notification to assigned user
   ├─ Log activity
   ├─ Trigger AI analysis (background)
   └─ Update analytics
```

---

## 📱 **MOBILE/PWA WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                    PWA INSTALLATION                         │
└─────────────────────────────────────────────────────────────┘

User visits app on mobile browser
    ↓
Service Worker registers
    ↓
"Install App" prompt appears
    ↓
User clicks "Install"
    ↓
App installed to home screen
    ↓
App icon appears on device
    ↓
User opens app from home screen
    ↓
Full-screen experience (no browser chrome)
    ↓
Offline capability enabled
    ↓
Push notifications enabled (if granted)
```

### **Offline Functionality:**

```
ONLINE MODE
├─ Full functionality
├─ Real-time sync
└─ Instant updates

OFFLINE MODE
├─ Read cached data
├─ View recent records
├─ Create/edit locally
├─ Queue sync operations
└─ Show offline indicator

BACK ONLINE
├─ Auto-detect connection
├─ Sync queued operations
├─ Update cached data
├─ Show sync status
└─ Resume normal operation
```

---

## 🔔 **NOTIFICATION WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                  NOTIFICATION SYSTEM                        │
└─────────────────────────────────────────────────────────────┘

TRIGGER EVENTS
│
├─ Lead Activities
│  ├─ New lead assigned
│  ├─ Lead status changed
│  ├─ Follow-up due
│  └─ Lead converted
│
├─ Opportunity Updates
│  ├─ New opportunity created
│  ├─ Stage changed
│  ├─ Deal won/lost
│  └─ High-value deal alert
│
├─ Demo Reminders
│  ├─ 1 day before demo
│  ├─ 1 hour before demo
│  ├─ Demo completed (feedback needed)
│  └─ Demo rescheduled
│
├─ Contract Alerts
│  ├─ Contract expiring (60 days)
│  ├─ Contract expiring (30 days)
│  ├─ Renewal due
│  └─ Payment due
│
├─ Performance Alerts
│  ├─ Target at risk
│  ├─ Behind schedule
│  ├─ Goal achieved
│  └─ Top performer
│
└─ System Notifications
   ├─ System maintenance
   ├─ New feature available
   └─ Important announcement

NOTIFICATION CHANNELS
│
├─ In-App (🔔 Bell icon)
│  └─ Real-time, always visible
│
├─ Push Notifications
│  └─ Browser/mobile alerts
│
├─ Email
│  └─ Digest or immediate
│
└─ SMS (Optional)
   └─ Critical alerts only
```

---

Saya akan lanjutkan dengan file kedua untuk workflow yang lebih detail!

<function_calls>
<invoke name="write_tool">
<parameter name="file_text"># 📊 SALES MONITORING - DETAILED FEATURE WORKFLOWS

## 🎯 **TABLE OF CONTENTS**

1. [CRM Tab Menu Workflow](#crm-tab-menu-workflow)
2. [Advanced Analytics Workflow](#advanced-analytics-workflow)
3. [Performance Hub Workflow](#performance-hub-workflow)
4. [AI Features Deep Dive](#ai-features-deep-dive)
5. [Integration Workflows](#integration-workflows)
6. [Error Handling & Recovery](#error-handling--recovery)
7. [Security & Authentication](#security--authentication)
8. [Performance Optimization](#performance-optimization)

---

## 💼 **CRM TAB MENU WORKFLOW**

### **Three-Tab Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│               CRM - OPPORTUNITY MANAGEMENT                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📑 TABS:                                                   │
│  ┌──────────────────┬────────────┬──────────────┐         │
│  │ All Opportunities│  Clients   │   Partners   │         │
│  │     (Active)     │            │              │         │
│  └──────────────────┴────────────┴──────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **TAB 1: All Opportunities**

```
┌────────────────────────────────────────────────────────────┐
│  ALL OPPORTUNITIES TAB                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🎯 Pipeline View (Kanban):                                │
│  ┌──────────┬──────────┬──────────┬──────────┬────────┐  │
│  │   New    │Qualified │ Proposal │Negotiation│  Won   │  │
│  ├──────────┼──────────┼──────────┼──────────┼────────┤  │
│  │          │          │          │          │        │  │
│  │  ┌────┐  │  ┌────┐  │  ┌────┐  │  ┌────┐  │ ┌────┐ │  │
│  │  │Opp │  │  │Opp │  │  │Opp │  │  │Opp │  │ │Opp │ │  │
│  │  │ A  │  │  │ C  │  │  │ E  │  │  │ G  │  │ │ I  │ │  │
│  │  └────┘  │  └────┘  │  └────┘  │  └────┘  │ └────┘ │  │
│  │          │          │          │          │        │  │
│  │  Drag &  │  Drag &  │  Drag &  │  Drag &  │ Drag & │  │
│  │   Drop   │   Drop   │   Drop   │   Drop   │  Drop  │  │
│  │          │          │          │          │        │  │
│  └──────────┴──────────┴──────────┴──────────┴────────┘  │
│                                                            │
│  Actions:                                                  │
│  - Drag card between stages                                │
│  - Click card for details                                  │
│  - Filter by value, owner, date                            │
│  - Sort by priority, value, close date                     │
│                                                            │
│  [+ New Opportunity]  [🔍 Search]  [🎯 Filters]           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **TAB 2: Clients**

```
┌────────────────────────────────────────────────────────────┐
│  CLIENTS TAB                                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔍 Search & Filters:                                      │
│  ┌────────────────────────────────────────────────────┐   │
│  │ [🔍 Search clients...] [Type ▾] [Status ▾] [Sort]  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  👥 Client Cards (Grid View):                              │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ 🏢 Hospital ABC  │  │ 🏢 Clinic XYZ    │              │
│  ├──────────────────┤  ├──────────────────┤              │
│  │ Type: Hospital   │  │ Type: Clinic     │              │
│  │ Status: Active   │  │ Status: Active   │              │
│  │ Revenue: Rp 2B   │  │ Revenue: Rp 500M │              │
│  │ Deals: 5 active  │  │ Deals: 2 active  │              │
│  │                  │  │                  │              │
│  │ [View Details]   │  │ [View Details]   │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                            │
│  Client Actions:                                           │
│  - View full profile                                       │
│  - See all opportunities                                   │
│  - View contract history                                   │
│  - Add communication log                                   │
│  - Schedule meeting                                        │
│                                                            │
│  [+ Add Client]  [📤 Export]  [📊 Analytics]              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### **Client Detail Dialog:**

```
Click "View Details" on client card
    ↓
┌────────────────────────────────────────────────────────────┐
│         CLIENT DETAIL DIALOG                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📑 Tabs:                                                  │
│  [Overview] [Opportunities] [Contracts] [Communications]   │
│                                                            │
│  OVERVIEW TAB:                                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🏢 Hospital ABC                                   │    │
│  │ ID: HSP-2026-001                                  │    │
│  │                                                   │    │
│  │ 📍 Address:                                       │    │
│  │    Jl. Sudirman No. 123, Jakarta                  │    │
│  │                                                   │    │
│  │ 📞 Contact:                                       │    │
│  │    Phone: +62 21 1234 5678                        │    │
│  │    Email: info@hospitalabc.com                    │    │
│  │    Website: www.hospitalabc.com                   │    │
│  │                                                   │    │
│  │ 👤 Decision Makers:                               │    │
│  │    • Dr. John Doe (Director)                      │    │
│  │    • Jane Smith (IT Manager)                      │    │
│  │    • Bob Wilson (CFO)                             │    │
│  │                                                   │    │
│  │ 💰 Business Metrics:                              │    │
│  │    • Total Revenue: Rp 2,000,000,000              │    │
│  │    • Active Contracts: 3                          │    │
│  │    • Lifetime Value: Rp 5,000,000,000             │    │
│  │    • Customer Since: Jan 2024                     │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  OPPORTUNITIES TAB:                                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Active Opportunities (5):                         │    │
│  │                                                   │    │
│  │ 1. HMS Upgrade - Rp 500M (Negotiation)           │    │
│  │    Expected Close: Dec 2026                       │    │
│  │    [View] [Edit]                                  │    │
│  │                                                   │    │
│  │ 2. Training Module - Rp 100M (Proposal)           │    │
│  │    Expected Close: Jan 2027                       │    │
│  │    [View] [Edit]                                  │    │
│  │                                                   │    │
│  │ Won Opportunities (12): [View All]                │    │
│  │ Lost Opportunities (3): [View All]                │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  CONTRACTS TAB:                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Active Contracts (3):                             │    │
│  │                                                   │    │
│  │ 1. HMS License - Rp 800M/year                     │    │
│  │    Start: Jan 2024 | End: Dec 2026               │    │
│  │    Renewal: ⚠️ Due in 60 days                    │    │
│  │    [Renew] [View Details]                         │    │
│  │                                                   │    │
│  │ 2. Support & Maintenance - Rp 200M/year          │    │
│  │    Start: Jan 2024 | End: Dec 2027               │    │
│  │    Status: ✅ Active                              │    │
│  │    [View Details]                                 │    │
│  │                                                   │    │
│  │ Expired Contracts (5): [View All]                 │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  COMMUNICATIONS TAB: (NEW FEATURE)                         │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Communication History:                            │    │
│  │                                                   │    │
│  │ 📝 Dec 1, 2026 - Meeting                         │    │
│  │    Discussed renewal terms. Positive response.   │    │
│  │    Next: Send updated proposal                    │    │
│  │    By: John Sales                                 │    │
│  │                                                   │    │
│  │ 📞 Nov 28, 2026 - Phone Call                     │    │
│  │    Follow-up on demo. Client interested.         │    │
│  │    By: Jane Account Manager                       │    │
│  │                                                   │    │
│  │ ✉️ Nov 25, 2026 - Email                          │    │
│  │    Sent product brochure and pricing.            │    │
│  │    By: John Sales                                 │    │
│  │                                                   │    │
│  │ [+ Add Communication]  [Filter]  [Export]         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  [Edit Client] [Schedule Meeting] [Create Opportunity]     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### **Add Communication Feature:**

```
User clicks "+ Add Communication" in Clients tab
    ↓
┌────────────────────────────────────────┐
│    ADD COMMUNICATION                   │
├────────────────────────────────────────┤
│  Client: Hospital ABC (auto-filled)   │
│                                        │
│  Communication Type: *                 │
│  ○ Meeting (In-person)                 │
│  ○ Meeting (Virtual)                   │
│  ○ Phone Call                          │
│  ○ Email                               │
│  ○ WhatsApp/Chat                       │
│  ○ Other                               │
│                                        │
│  Date & Time: *                        │
│  [Dec 1, 2026] [14:00]                 │
│                                        │
│  Participants: *                       │
│  ☑ Dr. John Doe (Client - Director)   │
│  ☑ Jane Smith (Client - IT Manager)   │
│  ☑ John Sales (Our Team)              │
│  [+ Add Participant]                   │
│                                        │
│  Subject/Topic: *                      │
│  [Contract Renewal Discussion]         │
│                                        │
│  Notes: *                              │
│  ┌────────────────────────────────┐   │
│  │ • Discussed renewal terms      │   │
│  │ • Client positive about cont.  │   │
│  │ • Requested 5% discount        │   │
│  │ • Need to send updated proposal│   │
│  │                                │   │
│  └────────────────────────────────┘   │
│                                        │
│  Outcome:                              │
│  ○ Positive                            │
│  ○ Neutral                             │
│  ○ Needs Follow-up                     │
│  ○ Negative                            │
│                                        │
│  Next Steps:                           │
│  ┌────────────────────────────────┐   │
│  │ Send updated proposal by Dec 5 │   │
│  └────────────────────────────────┘   │
│                                        │
│  Attachments:                          │
│  [📎 Upload Files]                     │
│                                        │
│  □ Create follow-up task               │
│  □ Send summary email to participants  │
│                                        │
│  [Cancel] [Save Communication]         │
└────────────────────────────────────────┘
    ↓
Save to database
    ↓
[Success]
    ├─→ Add to communication timeline
    ├─→ Link to client record
    ├─→ Create follow-up task (if checked)
    ├─→ Send email summary (if checked)
    ├─→ Update client last contact date
    └─→ Trigger AI analysis (identify patterns)
```

### **TAB 3: Partners**

```
┌────────────────────────────────────────────────────────────┐
│  PARTNERS TAB                                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🔍 Search & Filters:                                      │
│  ┌────────────────────────────────────────────────────┐   │
│  │ [🔍 Search partners...] [Type ▾] [Region ▾]        │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  🤝 Partner Cards (Grid View):                             │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ 🏢 Distributor A │  │ 🏢 Reseller B    │              │
│  ├──────────────────┤  ├──────────────────┤              │
│  │ Type: Distributor│  │ Type: Reseller   │              │
│  │ Region: Java     │  │ Region: Sumatra  │              │
│  │ Deals: 25        │  │ Deals: 12        │              │
│  │ Revenue: Rp 5B   │  │ Revenue: Rp 2B   │              │
│  │                  │  │                  │              │
│  │ [View Details]   │  │ [View Details]   │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                            │
│  Partner Actions:                                          │
│  - View partner profile                                    │
│  - See referral history                                    │
│  - View commission reports                                 │
│  - Manage partner agreements                               │
│  - Track partner performance                               │
│                                                            │
│  [+ Add Partner]  [📤 Export]  [📊 Analytics]             │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 **ADVANCED ANALYTICS WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│              ADVANCED ANALYTICS DASHBOARD                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎯 Analysis Categories:                                    │
│  ┌────────────┬────────────┬────────────┬────────────┐    │
│  │  Revenue   │  Pipeline  │   Team     │  Forecast  │    │
│  │  Analysis  │  Analysis  │  Analysis  │  Analysis  │    │
│  └────────────┴────────────┴────────────┴────────────┘    │
│                                                             │
│  REVENUE ANALYSIS:                                          │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 📈 Revenue Trends                                │     │
│  │ ┌──────────────────────────────────────────┐     │     │
│  │ │         Line Chart                       │     │     │
│  │ │   ╭─────────╮                            │     │     │
│  │ │  ╭╯         ╰╮      ╭─╮                  │     │     │
│  │ │ ╭╯            ╰─────╯ ╰╮                 │     │     │
│  │ │─┴──────────────────────┴─────────────    │     │     │
│  │ │ Jan Feb Mar Apr May Jun Jul Aug Sep Oct  │     │     │
│  │ └──────────────────────────────────────────┘     │     │
│  │                                              │     │     │
│  │ Key Insights:                                │     │     │
│  │ • Revenue growth: +15% YoY                   │     │     │
│  │ • Best month: March (Rp 2.5B)                │     │     │
│  │ • Trend: Upward with seasonal peaks          │     │     │
│  └──────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 🎯 Revenue by Segment                            │     │
│  │ ┌──────────────────────────────────────────┐     │     │
│  │ │         Donut Chart                      │     │     │
│  │ │                                          │     │     │
│  │ │          ┌────┐                          │     │     │
│  │ │      ┌───┤ 67%├──┐   Hospital           │     │     │
│  │ │      │   └────┘  │   Retail             │     │     │
│  │ │      │    ███    │   Intradoc           │     │     │
│  │ │      └───────────┘                       │     │     │
│  │ │         22%  11%                         │     │     │
│  │ └──────────────────────────────────────────┘     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  PIPELINE ANALYSIS:                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Pipeline Health Score: 85/100 ✅                 │     │
│  │                                                   │     │
│  │ Metrics:                                          │     │
│  │ • Total Value: Rp 8.5B                           │     │
│  │ • Weighted Value: Rp 4.2B (based on probability) │     │
│  │ • Avg Deal Size: Rp 350M                         │     │
│  │ • Avg Sales Cycle: 45 days                       │     │
│  │ • Win Rate: 65%                                  │     │
│  │                                                   │     │
│  │ Stage Distribution:                               │     │
│  │ ▓▓▓▓▓░░░░░ New (12 deals - $1.2B)               │     │
│  │ ▓▓▓▓▓▓░░░░ Qualified (15 - $2.1B)              │     │
│  │ ▓▓▓▓▓▓▓▓░░ Proposal (20 - $3.5B)               │     │
│  │ ▓▓▓▓░░░░░░ Negotiation (8 - $1.7B)             │     │
│  │                                                   │     │
│  │ 🚨 Alerts:                                        │     │
│  │ • 5 deals stuck in Proposal (>30 days)           │     │
│  │ • 3 high-value deals need attention              │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  TEAM PERFORMANCE:                                          │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Top Performers (This Month):                      │     │
│  │                                                   │     │
│  │ 🥇 1. John Sales      - Rp 800M (160% of target) │     │
│  │ 🥈 2. Jane Account    - Rp 750M (150% of target) │     │
│  │ 🥉 3. Bob Executive   - Rp 600M (120% of target) │     │
│  │                                                   │     │
│  │ Team Distribution:                                │     │
│  │ • Above Target: 15 members (60%)                 │     │
│  │ • On Target: 7 members (28%)                     │     │
│  │ • Below Target: 3 members (12%) ⚠️              │     │
│  │                                                   │     │
│  │ Activity Metrics:                                 │     │
│  │ • Avg Calls/Day: 25                              │     │
│  │ • Avg Meetings/Week: 12                          │     │
│  │ • Avg Response Time: 2.5 hours                   │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  FORECAST ANALYSIS:                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 🔮 90-Day Forecast                                │     │
│  │                                                   │     │
│  │ Projected Revenue: Rp 3.2B                        │     │
│  │ Confidence: 85%                                   │     │
│  │                                                   │     │
│  │ Breakdown:                                        │     │
│  │ • Committed: Rp 1.8B (deals >75% probability)    │     │
│  │ • Best Case: Rp 2.1B (deals >50% probability)    │     │
│  │ • Upside: Rp 3.2B (all deals)                    │     │
│  │                                                   │     │
│  │ Risk Factors:                                     │     │
│  │ ⚠️ 3 large deals at risk (worth Rp 800M)        │     │
│  │ ⚠️ Q4 historically slower (avg -15%)             │     │
│  │ ✅ Strong pipeline coverage (2.5x target)        │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  [📊 Custom Report] [📤 Export] [🔄 Refresh Data]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏆 **PERFORMANCE HUB WORKFLOW**

### **Sales Leaderboard:**

```
┌─────────────────────────────────────────────────────────────┐
│                  SALES LEADERBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏆 Period: [This Month ▾]  [This Quarter]  [This Year]    │
│  📊 Metric: [Revenue ▾]  [Deals]  [Conversion]  [Activity] │
│                                                             │
│  🥇 TOP PERFORMERS:                                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Rank │ Name           │ Revenue  │ Target │ %    │     │
│  ├──────┼────────────────┼──────────┼────────┼──────┤     │
│  │  🥇  │ John Sales     │ Rp 800M  │ 500M   │ 160% │     │
│  │  🥈  │ Jane Account   │ Rp 750M  │ 500M   │ 150% │     │
│  │  🥉  │ Bob Executive  │ Rp 600M  │ 500M   │ 120% │     │
│  │  4   │ Alice Manager  │ Rp 550M  │ 500M   │ 110% │     │
│  │  5   │ Tom Sales      │ Rp 525M  │ 500M   │ 105% │     │
│  │  6   │ Sarah Rep      │ Rp 500M  │ 500M   │ 100% │     │
│  │  7   │ Mike Exec      │ Rp 480M  │ 500M   │  96% │     │
│  │  8   │ Lisa Sales     │ Rp 450M  │ 500M   │  90% │     │
│  │  ... │ ...            │ ...      │ ...    │ ...  │     │
│  └──────┴────────────────┴──────────┴────────┴──────┘     │
│                                                             │
│  🎯 ACHIEVEMENTS:                                           │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Recent Achievements:                              │     │
│  │                                                   │     │
│  │ 🏆 John Sales                                     │     │
│  │    "Top Performer - December"                     │     │
│  │    Earned: Dec 1, 2026                            │     │
│  │                                                   │     │
│  │ ⭐ Jane Account                                   │     │
│  │    "Million Dollar Club"                          │     │
│  │    Earned: Nov 28, 2026                           │     │
│  │                                                   │     │
│  │ 🎯 Bob Executive                                  │     │
│  │    "Consistent Performer - Q4"                    │     │
│  │    Earned: Oct 15, 2026                           │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  📊 TEAM STATISTICS:                                        │
│  ┌──────────────────────────────────────────────────┐     │
│  │ • Total Team Revenue: Rp 12.5B                    │     │
│  │ • Team Target: Rp 10B                             │     │
│  │ • Achievement: 125% ✅                             │     │
│  │ • Avg per Rep: Rp 500M                            │     │
│  │ • Top Region: Jakarta (Rp 5B)                     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  [View My Rank] [Team Comparison] [Historical Data]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **KPI Dashboard:**

```
┌─────────────────────────────────────────────────────────────┐
│                   KPI DASHBOARD                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 User View:                                              │
│  [My KPIs ●] [Team KPIs] [Company KPIs]                     │
│                                                             │
│  MY KEY PERFORMANCE INDICATORS:                             │
│                                                             │
│  💰 REVENUE METRICS:                                        │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Monthly Revenue                                   │     │
│  │ Rp 450M / Rp 500M (90%)                          │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░                            │     │
│  │ Status: On Track ✅  |  Short: Rp 50M            │     │
│  │                                                   │     │
│  │ Quarterly Revenue                                 │     │
│  │ Rp 1.3B / Rp 1.5B (87%)                          │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░                            │     │
│  │ Status: Needs Attention ⚠️  |  Short: Rp 200M   │     │
│  │                                                   │     │
│  │ Annual Revenue                                    │     │
│  │ Rp 5.2B / Rp 6B (87%)                            │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░                            │     │
│  │ Projection: Rp 5.8B (97% of target)              │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  🎯 ACTIVITY METRICS:                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Leads Generated                                   │     │
│  │ 85 / 100 (85%)                                   │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░                            │     │
│  │ Trend: ↗️ +12% vs last month                     │     │
│  │                                                   │     │
│  │ Opportunities Created                             │     │
│  │ 15 / 20 (75%)                                    │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░                            │     │
│  │ Avg Value: Rp 350M                               │     │
│  │                                                   │     │
│  │ Deals Closed                                      │     │
│  │ 12 / 15 (80%)                                    │     │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░                            │     │
│  │ Win Rate: 65%                                    │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  📊 EFFICIENCY METRICS:                                     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Avg Sales Cycle: 42 days (Target: 45)    ✅     │     │
│  │ Response Time: 2.1 hours (Target: 4)     ✅     │     │
│  │ Meeting-to-Deal: 35% (Target: 30%)       ✅     │     │
│  │ Proposal-to-Close: 55% (Target: 50%)     ✅     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  🎯 AI INSIGHTS:                                            │
│  ┌──────────────────────────────────────────────────┐     │
│  │ 💡 You're 90% to monthly target with 10 days left│     │
│  │ 🎯 Focus on closing these 3 deals worth Rp 150M │     │
│  │ ⚠️ 2 large deals are at risk - action needed    │     │
│  │ ✅ Your win rate is above team average (+10%)   │     │
│  │ 📈 Trending up: +15% better than last month     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  [📊 Detailed View] [📈 Trends] [🎯 Set Goals]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 **AI FEATURES DEEP DIVE**

### **1. AI Insights (Tab 1):**

```
┌────────────────────────────────────────────────────────────┐
│  🤖 AI INSIGHTS                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📊 Performance Analysis:                                  │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Current Performance: 110% of target ✅            │    │
│  │                                                   │    │
│  │ Key Strengths:                                    │    │
│  │ • High win rate in hospital segment (75%)        │    │
│  │ • Fast sales cycle (32 days avg)                 │    │
│  │ • Strong client relationships (4.5/5 rating)     │    │
│  │                                                   │    │
│  │ Areas for Improvement:                            │    │
│  │ • Retail segment conversion low (45%)            │    │
│  │ • Follow-up response time could be faster        │    │
│  │ • Proposal customization needs attention          │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  📈 Trend Analysis:                                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ↗️ Revenue growing +15% month-over-month         │    │
│  │ ↗️ Deal velocity improving (+20% faster)         │    │
│  │ ➡️ Win rate steady at 65%                        │    │
│  │ ↘️ Average deal size declining (-5%)             │    │
│  │                                                   │    │
│  │ 💡 Recommendation: Focus on upselling to         │    │
│  │    increase average deal value                    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  🎯 Deal Scoring:                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Your opportunities ranked by likelihood:          │    │
│  │                                                   │    │
│  │ 1. Hospital ABC - 85% win probability 🟢         │    │
│  │    "Budget confirmed, decision maker engaged"     │    │
│  │    Action: Send final proposal by tomorrow        │    │
│  │                                                   │    │
│  │ 2. Clinic XYZ - 70% win probability 🟢           │    │
│  │    "Strong interest, awaiting management approval"│    │
│  │    Action: Follow up with decision maker          │    │
│  │                                                   │    │
│  │ 3. Hospital DEF - 45% win probability 🟡         │    │
│  │    "Price concerns, considering competitors"      │    │
│  │    Action: Schedule value demonstration           │    │
│  │                                                   │    │
│  │ 4. Clinic GHI - 25% win probability 🔴           │    │
│  │    "Budget not confirmed, multiple stakeholders"  │    │
│  │    Action: Qualify budget and timeline            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **2. AI Coaching (Tab 2):**

```
┌────────────────────────────────────────────────────────────┐
│  🎓 AI COACHING                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📚 Personalized Learning Path:                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Based on your performance data, here's what to   │    │
│  │ focus on to reach next level:                     │    │
│  │                                                   │    │
│  │ PRIORITY 1: Improve Retail Segment Performance   │    │
│  │ Current: 45% win rate | Target: 60%              │    │
│  │                                                   │    │
│  │ 📖 Recommended Actions:                           │    │
│  │ □ Review successful retail deals (case studies)  │    │
│  │ □ Schedule shadowing with top retail performer    │    │
│  │ □ Customize pitch for retail decision makers     │    │
│  │ □ Complete "Retail Healthcare Sales" training    │    │
│  │                                                   │    │
│  │ 📊 Expected Impact: +15% win rate increase       │    │
│  │ ⏱️ Time Investment: 5 hours over 2 weeks         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  💡 Skill Development:                                     │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Your Skill Matrix:                                │    │
│  │                                                   │    │
│  │ Prospecting:        ████████░░ 80%              │    │
│  │ Qualification:      █████████░ 90%  ✅          │    │
│  │ Presentation:       ███████░░░ 70%              │    │
│  │ Negotiation:        █████████░ 90%  ✅          │    │
│  │ Closing:            ████████░░ 85%              │    │
│  │ Account Management: █████████░ 95%  ⭐          │    │
│  │                                                   │    │
│  │ 🎯 Next Focus: Presentation Skills               │    │
│  │    [Start Training Module]                        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  🏆 Achievements & Badges:                                 │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Earned:                                           │    │
│  │ ⭐ Fast Closer (32-day avg cycle)                │    │
│  │ 🎯 Consistent Performer (6 months 100%+)         │    │
│  │ 💰 Million Dollar Quarter                        │    │
│  │                                                   │    │
│  │ In Progress:                                      │    │
│  │ 🏆 Elite Performer (2 more months at 120%+)      │    │
│  │ 📈 Growth Champion (need +20% improvement)       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **3. AI Recommendations (Tab 3):**

```
┌────────────────────────────────────────────────────────────┐
│  💡 AI RECOMMENDATIONS                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🎯 Priority Actions (Next 7 Days):                        │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 1. HIGH PRIORITY 🔴                               │    │
│  │    Follow up with Hospital ABC                    │    │
│  │    • Deal Value: Rp 500M                          │    │
│  │    • Win Probability: 85%                         │    │
│  │    • Action: Send final proposal                  │    │
│  │    • Deadline: Tomorrow                           │    │
│  │    • Impact: Critical for monthly target          │    │
│  │    [Mark Complete] [Schedule]                     │    │
│  │                                                   │    │
│  │ 2. MEDIUM PRIORITY 🟡                             │    │
│  │    Reconnect with Clinic XYZ                      │    │
│  │    • Deal Value: Rp 300M                          │    │
│  │    • Last Contact: 10 days ago                    │    │
│  │    • Action: Schedule follow-up call              │    │
│  │    • Reason: Decision maker may be ready          │    │
│  │    [Mark Complete] [Schedule]                     │    │
│  │                                                   │    │
│  │ 3. UPSELL OPPORTUNITY 💰                          │    │
│  │    Existing client: Hospital DEF                  │    │
│  │    • Current Contract: Rp 800M/year               │    │
│  │    • Potential Upsell: Training Module (Rp 200M)  │    │
│  │    • Action: Present training proposal            │    │
│  │    • Win Probability: 70%                         │    │
│  │    [Mark Complete] [Create Opportunity]           │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  🔮 Predictive Insights:                                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Based on historical patterns:                     │    │
│  │                                                   │    │
│  │ • Hospital ABC likely to close within 7 days     │    │
│  │ • Clinic XYZ may need 2 more touchpoints         │    │
│  │ • Deal GHI showing signs of going cold ⚠️       │    │
│  │ • Best time to call Hospital ABC: 2-4 PM         │    │
│  │ • Q4 typically strong for your segment           │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  📊 Market Intelligence:                                   │
│  ┌──────────────────────────────────────────────────┐    │
│  │ • 3 new hospital projects announced in Jakarta   │    │
│  │ • Competitor X losing market share (-8%)         │    │
│  │ • Healthcare IT budget increasing +12% in 2027   │    │
│  │ • Government incentive program for digitalization│    │
│  │                                                   │    │
│  │ [View Detailed Report]                            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **4. AI Conversation (Tab 4):**

```
[Same as AI Assistant section - conversational interface]
```

### **5. AI Scoring (Tab 5):**

```
┌────────────────────────────────────────────────────────────┐
│  📊 AI SCORING                                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  🎯 Overall Performance Score: 87/100 ⭐                   │
│  ████████████████████░                                     │
│                                                            │
│  📊 Score Breakdown:                                       │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Category              Score    Target    Status   │    │
│  ├──────────────────────────────────────────────────┤    │
│  │ Revenue Achievement    92/100    85      ✅ Above │    │
│  │ Activity Level         85/100    80      ✅ Above │    │
│  │ Win Rate              88/100    75      ✅ Above │    │
│  │ Client Satisfaction    90/100    85      ✅ Above │    │
│  │ Pipeline Health        82/100    80      ✅ On    │    │
│  │ Response Time          78/100    80      🟡 Below │    │
│  │ Deal Velocity          89/100    80      ✅ Above │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  🏆 Ranking:                                               │
│  ┌──────────────────────────────────────────────────┐    │
│  │ • Team: 3rd out of 25 (Top 12%)                  │    │
│  │ • Region: 8th out of 80 (Top 10%)                │    │
│  │ • Company: 25th out of 250 (Top 10%)             │    │
│  │ • Percentile: 90th percentile nationally          │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  📈 Score Trends:                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Your Score Over Time:                             │    │
│  │    90│                              ●             │    │
│  │    85│                    ●     ●                 │    │
│  │    80│          ●     ●                           │    │
│  │    75│    ●                                       │    │
│  │    70│●                                           │    │
│  │      └────────────────────────────────           │    │
│  │      Jan Feb Mar Apr May Jun Jul Aug Sep Oct     │    │
│  │                                                   │    │
│  │ Trend: ↗️ Steady improvement (+17 points YTD)    │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  💡 Score Improvement Tips:                                │
│  ┌──────────────────────────────────────────────────┐    │
│  │ To reach 90/100 (Elite level):                   │    │
│  │                                                   │    │
│  │ 1. Improve Response Time (+3 points)             │    │
│  │    • Current: 2.1 hours avg                       │    │
│  │    • Target: <2 hours                             │    │
│  │    • Action: Set up auto-notifications            │    │
│  │                                                   │    │
│  │ 2. Increase Activity Level (+2 points)            │    │
│  │    • Current: 18 calls/day                        │    │
│  │    • Target: 20 calls/day                         │    │
│  │    • Action: Block more prospecting time          │    │
│  │                                                   │    │
│  │ 3. Boost Pipeline Health (+1 point)               │    │
│  │    • Current: 2.1x coverage                       │    │
│  │    • Target: 2.5x coverage                        │    │
│  │    • Action: Create 3 more qualified opps         │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Workflow documentation selesai!** Saya sudah buat comprehensive workflow untuk seluruh aplikasi Sales Monitoring Anda dengan detail visual dan flow yang lengkap! 🎉

Apakah Anda ingin saya:
1. **Export ke format lain** (PDF, PowerPoint, atau visual diagram)?
2. **Tambah workflow untuk fitur spesifik**?
3. **Buat user manual** berdasarkan workflow ini?
4. **Buat training materials** untuk team Anda?

Silakan beritahu saya! 🚀
