# Pinfolio Production Setup

Pinfolio can run in two modes:

- Local development: uses `data/db.json`
- Production: uses Supabase with `PINFOLIO_DB_MODE=supabase`

## 1. Create Supabase Project

1. Go to Supabase and create a new project.
2. Open the SQL editor.
3. Run the SQL from `supabase/schema.sql`.

This creates:

- `pinfolio_accounts`
- `pinfolio_sessions`

## 2. Add Render Environment Variables

In Render, open your web service settings and add:

```bash
PINFOLIO_DB_MODE=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
RESEND_API_KEY=your-resend-api-key
FEEDBACK_TO_EMAIL=vish.chouhan60@gmail.com
FEEDBACK_FROM_EMAIL=Pinfolio Feedback <feedback@your-domain.com>
```

Use the service role key only on the server. Never expose it in frontend code.

`RESEND_API_KEY` powers the feedback form email delivery. Use a verified sender email for
`FEEDBACK_FROM_EMAIL` after adding your domain in Resend.
The feedback form asks for the user's email and sends it as the email `reply_to`, so replying to the
feedback email goes back to that user.

## 3. Deploy

Render build command can stay empty for this plain Node app.

Start command:

```bash
npm start
```

## 4. Verify

After deployment:

1. Open the deployed URL.
2. Create a new account.
3. Upload a photo.
4. Log out.
5. Log in from another browser or device.
6. Confirm the same photos and settings are still there.
7. Send feedback from the bottom feedback button and confirm it arrives at
   `vish.chouhan60@gmail.com`.

If this works, user data is saving in Supabase instead of the local JSON file.
