# System Architecture

## Overview

The T&P Cell Management System follows a modern full-stack architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js 14 (App Router)                     │   │
│  │                                                           │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │   │
│  │  │  Student   │  │  Teacher   │  │    HOD     │        │   │
│  │  │ Dashboard  │  │ Dashboard  │  │ Dashboard  │        │   │
│  │  └────────────┘  └────────────┘  └────────────┘        │   │
│  │         │               │                │               │   │
│  │         └───────────────┴────────────────┘               │   │
│  │                         │                                │   │
│  │              ┌──────────▼──────────┐                    │   │
│  │              │   Auth Pages        │                    │   │
│  │              │  (Login with OTP)   │                    │   │
│  │              └──────────┬──────────┘                    │   │
│  │                         │                                │   │
│  └─────────────────────────┼────────────────────────────────┘   │
│                            │                                    │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │              Component Layer                             │   │
│  │                                                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │ ShadCN/  │  │  Theme   │  │  Forms   │  │ Tables  │ │   │
│  │  │    UI    │  │  Toggle  │  │          │  │         │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  └───────────────────────────────────────────────────────────┘   │
│                            │                                    │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │              State Management (Zustand)                  │   │
│  │                                                           │   │
│  │  ┌──────────────┐           ┌──────────────┐            │   │
│  │  │  Auth Store  │           │  Theme Store │            │   │
│  │  └──────────────┘           └──────────────┘            │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ HTTPS/REST API
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                      MIDDLEWARE                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │     Route Protection & Session Management                 │  │
│  │  (Checks authentication and role-based access)            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    SUPABASE BACKEND                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   Authentication                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │  Email OTP   │  │   Session    │  │   User Mgmt     │ │  │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database (with RLS)                  │  │
│  │                                                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ profiles │  │ students │  │ teachers │  │internships│ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  │                                                             │  │
│  │  ┌──────────┐  ┌──────────┐                               │  │
│  │  │   noc_   │  │evaluation│                               │  │
│  │  │applications│ │    s     │                               │  │
│  │  └──────────┘  └──────────┘                               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                Row Level Security (RLS)                    │  │
│  │  • Students can only view/edit their own data             │  │
│  │  • Teachers can view their mentees                        │  │
│  │  • HOD can view all data                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Real-time Subscriptions (Optional)            │  │
│  │  Listen for data changes and update UI automatically      │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Student NOC Application Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌─────────┐
│ Student │─────▶│ Internship│─────▶│   NOC   │─────▶│ Mentor  │
│  Login  │      │  Details  │      │  Apply  │      │ Approval│
└─────────┘      └──────────┘      └─────────┘      └─────────┘
                                                           │
                                                           ▼
                                                    ┌─────────┐
                                                    │   HOD   │
                                                    │Approval │
                                                    └─────────┘
                                                           │
                                                           ▼
                                                    ┌─────────┐
                                                    │  Email  │
                                                    │  Sent   │
                                                    └─────────┘
```

### 2. Evaluation Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌─────────┐
│ Student │      │Internship│      │  Present│      │ Teacher │
│Completes│─────▶│ Completes│─────▶│ Project │─────▶│ Uploads │
│ 16 Weeks│      │          │      │         │      │  Marks  │
└─────────┘      └──────────┘      └─────────┘      └─────────┘
                                                           │
                                                           ▼
                                                    ┌─────────┐
                                                    │ Student │
                                                    │  Views  │
                                                    │  Grade  │
                                                    └─────────┘
```

### 3. Authentication Flow

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌─────────┐
│  User   │      │  Select  │      │  Enter  │      │  Verify │
│ Visits  │─────▶│   Role   │─────▶│  Email  │─────▶│   OTP   │
│  Site   │      │          │      │         │      │         │
└─────────┘      └──────────┘      └─────────┘      └─────────┘
                                                           │
                                                           ▼
                                                    ┌─────────┐
                                                    │Dashboard│
                                                    │  Based  │
                                                    │ on Role │
                                                    └─────────┘
```

## Technology Stack Details

### Frontend Layer
```
┌────────────────────────────────────────┐
│          Next.js 14 (React)            │
├────────────────────────────────────────┤
│  • App Router (file-based routing)     │
│  • Server Components (performance)     │
│  • Client Components (interactivity)   │
│  • API Routes (backend endpoints)      │
│  • Middleware (route protection)       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│           TypeScript                   │
├────────────────────────────────────────┤
│  • Type safety                         │
│  • Better IDE support                  │
│  • Reduced runtime errors              │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│          Tailwind CSS                  │
├────────────────────────────────────────┤
│  • Utility-first CSS                   │
│  • Dark mode support                   │
│  • Responsive design                   │
│  • Custom theme colors                 │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│         ShadCN/UI + Radix UI           │
├────────────────────────────────────────┤
│  • Accessible components               │
│  • Customizable                        │
│  • No runtime dependencies             │
│  • Copy-paste components               │
└────────────────────────────────────────┘
```

### State Management
```
┌────────────────────────────────────────┐
│            Zustand                     │
├────────────────────────────────────────┤
│  • Lightweight (< 1KB)                 │
│  • No providers needed                 │
│  • Simple API                          │
│  • Persistent storage support          │
└────────────────────────────────────────┘
```

### Backend Layer
```
┌────────────────────────────────────────┐
│      Supabase (PostgreSQL)             │
├────────────────────────────────────────┤
│  • Database (PostgreSQL)               │
│  • Authentication (Email OTP)          │
│  • Row Level Security (RLS)            │
│  • Real-time subscriptions             │
│  • Storage (for file uploads)          │
│  • Edge Functions (serverless)         │
└────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Authentication                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Email OTP (no passwords)                          │   │
│  │  • Secure session tokens                             │   │
│  │  • Auto session refresh                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Layer 2: Route Protection                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Middleware checks authentication                  │   │
│  │  • Redirects unauthorized users                      │   │
│  │  • Server-side session validation                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Layer 3: Row Level Security (RLS)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Database-level access control                     │   │
│  │  • Users can only access their own data              │   │
│  │  • Role-based policies (Student/Teacher/HOD)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Layer 4: API Security                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • HTTPS only                                        │   │
│  │  • CORS configuration                                │   │
│  │  • Rate limiting (Supabase)                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Production Setup                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Vercel (Frontend Host)                  │   │
│  │  • Global CDN                                        │   │
│  │  • Automatic HTTPS                                   │   │
│  │  • Edge functions                                    │   │
│  │  • Continuous deployment from Git                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          │ API Calls                         │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Supabase Cloud (Backend)                   │   │
│  │  • PostgreSQL database                               │   │
│  │  • Authentication service                            │   │
│  │  • Storage (optional)                                │   │
│  │  • Auto-backups                                      │   │
│  │  • SSL/TLS encryption                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
                    ┌──────────┐
                    │ profiles │
                    │  (auth)  │
                    └────┬─────┘
                         │
            ┌────────────┴────────────┐
            │                         │
         ┌──▼──────┐            ┌────▼────┐
         │students │            │teachers │
         └──┬──────┘            └────┬────┘
            │                        │
            │ mentor_id ─────────────┘
            │
         ┌──▼──────────┐
         │ internships │
         └──┬──────────┘
            │
            ├──────────────┬──────────────┐
            │              │              │
      ┌─────▼──────┐ ┌────▼─────────┐ ┌──▼──────────┐
      │    noc     │ │ evaluations  │ │   (future)  │
      │applications│ │              │ │  documents  │
      └────────────┘ └──────────────┘ └─────────────┘
```

## Performance Optimizations

1. **Next.js Optimizations**
   - Server Components (reduce JS bundle)
   - Image optimization
   - Route prefetching
   - Code splitting

2. **Database Optimizations**
   - Indexed columns
   - Efficient queries
   - Connection pooling (Supabase)

3. **Caching Strategy**
   - Static page generation
   - Client-side caching (Zustand persist)
   - CDN caching (Vercel)

4. **Loading States**
   - Skeleton loaders
   - Optimistic UI updates
   - Progressive loading

---

**Last Updated:** November 2025
