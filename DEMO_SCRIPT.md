# Study Sprint: 4-minute demo guide

Record the deployed application in a browser with its public URL visible. Use your own words and only describe features you actually demonstrate. Keep passwords and private account settings out of the recording.

## 0:00-0:25 - Introduce your app
Explain that Study Sprint helps students track assignments, due dates, priority, and completion. HTML and CSS provide the interface; JavaScript connects it to a Supabase database. Explain how you used AI to help develop it.

## 0:25-1:10 - Registration, login, logout
Show registration with a demo email you control. Complete email confirmation if required (do not show private email content). Show login, logout, and login again. Practice this flow before recording so it fits the time.

## 1:10-2:15 - Create, read, update
Create a task titled Finish ED2 demo, with a course, due date, priority, and notes. Refresh the page to show it was saved in the database. Edit its title or priority, save, mark complete, and show Open/Done filters.

## 2:15-2:45 - Delete
Add a temporary task, delete it, and show that it disappears. Explain that create, read, update, and delete are the four CRUD operations.

## 2:45-3:15 - Database
Show the Supabase tasks table and the task you created. Point out user_id, title, and completed. Explain that user_id connects each task to its signed-in owner and the database policy restricts access to that owner.

## 3:15-4:10 - Code and repository
Show your public GitHub repository. Explain these files:
- index.html: page structure and login/task forms.
- styles.css: colors, spacing, and responsive layout.
- app.js: login/logout, database operations, and rendering tasks.
- config.js: project URL and browser-safe public key.
- supabase.sql: database table and per-user access policy.
- README.md: description, technologies, setup instructions, deployed link, and video link.
Explain one thing you learned from using AI and testing its work. Show the real commit history.

## After recording
Upload to YouTube as Unlisted. Put the video URL in README.md and commit the change. Submit the public GitHub repository URL in Canvas.
