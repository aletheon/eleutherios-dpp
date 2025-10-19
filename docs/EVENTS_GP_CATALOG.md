# Standard Event Types — GP / Primary Care

> Minimal event set for a GP service using PFSD (Policy–Forum–Service–Data).
> **No PHI appears in public;** proofs use signed hashes (anchoring optional).

| Event Type | Description | Key Payload Fields (non-PHI examples) |
|---|---|---|
| **AppointmentBooked** | Patient books or is scheduled for a consult. | patient_ref, slot, reason_code, channel |
| **PreVisitFormSubmitted** | Intake or consent forms submitted. | patient_ref, form_ids, consent_types, attachments_refs |
| **TriageStarted** | Nurse triage begins. | patient_ref, presenting_reason, checklist_used |
| **TriageCompleted** | Triage outcome + acuity set. | acuity (P1–P4), red_flags, vitals_present |
| **EncounterStarted** | GP encounter begins. | provider_ref, location, mode (telehealth/in-person) |
| **EncounterFinalized** | Diagnosis + plan recorded. | dx_codes, plan_summary, safety_netting_given |
| **PrescriptionIssued** | Medication prescribed. | rx_id, drug_codes, duration_days, indication |
| **LabOrdered** | Labs/imaging ordered. | order_id, order_codes, priority |
| **LabResultAttached** | Results available & attached. | order_id, abnormal_flags_present (bool) |
| **ReferralCreated** | Referral packet created & sent. | referral_id, specialty, target_provider_ref |
| **FollowUpScheduled** | Follow-up booked (or reminder set). | followup_date, reason, mode |
| **CareMessageSent** | Education/advice sent to patient. | template_id, channel |
| **ConsentRecorded** | Consent captured/updated. | consent_type, method (written/verbal/digital) |
| **CaseClosed** | Episode closed with disposition. | disposition (resolved/ongoing/transferred) |

## Proof Object (for every event)
```json
{
  "proof": {
    "mode": "signed",
    "sha256": "0x...",
    "sig": "0x...",
    "signer": "eleutherios:<key-id>",
    "tx_hash": null,
    "anchor_chain": null
  }
}
```

## Notes
- Use internal identifiers (patient_ref, provider_ref) that resolve privately; public endpoints must not expose PHI.
- Attachments are stored privately; only attachment refs/hashes appear in events.
- Antibiotic stewardship: if antibiotics are issued, schedule a review event within 3 days.
