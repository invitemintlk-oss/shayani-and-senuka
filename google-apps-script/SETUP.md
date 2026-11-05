# Google Sheets setup (RSVP + Wishes)

Sheet: https://docs.google.com/spreadsheets/d/1CULITKV9nZkyrqOX9x2xvO-hXvqK-8xCGxPFRpKPyPk/edit

1. Open the Google Sheet → **Extensions → Apps Script**.
2. Delete everything in `Code.gs` and paste the full contents of `code.ts` (same as `google-apps-script/code.gs`).
3. (Optional) Select `setupSheets` in the toolbar and click **Run** once to create the **RSVP** and **Wishes** tabs right away. Approve the permissions prompt.
   If you skip this, the tabs and their headers are created automatically on the first submission.
4. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL (ends with `/exec`).
6. Paste it into `GOOGLE_SCRIPT_URL` in `src/config.ts` (it is hard-coded there).

Sheets and headers:
- **RSVP**: Timestamp | Full Name | Attendance | Guests | Dietary Notes | Invite Name
- **Wishes**: Timestamp | Guest Name | Message

The website also reads the Wishes tab (`GET ?action=wishes`) to show the guestbook.
If you edit the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.
