# Conference Connect

Conference Connect is a Node.js, Express and EJS conference networking application for attendees, exhibitors and organisers. The current build focuses on the attendee-facing guest login, onboarding flow and delegate home dashboard for PCIM-style event networking.

## Technology

- Node.js
- Express 4
- EJS templates
- Bootstrap 5.3.7 via CDN
- Vanilla JavaScript
- MongoDB driver
- Nodemon for local development

## Local Development

Install dependencies:

```bash
npm install
```

Create a `.env` file with:

```env
PORT=3000
CONNECTIONSTRING=<mongodb connection string>
```

Start the local server:

```bash
npm run watch
```

The `watch` script runs `nodemon db.js`. `db.js` loads environment variables, creates the MongoDB client and starts the Express app. The database connection is currently present but not connected because `client.connect()` is commented out.

## Routes

- `GET /`: Renders the delegate home dashboard from `views/home.ejs`
- `GET /login`: Renders the guest sign-in page from `views/home-guest.ejs`
- `GET /onboarding`: Renders the onboarding form from `views/onboarding.ejs`

## Project Structure

- `app.js`: Express application setup, static assets, body parsing, EJS configuration and router mount
- `db.js`: Environment loading, MongoDB client creation and server startup
- `router.js`: Page route definitions
- `views/`: EJS page templates
- `views/includes/`: Shared EJS includes for head, navbar and footer assets
- `public/css/root.css`: Design tokens and root-level styling
- `public/css/main.css`: Main application styling
- `public/css/MF-theme-style.css`: Messe Frankfurt theme stylesheet, currently not loaded
- `public/js/onboarding.js`: Onboarding selection and validation behaviour
- `public/images/`: PCIM logo and event media assets

## Current Views

- `views/home-guest.ejs`: Guest sign-in page
- `views/onboarding.ejs`: Interest and conference-goal onboarding page
- `views/home.ejs`: Delegate home dashboard with schedule, recommendations, exhibitors and announcements

## Design Direction

- Messe Frankfurt inspired enterprise interface
- Responsive layouts for mobile, tablet and desktop
- Bootstrap components with custom styling in `public/css/main.css`
- Shared EJS includes for common page assets where available
- No inline CSS or inline JavaScript in new feature views
- Keep page sections full width or naturally constrained; reserve cards for repeated content, panels and forms

## Implementation Notes

- Static assets are served from `public/`.
- Bootstrap CSS and JavaScript are loaded from jsDelivr in shared includes.
- New pages should use `views/includes/head.ejs` and `views/includes/footer.ejs` where practical.
- Auth, session handling and persistent user data are not implemented yet.
- Several navbar links point to planned routes that do not currently exist.
