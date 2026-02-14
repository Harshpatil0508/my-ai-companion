

# Reflecta — Frontend Plan

## Vision
A sleek, dark-themed web app that showcases your AI-powered personal tracking system. Think **Linear meets Headspace** — professional enough to impress investors, functional enough for daily use.

## Design System
- **Dark theme** with deep navy/charcoal backgrounds
- **Accent color**: Electric blue or violet gradient for CTAs and highlights
- **Glassmorphism** cards with subtle blur and borders
- **Smooth animations** on page transitions and data loading
- **Professional typography** with clear hierarchy

---

## Phase 1: Core Pages (This Implementation)

### 1. Landing Page
- Hero section with animated tagline: *"AI that's accountable, not just intelligent"*
- Feature highlights (Behavior Detection, Explainable AI, Validation Loop)
- CTA buttons to Sign Up / Log In
- Designed to impress during a pitch demo

### 2. Authentication (Login & Register)
- Clean form with email/password
- Smooth transitions between login and register
- Token storage and refresh token handling via cookies
- Redirect to dashboard after login

### 3. Dashboard (Main Hub)
- **Today's snapshot**: Mood, sleep, work, study hours at a glance
- **Quick log entry**: If no log today, show a prominent "Log Today" card
- **AI Daily Motivation**: Display today's AI insight with its explanation
- **Weekly trend mini-chart**: Small sparklines showing your last 7 days
- **AI Validation score**: Quick stat showing how effective AI advice has been

### 4. Daily Log Entry
- Beautiful form to input: work hours, study hours, sleep hours, mood (1-10 slider), goal completion %, notes
- Validation matching your backend constraints
- Success animation on submission
- Edit capability for today's log

### 5. AI Insights Page
- View daily AI motivations with explainable reasoning
- Thumbs up/down feedback buttons (connected to /ai/feedback)
- AI validation results showing before/after metrics with visual indicators (improved/neutral/declined)

### 6. Analytics Page
- Monthly analytics summary with charts (using Recharts)
- Visualize trends: sleep, mood, work hours, goal completion over time
- Highlight behavior change detection results

---

## Technical Approach
- API service layer with configurable base URL (for localhost now, deployed later)
- JWT token management with automatic refresh
- Protected routes requiring authentication
- Responsive design (desktop-first, mobile-friendly)
- Loading skeletons and error states throughout
- Toast notifications for user actions

---

## What's Missing in Your Backend (Notes for Later)
- **User profile endpoint**: No GET /auth/me or profile update — would help personalize the dashboard
- **Daily AI motivation endpoint**: Your model exists but I don't see a GET endpoint to fetch today's motivation for the frontend
- **Monthly AI review endpoint**: Similar — the model exists but no router to fetch it
- **Behavior profile endpoint**: No way to read the user's AI behavior profile from the frontend
- These can be added as simple GET endpoints later

