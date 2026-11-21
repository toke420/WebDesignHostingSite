---
title: webtechpros.net User Personas
version: 1.0
status: draft
date: 2026-11-21
audience: internal
source: README.md, src/content.ts (no discovery research)
---

# webtechpros.net User Personas (Draft v1.0)

> Provisional. Built from the site copy, not user research. Fields marked [inferred] need validating.

## Local business owner

**Role:** Sole trader or small shop owner needing a first proper web presence  
**Trigger:** Starting the business, or realising competitors look more credible online [inferred]  
**Deal-breakers:** Hidden costs; Lock-in contracts; Jargon; Being upsold to a bigger package

### Task: Request a website and logo quote

**Inputs needed:** Business name and a rough idea of what they want; no technical knowledge

**Steps:**
1. Land on hero
2. Open Web & logo design tab and compare Packages 1-3
3. Read logo pack ($110)
4. Click to request a consultation
5. Fill name, email, service, project detail; tick consent
6. Receive case number
7. Optionally open chat

**Success criteria:**
- [ ] Finds design and logo prices within 2 clicks of landing
- [ ] Submits the request in 1 dialog with at most 4 fields plus consent
- [ ] Sees a case number on screen
- [ ] Gets a staff reply within 1 business day
- [ ] Can tell which package suits them before submitting

**Failure modes:**
- Packages 2 and 3 have near-identical descriptions, so the price difference is unclear
- Helpdesk unreachable; sees error and abandons
- Assumes the request booked an appointment

## SMB office manager

**Role:** Person at a growing small business who looks after the tech without it being their job  
**Trigger:** An outage, new hires, or a move to remote or hybrid work [inferred]  
**Deal-breakers:** Slow response; No real person to talk to; Unclear hourly billing

### Task: Get fast help with a broken server or network

**Inputs needed:** Symptoms, business impact, and who can grant access

**Steps:**
1. Open IT support tab
2. Check Servers & infrastructure rate ($150/h)
3. Open chat or request a consultation for IT support
4. Describe the outage
5. Talk to a real person
6. Agree scope and access before work starts

**Success criteria:**
- [ ] Reaches a human in chat within 15 minutes in business hours
- [ ] Knows the hourly rate and any minimum charge before agreeing to work
- [ ] Gets the work confirmed in writing
- [ ] Knows whether the issue counts as urgent and the expected response time

**Failure modes:**
- Chat unstaffed with no stated response time
- Minimum charge not shown on the site
- Urgent issues submitted through the consultation form

## Startup / side-project builder

**Role:** Technical, price-sensitive founder or hobbyist launching a site or app  
**Trigger:** Launching an MVP or leaving unreliable cheap hosting [inferred]  
**Deal-breakers:** Price above about $10/month; No SSH or SFTP control; Slow servers far from their audience

### Task: Choose and launch Starter hosting

**Inputs needed:** Domain, stack or app (e.g. WordPress), audience location

**Steps:**
1. Open Web hosting tab and compare Starter, Standard and Pro
2. Check FAQ for stack (LEMP, SFTP, DNS, one-click apps) and data-centre locations
3. Request a consultation for Web hosting
4. Agree a location near their audience
5. Receive access details
6. Deploy

**Success criteria:**
- [ ] Confirms PHP/MariaDB and SFTP support from the site alone
- [ ] Knows data-centre options (Melbourne, Sydney, US, UK) before submitting
- [ ] Has the site live on the agreed plan with SSL working
- [ ] Knows the time from request to live hosting up front

**Failure modes:**
- Expects instant self-serve signup and leaves at the consultation step
- Pro hosting has no price
- SSH access not mentioned, only SFTP

## WebTechPros staff (internal)

**Role:** Team member working requests in the Helpdesk inbox  
**Trigger:** A new consultation request or chat arrives  
**Deal-breakers:** Missed notifications; Messy handover between chat and email

### Task: Triage a new consultation request

**Inputs needed:** Inbox login, working email notifications, current price list

**Steps:**
1. Receive notification
2. Open Helpdesk inbox
3. Read the case (name, email, service, message)
4. Reply by chat or email to arrange a time
5. Record scope and quote
6. Close or hand off

**Success criteria:**
- [ ] Every submitted request appears in the inbox with its case number
- [ ] Staff notified within 5 minutes
- [ ] First reply sent within 1 business day
- [ ] No request lost when the visitor moves from form to chat
- [ ] Visitor-selected service or package visible without asking again

**Failure modes:**
- Notifications not configured (email delivery not yet verified per README)
- Admin password lost or locked out
- Spam gets past the honeypot field

## Anti-profile

- Enterprises needing SLAs, 24/7 on-call or compliance certifications
- Bargain shoppers wanting instant self-serve ~$2/month hosting with no human contact
- Anyone expecting unlimited resources

## Additional Development

- No product-discovery research; validate triggers and deal-breakers with real customers.
- One task per persona; renewals, adding email seats, number porting and logo revisions are not yet covered.
- Ecommerce/content creator persona was dropped; revisit if store checkout is added.
- International customers (US/UK hosting) treated as a variant of personas 1-3.
