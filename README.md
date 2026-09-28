# Study Sprint

Study Sprint is a simple student task-management web app built with AI assistance. It lets users create, view, update, complete, filter, and delete assignments. Task data is stored in a Supabase database and the frontend is designed to deploy as a static site on Netlify.

## Live App

**Deployed app:** https://spiffy-flan-4fc8d5.netlify.app

## Demo Video

**YouTube demo:** https://youtu.be/W4hNf1RttjA

## Features

- Register, log in, and log out with Supabase Auth
- Each user can access only their own tasks, enforced by database policies
- Create a task with title, course/category, due date, priority, and notes
- Read tasks from the Supabase database
- Update task details
- Mark a task complete or reopen it
- Delete tasks
- Filter tasks by All / Open / Done
- Dashboard counts for total, open, and completed tasks
- Responsive layout for desktop and mobile

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase (PostgreSQL database + API)
- Supabase JavaScript client
- Netlify
- GitHub
- AI coding assistant / ChatGPT

## Database

The app uses one `tasks` table with these fields:

- `id`
- `user_id`
- `title`
- `course`
- `due_date`
- `priority`
- `notes`
- `completed`
- `created_at`

The SQL used to create the table and per-user Row Level Security policies is included in `supabase.sql`.

## Setup Instructions

1. Create a free Supabase project.
2. Open **SQL Editor** in Supabase.
3. Paste the contents of `supabase.sql` and run it.
4. In Supabase, open **Project Settings -> API**.
5. Copy your **Project URL**.
6. Copy your **publishable key** (or legacy anon key if that is what your project shows).
7. Open `config.js` and replace:
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
8. Open the project with a local web server or deploy it to Netlify.
9. In Supabase Authentication URL Configuration, set Site URL and an allowed redirect URL to your deployed URL.
10. Register in the app, confirm your email if prompted, and log in.
11. Add a task and confirm it appears in the Supabase `tasks` table. Refresh to verify persistence.
12. Test edit, completion, deletion, filters, logout, and login. With a second account, verify that the first account's tasks are not visible.

Use only a browser-safe publishable/anon key in `config.js`. Never put a database password or secret/service_role key in this public project.

On a fresh database, each task requires an owner. When upgrading the earlier public version, old ownerless rows remain stored but are hidden from app users.

## Deployment

### Netlify

1. Push this project to a public GitHub repository.
2. In Netlify, choose **Add new site -> Import an existing project**.
3. Connect GitHub and select the repository.
4. This project has no build step. Use the repository root as the publish directory.
5. Deploy the site.
6. Test create, edit, complete, filter, and delete operations on the deployed URL.

## GitHub Repository

**Repository:** https://github.com/RayyanKhan19/study-sprint

## AI-Assisted Development

AI was used as a coding assistant to:
- generate the initial app structure,
- create database integration,
- build CRUD operations,
- improve the UI,
- troubleshoot issues,
- and prepare documentation.

Before submission, review the generated code and run the test steps above against the deployed application. Live testing requires your Supabase project configuration.

## What the App Does

Study Sprint gives students a fast way to organize schoolwork. Users can keep a small list of assignments, identify high-priority work, set deadlines, and mark tasks complete. The database keeps the task list persistent across page refreshes and devices.
