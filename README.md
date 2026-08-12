# MLSC Workshop & Sponsor Management Console

A modern, responsive workshop and sponsor management portal built for the **MLSC Web Domain Task — Advanced Analytics Portal: MLSC Workshop & Sponsor Management Portal**.

The application provides a complete management console for workshops and sponsors with dashboard analytics, notifications, workshop discovery, filtering, sorting, persistent watchlists, multi-step registration, validation, registration passes, theme support, responsive layouts, and polished interactive UI.

---

## ✨ Features

## 1. Dashboard & Live Metrics

The dashboard provides a live overview of the workshop ecosystem.

### Dashboard Metrics

- **Total Workshops**
- **Total Sponsors**
- **Registered Attendees**
- **Next Workshop Countdown**

### Dashboard capabilities

- Dynamic workshop count
- Dynamic sponsor count
- Dynamic registration count
- Countdown to the next upcoming workshop
- Upcoming workshop preview
- Live updates through React state
- Responsive metric cards
- Premium dark dashboard design
- Animated visual effects
- Status-based workshop styling

The dashboard acts as the main overview of the MLSC Workshop Console.

---

## 2. Global Notifications

The application includes a centralized notification system using React Context.

### Supported notification types

- Information
- Warning
- Success

### Notification capabilities

- Dismissible notifications
- Workshop-related notifications
- Registration notifications
- Workshop completion notifications
- Full-capacity warnings
- Download notifications
- Persistent dismissed state

Dismissed notification IDs are stored in browser `localStorage`.

### Notification storage

```text
mlsc-dismissed-notifications
```

When a notification is dismissed, its ID is stored and the same notification remains hidden after a page reload.

---

## 3. Workshop & Sponsor Management

The workshop management system provides a complete interface for viewing and managing workshops.

Each workshop contains:

- Workshop ID
- Title
- Date
- Time
- Speaker
- Category
- Sponsor
- Venue
- Mode
- Capacity
- Seats Filled
- Status

### Workshop statuses

- **Upcoming**
- **Ongoing**
- **Completed**

### Workshop actions

Users can:

- View workshop details
- Edit workshops
- Mark workshops as completed
- Add/remove workshops from the watchlist

### Completed workshop behavior

Once a workshop is marked as completed:

- The Edit action disappears
- The workshop cannot be edited
- The Mark Completed action disappears
- Remaining seats are no longer displayed
- The workshop remains viewable
- A completion notification is generated

The application also protects the edit handler itself so a completed workshop cannot be edited programmatically.

---

## 4. Workshop Search, Filtering & Sorting

The workshop management page provides advanced discovery controls.

### Search

Users can search workshops by:

- Workshop title
- Speaker
- Sponsor

### Filters

Workshops can be filtered by:

- Category
- Status
- Mode

### Sorting

Supported sorting includes:

- Default order
- Newest
- Oldest
- Most seats remaining
- Most booked

Filters and sorting operate on the same workshop dataset.

### Empty state

If no workshop matches the selected search/filter combination, the interface displays a clear empty state instead of an empty table.

---

## 5. Responsive Workshop Views

The workshop section adapts to the device size.

### Desktop

Desktop users receive a full workshop table containing:

- Workshop
- Speaker
- Category
- Sponsor
- Seats
- Status
- Actions

### Mobile

On smaller screens, the wide table is replaced with responsive workshop cards.

The mobile cards preserve the important workshop information and actions without requiring horizontal scrolling.

Both desktop and mobile views use the same workshop data and action handlers.

---

## 6. My Watchlist

Users can mark workshops as interesting and save them to a personal watchlist.

### Watchlist capabilities

- Add workshop to watchlist
- Remove workshop from watchlist
- Dedicated My Watchlist page
- Watchlist count badge
- Persistent watchlist
- Watchlist survives page reloads

The watchlist uses `localStorage`.

### Storage key

```text
mlsc-watchlist
```

### Stored format

Only workshop IDs are stored:

```json
[
  "WS-001",
  "WS-007",
  "WS-012"
]
```

Workshop objects are not duplicated in the watchlist.

The main workshop dataset remains the single source of truth.

---

## 7. Multi-Step Workshop Registration

The registration system provides a three-step registration flow.

### Step 1 — Personal Information

The user enters:

- Full Name
- Academic Email
- Year of Study
- Department

### Step 2 — Workshop Selection

The user selects an available workshop.

The UI provides workshop information including:

- Title
- Date
- Speaker
- Category
- Sponsor
- Capacity
- Availability
- Mode

Full workshops cannot be selected.

### Step 3 — Confirmation

The user reviews the registration details before submitting.

The three-step indicator clearly shows the current registration stage.

Users can move between steps without losing their entered information.

---

## 8. Registration Validation & Edge Cases

The registration system performs validation throughout the entire process.

### Validation includes

- Empty name
- Whitespace-only name
- Invalid academic email
- Missing year
- Missing department
- Missing workshop selection
- Full workshop
- Duplicate registration
- Workshop becoming full while the form is open

### Academic email validation

The application uses an institutional email validation rule to prevent personal email addresses from being used.

### Duplicate registration

The same academic email cannot register for the same workshop twice.

However, the same academic email can register for a different workshop.

### Capacity validation

Capacity is checked again at final submission.

For example:

```text
User opens registration
        ↓
Workshop has available seats
        ↓
Another registration fills the workshop
        ↓
User submits registration
        ↓
Latest workshop state is checked
        ↓
Registration is rejected
```

This prevents stale workshop data from allowing an invalid registration.

### Successful registration

After a successful registration:

- Registration state is updated
- Workshop `seatsFilled` is updated
- Dashboard metrics update
- Workshop availability updates
- No page reload is required

---

## 9. Registration Pass

After successful registration, the application generates a professional registration pass.

The pass contains:

### Registrant information

- Full Name
- Academic Email
- Year
- Department

### Workshop information

- Workshop Title
- Category
- Date
- Time
- Mode
- Venue
- Sponsor

### Registration information

- Registration ID
- Issue date

---

### Registration ID

Registration IDs are generated programmatically.

Example:

```text
MLSC-WS-2026-0001
MLSC-WS-2026-0002
MLSC-WS-2026-0003
```

The sequence is generated from the current registration state rather than being hardcoded.

---

### Copy Registration ID

Users can copy the registration ID using the browser Clipboard API.

After successful copying, the interface displays a temporary confirmation state.

---

### Download Registration Pass

Users can download their registration pass as a text file.

The download is generated completely on the client side using:

- `Blob`
- `URL.createObjectURL`
- Temporary download link

No backend service is required for the download.

---

### Registration snapshot

When a registration is completed, the workshop and sponsor information is captured as a snapshot.

This ensures that the registration pass continues to display the correct information from the time of registration even if the workshop is edited later.

---

## 10. Theme Support

The application supports both:

- Light Mode
- Dark Mode

Theme switching does not require a page reload.

The selected theme is persisted using browser storage so the preference remains after refreshing the application.

Theme styling is applied consistently across:

- Dashboard
- Workshop pages
- Registration
- Registration pass
- Forms
- Modals
- Navigation
- Cards
- Empty states

---

## 11. Responsive Navigation

The application provides separate navigation experiences for desktop and mobile.

### Desktop navigation

The desktop layout uses a persistent sidebar containing:

- Dashboard
- Workshops
- My Watchlist
- Registrations
- Sponsors

### Mobile navigation

On smaller screens, the sidebar becomes a navigation drawer.

The mobile drawer supports:

- Hamburger menu
- Open/close animation
- Backdrop overlay
- Escape-key closing
- Automatic close after navigation
- Background scroll locking
- Focus management

The navigation remains accessible without taking up permanent screen space on mobile devices.

---

## 12. Responsive Design & UX Polish

The entire application is optimized for multiple screen sizes.

Tested layouts include:

- 320px mobile
- 375px mobile
- 768px tablet
- 1024px desktop
- 1280px+ desktop

### Responsive improvements

- Mobile navigation drawer
- Responsive workshop cards
- Desktop workshop table
- Full-width mobile filters
- Responsive metric grid
- Responsive registration forms
- Responsive registration pass
- Responsive buttons
- Responsive text
- No intentional horizontal overflow

The UI remains usable across mobile, tablet, laptop, and large desktop displays.

---

## 13. Premium Dashboard UI

The dashboard uses a modern premium dark interface.

### Visual design

The design uses:

- Deep navy backgrounds
- Slate surfaces
- Indigo accents
- Blue gradients
- Purple highlights
- Cyan accents
- Teal accents
- Soft borders
- Subtle shadows
- Rounded cards
- Smooth transitions

### Workshop status colors

| Status | Visual Style |
| --- | --- |
| Upcoming | Blue / Indigo |
| Ongoing | Teal / Emerald |
| Completed | Muted Slate |
| Full | Red warning |

The status-based styling makes it easy to understand the current state of a workshop at a glance.

---

## 14. Animated Dashboard Effects

The dashboard includes subtle animated visual effects to provide a more premium experience.

Animated elements are used as decorative layers and do not interfere with application functionality.

The animated effects:

- Remain behind or around interactive content
- Do not block clicks
- Use `pointer-events-none` where appropriate
- Are responsive
- Avoid creating horizontal overflow
- Preserve text readability

The visual effects complement the dashboard's dark MLSC design instead of replacing the core interface.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- JSX
- Tailwind CSS

## State Management

- React `useState`
- React Context API
- Custom React Hooks

## UI

- Tailwind CSS
- Lucide React
- Framer Motion
- Custom reusable components

## Persistence

- Browser `localStorage`

## Development

- Git
- GitHub
- npm
- Vite

## Deployment

- Vercel

---

# 📁 Project Structure

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── MetricsGrid.jsx
│   │   ├── MetricCard.jsx
│   │   └── ...
│   │
│   ├── registration/
│   │   ├── RegistrationStepIndicator.jsx
│   │   ├── StepPersonalInfo.jsx
│   │   ├── StepWorkshopSelection.jsx
│   │   ├── StepConfirmation.jsx
│   │   ├── RegistrationPass.jsx
│   │   └── ...
│   │
│   ├── workshop/
│   │   ├── WorkshopTable.jsx
│   │   ├── WorkshopControls.jsx
│   │   ├── WorkshopPreview.jsx
│   │   ├── WorkshopDetailsModal.jsx
│   │   ├── WorkshopEditModal.jsx
│   │   └── ...
│   │
│   └── ui/
│
├── context/
│   ├── NotificationContext.jsx
│   ├── WatchlistContext.jsx
│   └── ...
│
├── hooks/
│   ├── useWatchlist.js
│   ├── useWorkshopFilters.js
│   └── ...
│
├── data/
│   ├── workshops.js
│   ├── sponsors.js
│   └── ...
│
├── pages/
│   ├── Dashboard.jsx
│   ├── WorkshopsView.jsx
│   ├── WatchlistView.jsx
│   ├── RegistrationsView.jsx
│   └── ...
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 🧠 Architecture

The application follows a reusable component-based React architecture.

### Core principles

- Centralized workshop data
- Normalized sponsor relationships
- React state as the source of truth
- Context for global notifications
- Context for watchlist state
- Custom hooks for reusable logic
- Reusable UI components
- Separated filtering and sorting logic
- Multi-step registration architecture
- Responsive desktop/mobile representations
- Client-side persistence where appropriate
- No unnecessary state-management library

---

# 🔗 Data Relationships

Workshop and sponsor data are separated.

A workshop references a sponsor using:

```js
sponsorId
```

instead of storing a complete sponsor object inside every workshop.

This keeps the data normalized and makes sponsor updates easier to maintain.

Conceptually:

```text
Workshop
   |
   └── sponsorId
          |
          ↓
       Sponsor
```

---

# 💾 Local Storage

The application uses browser `localStorage` for client-side persistence.

Important storage keys include:

```text
mlsc-dismissed-notifications
mlsc-watchlist
```

---

## Watchlist Storage

Example:

```json
[
  "WS-001",
  "WS-007",
  "WS-012"
]
```

Only workshop IDs are stored.

---

## Notification Storage

Dismissed notification IDs are stored so dismissed notifications remain hidden after a page reload.

---

## Theme Storage

The selected theme preference is also persisted locally.

---

# 🔒 Registration Safety

The registration flow validates information at multiple stages rather than relying only on the final submit button.

The system verifies:

- Required fields
- Academic email format
- Workshop selection
- Workshop capacity
- Duplicate registration
- Latest workshop state

This protects against invalid registrations caused by stale UI state.

---

# 📱 Responsive Behavior

### Desktop

```text
┌──────────────┬─────────────────────────────┐
│              │                             │
│   Sidebar    │       Dashboard Content     │
│              │                             │
│              │                             │
└──────────────┴─────────────────────────────┘
```

### Mobile

```text
┌──────────────────────────────┐
│ Header        ☰              │
├──────────────────────────────┤
│                              │
│      Dashboard Content       │
│                              │
│      Workshop Cards          │
│                              │
└──────────────────────────────┘
```

The mobile navigation drawer opens when the hamburger button is pressed.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

---

## Clone the Repository

```bash
git clone https://github.com/Beast18akash/Mlsc-Dashboard.git
```

Navigate into the project:

```bash
cd Mlsc-Dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

# 📦 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The production build should complete successfully without errors.

---

# 🌐 Deployment

The project is deployed using Vercel.

### Live Application

https://mlsc-dashboard.vercel.app

### GitHub Repository

https://github.com/Beast18akash/Mlsc-Dashboard

---

# 📋 Assignment Context

This project was developed for the:

## MLSC Web Domain Task

**Advanced Analytics Portal — MLSC Workshop & Sponsor Management Portal**

The project demonstrates:

- Frontend architecture
- React component design
- State management
- Data relationships
- Form validation
- Edge-case handling
- Responsive UX
- Interactive dashboards
- Persistent client-side state
- Reusable components
- Modern UI design
- Clean and maintainable code

---

# 🎯 Key Implementation Highlights

### State Management

React state and Context API are used for application-level state.

### Persistence

`localStorage` is used for:

- Watchlist
- Notification dismissal
- Theme preference

### Validation

Registration validation handles both normal user input errors and dynamic workshop-capacity edge cases.

### Responsive UI

Desktop and mobile interfaces use the same underlying data and business logic.

### Component Reusability

The application is divided into reusable components for:

- Dashboard
- Metrics
- Workshops
- Registration
- Modals
- Notifications
- Navigation
- Watchlist
- UI elements

---

# 👨‍💻 Author

## Akash Holsambre

GitHub:

https://github.com/Beast18akash

---

# ⭐ Project

If you find this project interesting, consider giving the repository a star.

---

## 📄 License

This project was created as part of the MLSC Web Domain Task for educational and evaluation purposes.
