-- Seed default email templates. Idempotent via slug.
INSERT INTO email_templates (slug, name, subject, body_text, category, variables) VALUES
('welcome-after-chat',
 'Welcome — quick reply after chatbot lead',
 'Quick reply, {first_name}',
 E'Hi {first_name},\n\nThanks for the chat on the site — I read every conversation myself, so this is the actual reply, not an autoresponder.\n\nFrom what you shared, here is how I would normally take this forward:\n\n1. A short 15-min discovery call so I can ask you four or five sharp questions.\n2. A written summary of what I think the engagement should look like — scope, timeline, and a price band.\n3. You decide whether it is worth proceeding.\n\nIf that sounds reasonable, you can grab a slot here: https://narendrapandrinki.com/book\n\nIf email is easier, just reply to this thread with anything you would like me to know up front.\n\nBest,\nNarendra Pandrinki\nIndependent DevOps & Platform Engineer',
 'lead',
 '[{"key":"first_name","label":"First name"}]'::jsonb),

('discovery-invite',
 'Discovery — invite to 15-min call',
 'A 15-minute call to figure out if I am the right fit',
 E'Hi {first_name},\n\nBefore we talk scope or money, I would rather spend 15 minutes finding out whether I am actually the right person for {project_name}. Half the calls I take end with me recommending someone else — that is fine, it saves both of us time.\n\nWhat I would want to cover:\n\n- What you have already tried and why it stalled\n- The constraint that matters most (time, cost, headcount, compliance)\n- What "done" looks like in your head\n\nGrab any slot that works: https://narendrapandrinki.com/book\n\nNo deck, no prep needed. Just show up.\n\nBest,\nNarendra',
 'sales',
 '[{"key":"first_name","label":"First name"},{"key":"project_name","label":"Project name"}]'::jsonb),

('thank-you-after-call',
 'Thank you — recap after discovery call',
 'Recap of our call + next steps',
 E'Hi {first_name},\n\nThanks for the time today. Quick recap so we are both working from the same page:\n\nWhat you are trying to do:\n- {goal_summary}\n\nThe constraints I picked up on:\n- {constraints}\n\nWhat I think the right shape of engagement is:\n- {proposed_shape}\n\nNext step: I will send a written proposal in the next 1–2 working days with scope, milestones, and a price. If anything in the recap above is off, reply and tell me before I write it up — much easier to fix now than later.\n\nBest,\nNarendra',
 'sales',
 '[{"key":"first_name","label":"First name"},{"key":"goal_summary","label":"Goal"},{"key":"constraints","label":"Constraints"},{"key":"proposed_shape","label":"Proposed engagement shape"}]'::jsonb),

('proposal-intro',
 'Proposal — sending the written proposal',
 'Proposal for {project_name}',
 E'Hi {first_name},\n\nProposal for {project_name} attached / linked below. The short version:\n\n- Scope: {scope_summary}\n- Timeline: {timeline}\n- Investment: {price}\n\nA few things worth flagging before you read it:\n\n1. The price is fixed for the scope as written. If scope changes mid-flight we agree the delta in writing first — no surprises.\n2. I have built in a 1-week buffer at the end for the unknowns I have not seen yet.\n3. The first deliverable is a working environment by week {first_milestone_week}, not a slide deck.\n\nRead it when you have 20 quiet minutes. Then either say yes, or come back with the bits that do not fit and we adjust.\n\nBest,\nNarendra',
 'sales',
 '[{"key":"first_name","label":"First name"},{"key":"project_name","label":"Project name"},{"key":"scope_summary","label":"Scope summary"},{"key":"timeline","label":"Timeline"},{"key":"price","label":"Price"},{"key":"first_milestone_week","label":"First milestone week"}]'::jsonb),

('kickoff',
 'Kickoff — project kickoff note',
 'Kickoff: {project_name}',
 E'Hi {first_name},\n\nWe are live on {project_name}. Here is how I will run things so you do not have to chase me:\n\n- Weekly: a short written update every Friday with what shipped, what is next, and any blockers. No status calls unless something is on fire.\n- Always-on: Slack / email for anything that cannot wait 24h.\n- Code: pushed to your repo daily, never sat on locally.\n- Invoices: monthly in arrears, payable in 14 days.\n\nFirst week priorities:\n1. {week_one_priority_1}\n2. {week_one_priority_2}\n3. {week_one_priority_3}\n\nAccess I still need from you:\n- {access_needed}\n\nSend that over today if you can. The sooner I have it the sooner the meter starts producing useful work rather than waiting on permissions.\n\nBest,\nNarendra',
 'project',
 '[{"key":"first_name","label":"First name"},{"key":"project_name","label":"Project name"},{"key":"week_one_priority_1","label":"Priority 1"},{"key":"week_one_priority_2","label":"Priority 2"},{"key":"week_one_priority_3","label":"Priority 3"},{"key":"access_needed","label":"Access needed"}]'::jsonb),

('invoice-reminder',
 'Invoice reminder — gentle late-payment ping',
 'Invoice {invoice_number} — quick nudge',
 E'Hi {first_name},\n\nNo drama, just flagging: invoice {invoice_number} for {invoice_amount} was due on {due_date} and has not landed yet. It might already be in your finance team''s queue — happens often.\n\nIf you can confirm a payment date I will stop pinging. If something on the invoice itself needs adjusting, tell me and I will reissue it the same day.\n\nThanks,\nNarendra',
 'billing',
 '[{"key":"first_name","label":"First name"},{"key":"invoice_number","label":"Invoice number"},{"key":"invoice_amount","label":"Invoice amount"},{"key":"due_date","label":"Due date"}]'::jsonb),

('handover',
 'Handover — end-of-engagement note',
 'Handover for {project_name}',
 E'Hi {first_name},\n\n{project_name} is wrapped. Below is everything you and your team need to keep running it without me.\n\nWhat is in the handover bundle:\n- Architecture diagram (current state, post-changes)\n- Runbook for the top 5 incidents I have seen during the engagement\n- Credentials transfer checklist (rotate the ones with my name on them within 7 days)\n- Backlog of things I would do next if I were staying — prioritised\n\nWhat I am doing for the next 30 days:\n- On Slack / email for questions, no charge, best-effort response within a working day.\n- After 30 days, anything new gets quoted as a fresh small engagement.\n\nIt has been a good run. If anyone in your network is wrestling with the same kind of problem you had, an introduction is the highest compliment you can pay.\n\nBest,\nNarendra',
 'project',
 '[{"key":"first_name","label":"First name"},{"key":"project_name","label":"Project name"}]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
