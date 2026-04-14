# OREA APP CONTEXT — "Orea v kapse"

## 🎯 PURPOSE

We are building a mobile-first employee application for a hospitality company (OREA).

The goal is NOT to build a complex system.

The goal is to create a **simple, daily-use tool** that:

* simplifies access to information
* improves communication
* reduces reliance on managers
* replaces fragmented tools (HR systems, WhatsApp, documents)

---

## 🧠 CORE PRODUCT IDEA

"Orea v kapse" is a **single digital entry point** for employees.

It acts as:

* a **gateway to multiple systems**
* a **communication hub**
* a **daily operational assistant**

Important:
This is NOT a monolithic system.
It is an **integration layer + simple UX**.

---

## 👤 USERS

Primary users:

* hotel staff (housekeeping, reception, F&B)
* managers
* HQ/admin roles

Key constraints:

* low digital literacy (many users)
* mobile-first usage
* some use shared / old computers
* currently rely on WhatsApp and managers

---

## ⚠️ CURRENT PROBLEMS

* no single entry point
* multiple disconnected systems
* complex login processes
* inconsistent communication
* high dependency on managers
* information is hard to find

---

## 🎯 PRODUCT PRINCIPLES

* mobile-first (iOS & Android)
* extremely simple UX
* large touch targets
* minimal cognitive load
* fast access (≤ 5 seconds to key info)
* MVP = **few features, done really well**

DO NOT:

* overcomplicate
* add unnecessary features
* design for “enterprise complexity”

---

## 📱 MVP SCOPE

The MVP includes only core daily-use features:

### 1. HOME (MOST IMPORTANT)

* next shift
* urgent info / alerts
* key notifications
* 1–2 quick actions

### 2. SHIFTS

* upcoming shifts
* simple detail
* basic interaction (e.g. request change)

### 3. COMMUNICATION

* announcements
* simple feed
* basic read/unread

### 4. PROFILE

* personal info
* vacation
* payslip (link or preview)

---

## 🚫 NOT IN MVP

* complex workflows
* advanced approvals
* analytics
* too many features
* anything rarely used

---

## 🧭 NAVIGATION PRINCIPLES

* max 3–4 tabs
* very shallow hierarchy
* everything reachable in 1–2 taps
* HOME is dominant

---

## 🧩 ARCHITECTURE (HIGH-LEVEL)

* frontend = mobile app (React Native / similar)
* backend = API layer
* integrates multiple systems:

  * HR (payroll, attendance)
  * training
  * documents
* SSO (single sign-on)

The app is a **UI layer, not the system of record**.

---

## 🎨 UX GUIDELINES

Design for:

* speed
* clarity
* real-world usage

UI should feel:

* simple
* calm
* obvious

Avoid:

* clutter
* too many options
* hidden functionality

---

## 💬 TONE & MICROCOPY

Use simple, human language.

Examples:

* "Your next shift starts at 14:00"
* "You have 1 new message"
* "Request time off"

Avoid:

* corporate language
* technical terms

---

## 🔥 DESIGN PRIORITY

If unsure, always prioritize:

1. Simplicity
2. Speed
3. Clarity

NOT:

* feature richness
* visual complexity

---

## 🧠 HOW TO WORK WITH THIS PROJECT

When designing or coding:

* think like a product designer
* think about real users (hotel staff)
* reduce, don’t add
* question every element:
  → "Is this really needed?"

---

## 🚀 GOAL OF THE PROTOTYPE

The prototype should:

* feel real and usable
* demonstrate daily value
* be easy to understand in 30 seconds
* help sell the concept to stakeholders

---

## 💥 GOLDEN RULE

This is not an app for tech people.

This is a tool for someone who:

* is busy
* doesn’t like apps
* just wants to know:
  → "What do I need to do today?"
