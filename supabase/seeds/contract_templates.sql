-- Seed contract_templates with 4 starter templates.
-- Idempotent — uses ON CONFLICT (slug) DO UPDATE.

INSERT INTO contract_templates (slug, name, body, category) VALUES
('master-services-agreement', 'Master Services Agreement', $MD$# Master Services Agreement

This Master Services Agreement ("Agreement") is entered into as of {effective_date} by and between **Narendra Pandrinki**, an independent consultant based in Hyderabad, Telangana, India ("Consultant"), and **{client_company}** ("Client").

## 1. Engagement and Scope

The Consultant agrees to provide professional services to the Client as described in one or more written Statements of Work ("SOWs") that will be issued under and governed by this Agreement. Each SOW will detail the specific scope, deliverables, schedule, and fees for a particular engagement. In the event of any conflict between this Agreement and an SOW, the terms of the SOW shall control with respect to that engagement only.

The Consultant shall perform the services with reasonable skill and care and in accordance with industry-standard practices for DevOps, platform engineering, cloud architecture, and adjacent disciplines. The Consultant retains discretion over the means and methods of performance, including tooling, working hours, and location, except where the SOW expressly requires otherwise.

## 2. Fees, Invoicing and Payment

The Client shall pay the Consultant the fees set out in each SOW. Unless an SOW provides otherwise, fees are quoted exclusive of taxes, currency conversion charges, and out-of-pocket expenses. Where applicable Indian GST or any equivalent destination-country tax is chargeable, it will be added to the invoice.

Invoices are payable within fourteen (14) days of the invoice date by bank transfer to the account designated by the Consultant. Amounts unpaid after the due date accrue interest at one and one-half percent (1.5%) per month or the maximum rate permitted by law, whichever is lower. The Consultant may suspend services on any past-due account after providing seven (7) days' written notice.

## 3. Client Responsibilities

The Client shall provide the Consultant with timely access to systems, credentials, documentation, key personnel and decision-makers reasonably required to perform the services. The Client acknowledges that delays or failures in providing such access may extend timelines and increase fees, and that the Consultant is not responsible for delays attributable to Client inaction.

## 4. Intellectual Property

Subject to full payment of all fees due under the relevant SOW, the Consultant assigns to the Client all right, title, and interest in the deliverables created specifically for the Client under that SOW ("Custom Deliverables"). The Consultant retains full ownership of all pre-existing materials, generic tools, libraries, code patterns, methodologies, and know-how used in providing the services ("Background IP"), and grants the Client a perpetual, worldwide, non-exclusive, royalty-free licence to use the Background IP solely as embedded within the Custom Deliverables.

The Consultant may incorporate open-source software in deliverables, in which case the licence terms of that software shall apply. The Consultant retains the right to use general skills, knowledge, and experience acquired during the engagement, including for the benefit of other clients, provided that no Client Confidential Information is disclosed.

## 5. Confidentiality

Each party may receive non-public information of the other party that is marked or that a reasonable person would understand to be confidential ("Confidential Information"). The receiving party shall (a) use the Confidential Information solely to perform under this Agreement, (b) protect it with the same degree of care it uses for its own confidential information (and no less than reasonable care), and (c) not disclose it to third parties except to employees, contractors, or advisors with a need to know who are bound by confidentiality obligations no less protective than those in this Section.

Confidentiality obligations survive termination for three (3) years, except for Client trade secrets and personal data, which remain protected for as long as they retain that status under applicable law.

## 6. Data Protection

The Consultant will comply with applicable data protection law in handling any personal data made available by the Client, including the Indian Digital Personal Data Protection Act, 2023, and any other framework expressly required by an SOW (e.g. GDPR for EU data subjects). Where the Consultant acts as a data processor, the parties shall execute a separate data processing addendum prior to processing.

## 7. Warranties and Disclaimer

The Consultant warrants that the services will be performed in a professional and workmanlike manner. EXCEPT AS EXPRESSLY STATED IN THIS AGREEMENT, ALL SERVICES AND DELIVERABLES ARE PROVIDED "AS IS" AND THE CONSULTANT DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

## 8. Limitation of Liability

EXCEPT FOR BREACHES OF CONFIDENTIALITY, INDEMNIFICATION OBLIGATIONS, AND CLIENT'S PAYMENT OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE TO THE OTHER FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, OR DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EACH PARTY'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT IS LIMITED TO THE FEES PAID BY THE CLIENT TO THE CONSULTANT UNDER THE SPECIFIC SOW GIVING RISE TO THE CLAIM IN THE TWELVE (12) MONTHS PRECEDING THE EVENT.

## 9. Term and Termination

This Agreement begins on the Effective Date and continues until terminated. Either party may terminate this Agreement for convenience upon thirty (30) days' written notice, provided that any active SOW will continue to govern that engagement until completion or separate termination. Either party may terminate this Agreement or any SOW immediately for material breach if the breach is not cured within fifteen (15) days of written notice.

On termination, the Client shall pay the Consultant for all services performed and expenses incurred up to the effective date of termination, and the Consultant shall deliver work-in-progress related to paid work to the Client.

## 10. Independent Contractor

The Consultant is engaged as an independent contractor. Nothing in this Agreement creates an employment, partnership, joint venture, or agency relationship. The Consultant is responsible for all of its own taxes, insurance, and statutory obligations.

## 11. Non-solicitation

During the term of this Agreement and for twelve (12) months thereafter, the Client shall not, directly or indirectly, solicit for employment or independently engage any individual who is a sub-contractor or close collaborator of the Consultant disclosed during the engagement, without the Consultant's prior written consent. General public job advertisements do not breach this Section.

## 12. Governing Law and Disputes

This Agreement is governed by the laws of India, without regard to its conflict-of-laws provisions. The parties shall first attempt to resolve any dispute by good-faith negotiation. Unresolved disputes shall be finally settled by arbitration administered under the Arbitration and Conciliation Act, 1996, by a sole arbitrator seated in Hyderabad, India. The language of arbitration shall be English. Either party may seek interim relief from a competent court in Hyderabad pending arbitration.

## 13. General

This Agreement, together with each executed SOW, constitutes the entire agreement between the parties on its subject matter and supersedes all prior agreements and understandings. Amendments must be in writing signed by both parties. If any provision is held unenforceable, the remainder shall continue in effect. Notices shall be sent by email to the addresses on the signature block, and shall be deemed received on the next business day after sending. Neither party may assign this Agreement without the other's prior written consent, except to a successor by merger, acquisition, or sale of substantially all assets.

## 14. Signatures

By signing below, each party agrees to be bound by the terms of this Master Services Agreement.

**Consultant:** Narendra Pandrinki
**Client:** {client_name}, {client_company}
**Effective Date:** {effective_date}
$MD$, 'master'),

('statement-of-work-project', 'Statement of Work — Fixed-Fee Project', $MD$# Statement of Work — {project_title}

This Statement of Work ("SOW") is issued under and governed by the Master Services Agreement between **Narendra Pandrinki** ("Consultant") and **{client_company}** ("Client") dated {msa_date}. Capitalised terms not defined in this SOW have the meanings given to them in the Master Services Agreement.

## 1. Project

**Project title:** {project_title}
**Client sponsor:** {client_name}
**Start date:** {start_date}
**Target completion:** {end_date}

## 2. Scope of Work

{scope}

The work above is the agreed scope. Any additional work outside this scope, including significant changes in direction, will be handled through a written change request that adjusts the timeline and fees as appropriate.

## 3. Deliverables and Milestones

{milestones}

Deliverables are considered accepted ten (10) business days after delivery unless the Client provides specific written objections within that window. Once accepted, deliverables are deemed to meet the agreed acceptance criteria.

## 4. Out of Scope

The following are explicitly out of scope for this SOW unless added through a change request: ongoing support and maintenance after acceptance, application code changes outside the specified scope, content writing or visual design, third-party software licences, cloud infrastructure costs, and travel.

## 5. Fees and Payment Schedule

**Total fixed fee:** {fee}

The fee is invoiced according to the milestone schedule above, with payment terms of fourteen (14) days net per the Master Services Agreement. The fee is exclusive of any applicable taxes and reimbursable expenses approved by the Client in writing.

## 6. Client Responsibilities

The Client shall provide a single named decision-maker, timely review of deliverables, access to systems and personnel, and any third-party contracts or accounts required for the work. Delays in Client responsiveness may shift the project timeline correspondingly.

## 7. Assumptions

This estimate assumes that the work environment, requirements, and personnel access will be substantially as discussed during scoping. Material differences discovered during execution may result in a change request.

## 8. Acceptance

This SOW becomes effective when signed by both parties below.

**Consultant:** Narendra Pandrinki, hello@narendrapandrinki.com
**Client:** {client_name}, {client_company}
$MD$, 'sow'),

('nda-mutual', 'Mutual Non-Disclosure Agreement', $MD$# Mutual Non-Disclosure Agreement

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {effective_date} between **Narendra Pandrinki**, an independent consultant based in Hyderabad, India, and **{client_company}** (each a "Party" and together the "Parties").

## 1. Purpose

The Parties wish to discuss a potential business relationship, including but not limited to consulting services, infrastructure design, and platform engineering work (the "Purpose"). In the course of these discussions, each Party may disclose to the other certain non-public information that is confidential and proprietary.

## 2. Confidential Information

"Confidential Information" means any non-public information disclosed by one Party (the "Discloser") to the other (the "Recipient") that is either (a) marked or designated as confidential at the time of disclosure, or (b) of a nature that a reasonable person would understand to be confidential under the circumstances. Confidential Information includes, without limitation, technical architectures, source code, infrastructure configurations, customer data, pricing, business plans, and personnel information.

Confidential Information does not include information that the Recipient can demonstrate (i) is or becomes generally available to the public other than through breach of this Agreement, (ii) was known to the Recipient prior to receipt from the Discloser, (iii) is rightfully received from a third party without restriction, or (iv) is independently developed by the Recipient without use of or reference to the Discloser's Confidential Information.

## 3. Obligations

The Recipient shall (a) use Confidential Information solely for the Purpose, (b) protect Confidential Information with the same degree of care it uses to protect its own confidential information of like importance, and in any case no less than reasonable care, and (c) not disclose Confidential Information to any third party except to employees, contractors, or professional advisors who have a need to know for the Purpose and who are bound by confidentiality obligations no less protective than those in this Agreement.

The Recipient may disclose Confidential Information to the extent required by law or court order, provided that the Recipient gives the Discloser prompt notice and reasonable cooperation to seek a protective order, where legally permissible.

## 4. No Licence

Nothing in this Agreement grants the Recipient any licence or other rights in the Discloser's Confidential Information, intellectual property, or trademarks, except the limited right to use such information for the Purpose.

## 5. Term

This Agreement is effective on the date above and continues for two (2) years. The confidentiality obligations in Section 3 survive termination and continue for three (3) years from the date of disclosure of the relevant Confidential Information, except that obligations regarding trade secrets continue for as long as the information remains a trade secret.

## 6. Return or Destruction

Upon written request, the Recipient shall promptly return or destroy all Confidential Information in its possession, except for one archival copy retained for legal compliance and copies stored in routine backups, which remain subject to this Agreement until destroyed in the ordinary course.

## 7. No Obligation to Proceed

Neither Party has any obligation under this Agreement to enter into any further agreement or business relationship. Any such relationship will require a separate written agreement.

## 8. Governing Law and Disputes

This Agreement is governed by the laws of India. Any dispute shall be resolved by arbitration seated in Hyderabad under the Arbitration and Conciliation Act, 1996, by a sole arbitrator. Either Party may seek interim injunctive relief in the courts of Hyderabad.

## 9. General

This Agreement is the entire agreement between the Parties on its subject matter. It may be amended only by a writing signed by both Parties. If any provision is unenforceable, the remainder shall continue in effect. The Parties may execute this Agreement electronically and in counterparts.

**Party 1:** Narendra Pandrinki, hello@narendrapandrinki.com
**Party 2:** {client_name}, {client_company}
$MD$, 'nda'),

('consulting-retainer', 'Monthly Consulting Retainer', $MD$# Monthly Consulting Retainer Agreement

This Monthly Consulting Retainer Agreement ("Agreement") is entered into as of {effective_date} between **Narendra Pandrinki** ("Consultant") and **{client_company}** ("Client").

## 1. Services

The Consultant shall provide ongoing advisory and platform engineering services to the Client on a monthly retainer basis. Typical services include architecture review, on-call escalation support during business hours, infrastructure-as-code review, cost and reliability analysis, and short-form implementation assistance, all subject to the monthly hours allocation below. Specific priorities for each month will be agreed during a monthly planning call between the Consultant and the Client's named technical lead.

## 2. Hours and Allocation

**Monthly allocation:** {hours_per_month} hours per calendar month
**Working hours:** Monday–Friday, 09:30–18:30 IST, excluding declared Indian public holidays
**Response time:** Best-effort within one (1) business day for non-urgent requests; same-business-day for items flagged as urgent by the Client's named lead

Hours are tracked in fifteen-minute increments. Up to twenty-five percent (25%) of unused hours in a month may be carried forward to the next month, but expire if not used within that next month. Hours used above the monthly allocation are billed at the hourly overage rate set out below and require advance notification before the work proceeds.

## 3. Fees

**Monthly retainer fee:** {monthly_fee}
**Hourly overage rate:** {overage_rate} per hour
**Billing cycle:** Invoiced on the first business day of each month, payable within fourteen (14) days

The retainer fee is payable whether or not the Client uses all available hours in a given month. Overage and approved expenses are invoiced separately at month-end.

## 4. Term

This Agreement runs for an initial term of three (3) months from the effective date and automatically renews for successive one-month terms unless either party gives thirty (30) days' written notice of non-renewal. Either party may terminate this Agreement immediately for material breach not cured within fifteen (15) days of written notice.

## 5. Client Lead

The Client shall designate a single named technical lead authorised to direct work, approve overage, and prioritise the monthly backlog. Without a named lead, the Consultant may pause work until one is appointed.

## 6. Confidentiality and IP

The confidentiality and intellectual property terms of the parties' Master Services Agreement (or, if none, the standard confidentiality and IP terms attached to this Agreement) apply to all work performed under this Agreement.

## 7. Independent Contractor

The Consultant is an independent contractor, not an employee, partner, or agent of the Client. Nothing in this Agreement creates exclusivity; the Consultant is free to provide services to other clients during the term, subject to the confidentiality obligations.

## 8. Governing Law

This Agreement is governed by the laws of India, with disputes resolved by arbitration seated in Hyderabad as set out in the parties' Master Services Agreement.

## 9. Signatures

**Consultant:** Narendra Pandrinki, hello@narendrapandrinki.com
**Client:** {client_name}, {client_company}
**Start date:** {effective_date}
$MD$, 'retainer')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  updated_at = NOW();
