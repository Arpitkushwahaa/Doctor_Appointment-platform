# 🚀 Quick Reference - Appointment Status System

## Status Flow Chart

```
SCHEDULED (Amber)
    ↓
[Video Call Starts]
    ↓
Patient Joins? 
    ↓
YES ─→ COMPLETED (Green) 
    "Meeting Complete"
    
NO  ─→ TIME_OVER (Orange)
    "Time Over - Patient didn't join"
```

## Status Meanings

| Status | When It Happens | Color | Who Can Set It |
|--------|----------------|-------|----------------|
| SCHEDULED | Appointment booked | Amber | System (automatic) |
| COMPLETED | Patient joined call | Green | Doctor (ends call) |
| TIME_OVER | Patient didn't join | Orange | Doctor (ends call) |
| CANCELLED | Either party cancels | Red | Patient or Doctor |

## For Doctors - How to Use

### During Appointment:
1. Join video call 30 min before or during appointment time
2. Wait for patient to join
3. You'll see toast: "Other participant joined" when patient connects
4. Conduct consultation
5. Click red phone button to end call
6. System automatically marks status based on patient participation

### What You'll See:
- **Patient joined** → Toast: "Meeting Complete - Appointment finished successfully"
- **Patient NO-SHOW** → Toast: "Time Over - Patient didn't join"

## For Patients - What to Expect

### Your Appointment:
1. Join video call within appointment time window
2. When you connect, doctor will see "Other participant joined"
3. Complete your consultation
4. After call ends:
   - If you joined → Status: `COMPLETED` ✅
   - If you forgot → Status: `TIME_OVER` ⏰

### Important:
- **Must join during appointment time** to avoid TIME_OVER status
- Even joining briefly counts as COMPLETED
- TIME_OVER appointments may affect your account standing

## Badge Colors Quick Reference

```
🟢 COMPLETED  = Successful meeting (patient joined)
🟠 TIME_OVER  = Patient no-show
🔴 CANCELLED  = Appointment cancelled
🟡 SCHEDULED  = Upcoming appointment
```

## Common Scenarios

### Scenario 1: Perfect Appointment ✅
- Patient joins on time
- Consultation completes
- Doctor ends call
- **Result**: COMPLETED (Green)

### Scenario 2: Patient Late but Joins ✅
- Appointment starts
- Patient joins 10 min late
- Consultation happens
- Doctor ends call
- **Result**: COMPLETED (Green)

### Scenario 3: Patient Forgets ❌
- Appointment time arrives
- Only doctor joins
- Doctor waits
- No patient shows up
- Doctor ends call
- **Result**: TIME_OVER (Orange)

### Scenario 4: Technical Issues ⚠️
- Patient joins
- Connection drops
- Patient reconnects
- Consultation completes
- **Result**: COMPLETED (Green) - joining even briefly counts

## Developer Notes

### To Check Join Status:
```javascript
// In appointment object:
appointment.patientJoined  // true/false
appointment.doctorJoined   // true/false
appointment.status         // SCHEDULED, COMPLETED, TIME_OVER, or CANCELLED
```

### Status Determination Logic:
```javascript
if (patient joined at any point) {
  status = "COMPLETED"
} else {
  status = "TIME_OVER"
}
```

## Troubleshooting

### Patient Says They Joined but Status is TIME_OVER:
- Check `appointment.patientJoined` in database
- Verify patient used correct appointment link
- Ensure patient clicked "Join Video Call" button

### Doctor Can't End Call:
- Refresh page
- Re-join call
- Use browser console to check for errors

### Status Not Updating:
- Ensure doctor clicked "End Call" button
- Check that appointment has `appointmentId` in URL
- Verify user is logged in

---

**Remember**: Only the doctor can finalize the appointment status by ending the call! 🎯
