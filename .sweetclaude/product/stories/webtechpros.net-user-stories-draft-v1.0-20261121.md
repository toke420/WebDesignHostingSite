---
title: webtechpros.net User Stories
version: 1.0
status: draft
date: 2026-11-21
audience: developers and test authors (Gherkin, maps to Playwright tests)
format: gherkin
scope: all
source: .sweetclaude/state/personas.yaml
---

# webtechpros.net User Stories (Draft v1.0)

> Built from provisional personas. "Status" shows how the current site measures against each story.

| ID | Title | Status |
|---|---|---|
| US-LBO-001 | Compare design packages and logo price | partial — prices tested; package differentiation is a gap |
| US-LBO-002 | Request a free consultation | covered by existing test |
| US-LBO-003 | Recover when the helpdesk is unavailable | covered by implementation; test not confirmed |
| US-SMB-001 | See support rates and charges before engaging | gap — minimum charge not published |
| US-SMB-002 | Reach a real person fast via chat | partial — chat exists; response-time expectation is a gap |
| US-SMB-003 | Know how to report an urgent issue | gap |
| US-DEV-001 | Confirm the hosting stack and locations before enquiring | covered by FAQ content |
| US-DEV-002 | Compare hosting plans | partial — Pro is quote-only |
| US-DEV-003 | Know the time from request to live hosting | gap |
| US-STF-001 | Every request lands in the inbox with its case number | covered by existing test |
| US-STF-002 | Get notified of new requests within 5 minutes | gap — email delivery not verified in production |
| US-STF-003 | Recover admin access safely | gap |
| US-STF-004 | Keep spam out of the inbox | covered by implementation (honeypot) |

## Local business owner

### US-LBO-001: Compare design packages and logo price
*Area: Pricing · Status: partial — prices tested; package differentiation is a gap*

```gherkin
Story US-LBO-001: Compare design packages and logo price

As a local business owner
I want to see what each design package and the logo pack cost and include
So that I can pick the right one before asking for a quote

Scenario: Design and logo prices are reachable in two clicks
  Given I have landed on the home page
  When I open the "Web & logo design" tab
  Then I see Package 1 at $50, Package 2 at $150 and Package 3 at $500 (one-off, AUD)
  And I see the logo pack "From $110 AUD"

Scenario: Packages are distinguishable
  Given I am viewing the "Web & logo design" tab
  When I compare Package 2 and Package 3
  Then each package lists at least one feature the other does not
```

### US-LBO-002: Request a free consultation
*Area: Consultation · Status: covered by existing test*

```gherkin
Story US-LBO-002: Request a free consultation

As a local business owner
I want to send my project details from the package I'm looking at
So that I don't have to re-explain what I'm interested in

Scenario: Enquiry is prefilled from the chosen package
  Given I am viewing a package
  When I click its enquire button
  Then the consultation dialog opens with "What can we help with?" set to that service
  And the project description is prefilled with the package name

Scenario: Successful submission returns a case number
  Given I have entered my name, email and project description and ticked consent
  When I submit the form
  Then I see "Your request is in our helpdesk as" followed by a case number
  And I am told this is a request, not a confirmed appointment

Scenario: Missing required field
  Given the consultation dialog is open
  When I submit without an email address
  Then the form is not submitted and the email field is flagged
```

### US-LBO-003: Recover when the helpdesk is unavailable
*Area: Consultation · Status: covered by implementation; test not confirmed*

```gherkin
Story US-LBO-003: Recover when the helpdesk is unavailable

As a local business owner
I want to know clearly when my request did not go through
So that I don't wait for a reply that will never come

Scenario: Helpdesk unreachable
  Given the Helpdesk backend is down
  When I submit a complete consultation request
  Then I see "We could not reach the helpdesk. Your request has not been confirmed."
  And my entered details remain in the form so I can retry
```

## SMB office manager

### US-SMB-001: See support rates and charges before engaging
*Area: IT support · Status: gap — minimum charge not published*

```gherkin
Story US-SMB-001: See support rates and charges before engaging

As an SMB office manager
I want to see hourly rates and any minimum charge up front
So that I can approve the spend before work starts

Scenario: Rates are visible
  Given I open the "IT support" tab
  Then I see Everyday IT at $110/hour and Servers & infrastructure at $150/hour

Scenario: Minimum charge is stated
  Given I am viewing the "IT support" tab
  Then I can see the minimum charge or call-out fee for each support type
```

### US-SMB-002: Reach a real person fast via chat
*Area: Chat · Status: partial — chat exists; response-time expectation is a gap*

```gherkin
Story US-SMB-002: Reach a real person fast via chat

As an SMB office manager with a broken server
I want to open a chat and reach a person quickly
So that the outage is resolved as soon as possible

Scenario: Chat opens
  Given I am on any page
  When I click "Let's chat"
  Then the Helpdesk chat widget opens within 5 seconds

Scenario: Expected response time is shown
  Given the chat widget is open
  Then I can see the expected response time for the current hours

Scenario: Chat fails to load
  Given the Helpdesk is unreachable
  When I click "Let's chat"
  Then I see an error message instead of a spinner that never finishes
```

### US-SMB-003: Know how to report an urgent issue
*Area: IT support · Status: gap*

```gherkin
Story US-SMB-003: Know how to report an urgent issue

As an SMB office manager
I want to know whether my problem is urgent and which channel to use
So that I don't put an outage into a consultation queue

Scenario: Urgent route is signposted
  Given I am viewing the "IT support" tab
  Then I can see which channel to use for urgent problems and the response time for it
```

## Startup / side-project builder

### US-DEV-001: Confirm the hosting stack and locations before enquiring
*Area: Hosting · Status: covered by FAQ content*

```gherkin
Story US-DEV-001: Confirm the hosting stack and locations before enquiring

As a startup builder
I want to confirm the stack, access methods and data-centre locations from the site
So that I know the hosting fits my app before I talk to anyone

Scenario: Stack and access are documented
  Given I open the FAQ "What is included in the hosting platform?"
  Then I see Linux, Nginx, MariaDB/MySQL and PHP, SFTP access and DNS management listed

Scenario: Locations are documented
  Given I open the FAQ "Where will my website be hosted?"
  Then I see Melbourne, Sydney, US and UK options
```

### US-DEV-002: Compare hosting plans
*Area: Hosting · Status: partial — Pro is quote-only*

```gherkin
Story US-DEV-002: Compare hosting plans

As a startup builder
I want to compare Starter, Standard and Pro on price and limits
So that I pick the cheapest plan that fits

Scenario: Plans show price and limits
  Given I open the "Web hosting" tab
  Then I see Starter at $10/month with 5 GB and 250 GB bandwidth
  And Standard at $20/month with 10 GB and 350 GB bandwidth
  And Pro shows "Request a quote" with 30 GB and 700 GB bandwidth
```

### US-DEV-003: Know the time from request to live hosting
*Area: Hosting · Status: gap*

```gherkin
Story US-DEV-003: Know the time from request to live hosting

As a startup builder
I want to know how long setup takes after I enquire
So that I can plan my launch

Scenario: Setup time is stated
  Given I am viewing the "Web hosting" tab or its FAQ
  Then I can see the typical time from consultation to live hosting
```

## WebTechPros staff (internal)

### US-STF-001: Every request lands in the inbox with its case number
*Area: Inbox · Status: covered by existing test*

```gherkin
Story US-STF-001: Every request lands in the inbox with its case number

As a WebTechPros staff member
I want every consultation to appear in the Helpdesk inbox
So that no lead is lost

Scenario: Case is persisted
  Given a visitor submits a consultation
  When I open the Helpdesk inbox
  Then I see a case with the same case number, name, email, service and message

Scenario: Chat continues the same case
  Given the visitor clicks "Open your conversation" after submitting
  Then their chat messages appear on the same case, not a new one
```

### US-STF-002: Get notified of new requests within 5 minutes
*Area: Notifications · Status: gap — email delivery not verified in production*

```gherkin
Story US-STF-002: Get notified of new requests within 5 minutes

As a WebTechPros staff member
I want an email notification when a request arrives
So that I can reply within one business day

Scenario: Notification is delivered
  Given SMTP is configured for the production Helpdesk
  When a visitor submits a consultation
  Then a notification email reaches the operator inbox within 5 minutes
```

### US-STF-003: Recover admin access safely
*Area: Access · Status: gap*

```gherkin
Story US-STF-003: Recover admin access safely

As a WebTechPros staff member
I want a documented way to reset the Helpdesk admin password
So that losing the password doesn't lock us out of customer requests

Scenario: Documented reset
  Given I have server access but have lost the admin password
  When I follow the documented reset procedure
  Then I can sign in with a new password and existing cases are intact
```

### US-STF-004: Keep spam out of the inbox
*Area: Spam · Status: covered by implementation (honeypot)*

```gherkin
Story US-STF-004: Keep spam out of the inbox

As a WebTechPros staff member
I want bot submissions filtered
So that my inbox only contains real requests

Scenario: Honeypot field is filled
  Given a submission fills the hidden "website" field
  When the form is submitted
  Then no Helpdesk case is created
```

## Additional Development

- Gap stories (US-LBO-001 scenario 2, US-SMB-001/002/003, US-DEV-003, US-STF-002/003) need business decisions before code: minimum charges, response times, setup times.
- Only one task per persona was defined; renewals, adding email seats and number porting have no stories yet.
