# SERVICE SOP ANALYSIS & ERP GAP REPORT

**Date:** 2026-01-05
**Scope:** Analysis of Service SOPs in `/home/matt-woodworth/Desktop/SOPS-ERP/OneDrive_1_10-6-2025/` vs. Weathercraft ERP Codebase.

## 1. Executive Summary

The analysis confirms a **high degree of alignment** between the documented Service SOPs and the Weathercraft ERP implementation (`src/app/(app)/service-dispatch`). The ERP's `STAGE_RANKING` and data models explicitly mirror the legacy "Centerpoint" and Excel-based workflows, indicating a deliberate design to support and eventually replace these manual systems.

**Key Finding:** The ERP effectively captures the "Golden Path" of service tickets (Intake -> Dispatch -> Invoice), but lacks specific handling for "Exception Paths" (Hold, Cancellation List, Incomplete/Return trips) which are currently manual processes in the SOPs.

---

## 2. SOP Deep Dive

### Core Workflow: New Ticket & Dispatch
**Source:** `Service - New Ticket.docx`, `Service - Dispatch Ticket Status.docx`

| Stage | SOP Requirement | ERP Implementation | Status |
|-------|----------------|--------------------|--------|
| **Intake** | Search Property, Check Open Tickets, Enter Contacts/Bill To. | `ServiceTicket` model links `Property` and `ServiceContact`. | ✅ Covered |
| **Classification** | Types: Leak, Scope, Warranty, Inspection. Rates: Standard, Emergency, Maintenance. | `dispatch_type` and `service_rate_type` ('standard', 'emergency', 'wrapp') exist. | ✅ Covered |
| **Scheduling** | "Need to Schedule" vs "Scheduled". ETA tracking. | `determineStatus` logic separates `scheduled` vs `need_to_schedule`. | ✅ Covered |
| **Dispatch** | Assign Technician, Status -> Dispatched. | `AssignedCrew` interface and `stage: 'dispatched'`. | ✅ Covered |
| **Execution** | Tech Notes, Photos (Before/After), Repairs, Materials. | `technician_notes`, `before_photos`, `after_photos`, `material_items`. | ✅ Covered |
| **Review** | Status -> Authorized -> Invoice Review. Quality Control. | `stage: 'authorized'`, `qc_reviewed` boolean. | ✅ Covered |
| **Invoicing** | Export to Foundation, Status -> Invoiced. | `foundation_job_no` field, `stage: 'invoiced'`. | ✅ Covered |

### Integration Points
-   **Centerpoint (Legacy CRM):** Heavily referenced. ERP is designed to replace this.
-   **Foundation (Accounting):** SOP mentions importing invoices to Foundation. ERP has `foundation_job_no`, implying integration exists or is planned.
-   **ExakTime (Time Tracking):** SOP mentions manual "Shop Allocation" reconciliation. ERP has `labor_hours_actual` but no specific "Shop Allocation" module found.
-   **Excel (Status Tracking):** The ERP's `useServiceTickets` hook replaces the "Service Department - Dispatch Status" Excel sheet.

---

## 3. ERP Codebase Cross-Reference

**File Analyzed:** `src/app/(app)/service-dispatch/service-dispatch-data-hooks.tsx`

The ERP defines a `STAGE_RANKING` constant that matches the SOP workflow 1:1:

```typescript
const STAGE_RANKING = [
  'new_entry',        // SOP: New Entry
  'review',           // SOP: Review Stage
  'accepted',         // SOP: Mark as Accepted
  'scheduled',        // SOP: Scheduled
  'dispatched',       // SOP: Dispatched
  'en_route',         // SOP: En Route (Notification)
  'on_site',          // SOP: Onsite
  'authorized',       // SOP: Authorized (Completed & Reviewed)
  'invoice_review',   // SOP: Invoice Review
  'invoice_approved', // SOP: Invoice Approved
  'invoiced',         // SOP: Invoiced
  'collections',      // SOP: Collections (implied)
];
```

**SOP Status Mapping:**
-   **SOP "Active"** -> ERP `status: 'active'` (derived from dispatched/en_route)
-   **SOP "Need to Schedule"** -> ERP `status: 'need_to_schedule'` (derived)
-   **SOP "Priority"** -> ERP `priority: 'emergency' | 'high'`

---

## 4. Gaps & Missing Features

### Gap 1: "Hold" and "Cancellation List"
**SOP:** Explicit statuses for tickets on "Hold" (e.g., waiting for material) or "Cancellation List" (customer wants earlier slot).
**ERP:** No `stage` or `status` found for 'hold' or 'cancellation_list'.
**Impact:** These tickets may get lost in 'new_entry' or 'accepted' without a way to filter them.

### Gap 2: "Incomplete Ticket" Loop
**SOP:** Manual process: *"Restart the ticket... Move stage back to New Entry... Remove ETA"*.
**ERP:** No specific logic found to handle "Return Trip" or "Incomplete". It assumes a linear flow.
**Impact:** Users may have to manually hack the data (resetting stages) which breaks reporting/metrics.

### Gap 3: Shop Allocation
**SOP:** `Service - Shop Allocation.docx` details a complex manual process of comparing ExakTime to Dispatch Schedule and allocating "Shop Time" to specific tickets.
**ERP:** No code found for "Shop Allocation" or automated time distribution.
**Impact:** Accounting data for job costing will remain manual/disconnected.

### Gap 4: Centerpoint "Picture Breakdown"
**SOP:** `Service - Picture Breakdown.docx` implies handling mass photo uploads.
**ERP:** Has `before_photos` and `after_photos` arrays, but no specific "breakdown" or organization tool seen in the hooks.

---

## 5. Enhancement Opportunities

### 1. Implement "Ticket On Hold" Workflow
Add a `is_paused` boolean or `sub_status` field to `ServiceTicket` to capture "Hold" (Material, Customer, Weather) and "Cancellation List" states without breaking the linear stage progression.

### 2. Automate "Return Trip" Logic
Create a specific action "Mark Incomplete / Schedule Return" that:
-   Clones the ticket (or creates a child task).
-   Links the new ticket to the original.
-   Sets the new ticket to 'need_to_schedule'.
-   Keeps the original as 'partial_complete' or 'historical'.
*This replaces the manual "Move stage back to New Entry" SOP.*

### 3. Build "Shop Allocation" Module
Since the ERP tracks `labor_hours_actual`, add a feature to import ExakTime data (CSV/API) and provide a UI to drag-and-drop "Shop Hours" onto specific Job Tickets, automatically calculating the burdened cost (`labor_cost_burdened`).

### 4. Warranty Logic
SOP mentions "Warranty" service type. ERP has `warranty_claim` boolean. Ensure this flag triggers specific billing logic (e.g., zeroing out `invoiced_amount` or flagging for different GL codes).

---

## 6. Conclusion

The Weathercraft ERP is well-positioned to replace the "Dispatch Status" Excel sheet and "Centerpoint" for the core dispatch loop. The data model is robust. The next phase of development should focus on **exception handling** (Holds, Incompletes) and **financial reconciliations** (Shop Allocation) to fully retire the legacy SOPs.