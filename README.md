# Sampark

## 🎯 Problem Statement

Urban Local Bodies lack transparent grievance systems. Citizens face difficulty in raising complaints, tracking progress, and ensuring timely resolution with accountability.

## 💡 Solution

A cloud-native platform enabling:   
- 📝 Easy complaint submission with location & media  
- 📊 Real-time tracking with audit logs  
- 🎯 Role-based access for officials  
- 📈 Performance analytics for governance  

## 🧩 Tech Stack

**Frontend**: Next.js 14 (App Router) • Tailwind CSS   
**Backend**: Next.js API Routes • Prisma ORM • JWT Auth  
**Database**: PostgreSQL • Redis (caching & rate limiting)  
**Infrastructure**: Docker • GitHub Actions • AWS/Azure


## 📅 Sprint Shape (20 Working Days)

### Phase 1: Plan & Design (Days 1–5)  
- 📐 High-Level Design (HLD) & Low-Level Design (LLD)  
- 🔧 Repository setup & project board  
- 📝 Convert goals into actionable GitHub issues  
- 🎨 Wireframes & mockups  
- 📊 Database schema design  

### Phase 2: Build & Integrate (Days 6–15)  
- ⚡ Parallel feature development  
- 🔄 PR reviews within 24 hours  
- ✅ CI-driven consistency & quality  
- 🧪 Continuous testing  
- 📦 Integration milestones  

### Phase 3: Refine & Deploy (Days 16–19)  
- 🐛 Debugging & optimization   
- 🧪 Integration & E2E testing  
- ☁️ Cloud deployment   
- 🔒 Security audit  
- 📊 Performance tuning  

### Phase 4: Showcase (Day 20)  
- 🎬 Live demo presentation  
- 👥 Team retrospective  
- 📚 Documentation finalization  


## 👥 Team Structure & Sprint (20 Days)

### MEMBER 1 — Backend, Database & Security Owner  
Responsibilities:  
API design & implementation 
Database schema & migrations   
Authentication, RBAC & security  
API testing

Sprint Contribution:  

Days 1–5
API contracts  
ER diagram & database schema design  

Days 6–15  
Complaint CRUD APIs  
JWT authentication & RBAC  
Prisma models & migrations  
Redis integration (caching & rate limiting)

Days 16–19  
Security hardening  
Unit & integration testing

Day 20  
Backend architecture explanation

### MEMBER 2 — Frontend & UX Owner
Responsibilities
Citizen-facing UI
Admin dashboard UI
App structure & routing
UX, accessibility & responsiveness
Sprint Contribution

Days 1–5
Wireframes & UI flow
Folder structure & routing plan

Days 6–15
Complaint submission UI
Complaint list & status tracking
Toasts, modals, loading & error states

Days 16–19
UI polish & responsiveness
Accessibility & theme refinements

Day 20
Live demo walkthrough (UI flow)

### MEMBER 3 — DevOps, Cloud & CI/CD Owner
Responsibilities
Repository & branching strategy
Dockerization & environment setup
CI/CD pipelines
Cloud deployment & monitoring
Sprint Contribution

Days 1–5
Repository setup & branch protection
PR workflow & CI skeleton
Environment configuration strategy

Days 6–15
Docker & Docker Compose setup
Secrets management
Cloud database & object storage setup

Days 16–19
Deployment to AWS / Azure
Logging & monitoring
Domain & SSL configuration

Day 20
Live deployment demo & infra explanation.


## 🚀 Getting Started

### Prerequisites
Node.js 18+ • Docker • PostgreSQL • Redis • AWS/Azure account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalviumcommunity/S84-0126-The-Minimalists-Full-Stack-With-Nextjs-And-AWS-Azure-Sampark.git
   cd S84-0126-The-Minimalists-Full-Stack-With-Nextjs-And-AWS-Azure-Sampark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/grievance_db"
   REDIS_URL="redis://localhost:6379"
   # Configure DATABASE_URL, REDIS_URL, JWT_SECRET, NEXTAUTH_SECRET
   ```

3. **Start Services & Run**
   ```bash
   docker-compose up -d postgres redis
   npx prisma migrate dev
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)


## 🔧 Code Quality & Configuration

### TypeScript Strict Mode
We've enabled strict TypeScript configuration to catch potential errors early and ensure type safety:

**Enabled Compiler Options:**
- **`strict: true`** - Enables all strict type-checking options
- **`noImplicitAny: true`** - Prevents using `any` type implicitly, forcing explicit type declarations
- **`noUnusedLocals: true`** - Reports errors on unused local variables
- **`noUnusedParameters: true`** - Reports errors on unused function parameters  
- **`forceConsistentCasingInFileNames: true`** - Ensures consistent file name casing across imports

**Why Strict Mode?**
- 🐛 Catches bugs at compile-time instead of runtime
- 📝 Improves code documentation through explicit types
- 🔍 Makes refactoring safer with better IDE support
- 👥 Enhances team collaboration with clear contracts

### ESLint & Prettier Configuration

**ESLint Rules:**
- **`no-console: "warn"`** - Warns about console.log statements (should use proper logging)
- **`semi: "error"`** - Enforces semicolons at end of statements
- **`quotes: "error"`** - Enforces double quotes for consistency

**Prettier Settings:**
- **`singleQuote: false`** - Use double quotes
- **`semi: true`** - Add semicolons
- **`tabWidth: 2`** - 2 spaces for indentation
- **`trailingComma: "es5"`** - Trailing commas where valid in ES5

**Benefits:**
- ✨ Consistent code formatting across the team
- 🚫 Prevents common JavaScript pitfalls
- ⚡ Auto-fixes issues on save
- 🤝 Reduces code review friction

### Pre-Commit Hooks (Husky + lint-staged)

We use Husky and lint-staged to automatically run ESLint and Prettier before every commit:

**What happens on commit:**
1. Git detects staged `.ts`, `.tsx`, `.js`, `.jsx` files
2. Runs `eslint --fix` to auto-fix linting issues
3. Runs `prettier --write` to format code
4. If errors remain, commit is blocked until fixed

**Setup:**
```bash
# Husky hooks location
.husky/pre-commit

# lint-staged configuration in package.json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
}
```

**Why Pre-Commit Hooks?**
- 🛡️ Ensures only quality code reaches the repository
- 🔄 Maintains consistency automatically
- 💪 Builds good habits without manual effort
- 🚀 Speeds up PR reviews

### Testing the Configuration

**Run ESLint manually:**
```bash
cd sampark
npx eslint src/ --ext .ts,.tsx
```

**Format with Prettier:**
```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

**Test pre-commit hook:**
Try committing code with a lint error - it should auto-fix or block until resolved.


