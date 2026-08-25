# Prakash S Portfolio CMS

Same portfolio design, updated to use **real data only**.

## Real-data rules
- No demo/fake projects are bundled.
- Project count is calculated from the actual published rows in `projects`.
- Add a published project -> count increases automatically.
- Delete/unpublish a project -> count decreases automatically.
- Experience, availability, profile details and links are empty until you enter real information.
- Fake percentages/results are not displayed.
- Resume is the exact PDF you upload.

## Features
- Responsive public portfolio
- Mobile-friendly admin dashboard
- Profile settings
- Real project creation/deletion
- Project image upload
- Profile photo upload
- Hero image upload
- Resume/CV PDF upload
- View Resume in browser
- Download Resume
- Supabase database + storage

## Setup
1. Run `npm install`.
2. Create a Supabase project.
3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Create a **public** Storage bucket named `portfolio`.
5. Copy `.env.example` to `.env.local` and add the Supabase URL and anon key.
6. Run `npm run dev`.
7. Open `/admin` to add your real profile, resume and projects.

## Security
The starter admin page is not authentication-protected. Before public deployment, enable Supabase Auth and authenticated RLS/storage policies. Never expose a service-role key in frontend code.
