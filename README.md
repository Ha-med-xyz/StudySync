# ⬡ StudySync — Study Session Tracker

> A browser-based study tracker for post-secondary students. Log sessions by subject, track streaks, visualize weekly progress, and set daily goals — all without signing up.

[![Watch the video](https://www.youtube.com/watch?v=QUKTKKYkwSY/0.jpg)](https://www.youtube.com/watch?v=QUKTKKYkwSY)

---

## 📌 Project Purpose

StudySync helps students answer a simple question: *"Am I actually studying enough?"*

Most students have no clear picture of how much time they spend per subject. StudySync provides a lightweight, visual solution — no account, no backend, no friction. Open the app, log your session, see your progress.

**Target audience:** College and university students managing multiple subjects across a busy semester.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 Session Logger | Log study sessions by subject, duration, date, and optional notes |
| 📊 Dashboard | View today's hours, current streak, total sessions, and goal progress |
| 📈 Progress Charts | Bar and doughnut charts (Chart.js) showing weekly subject breakdown |
| 🔥 Streak Tracker | Tracks consecutive study days automatically |
| 🎯 Goal Setting | Set a daily hour target with an animated progress bar |
| 💾 Data Persistence | All data saved locally via localStorage — survives refresh |
| 🗑️ Delete Sessions | Remove any logged session directly from the dashboard |

---

## 🚀 Getting Started

### Prerequisites

No installs required. Just a modern browser (Chrome, Firefox, Safari, Edge).

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Ha-med-xyz/StudySync.git
   ```
2. Navigate into the project folder:
   ```bash
   cd StudySync
   ```
3. Open `index.html` in your browser:
   - Double-click the file, **or**
   - Use VS Code with the **Live Server** extension → right-click `index.html` → *Open with Live Server*

### Dependencies

All loaded via CDN — no npm or build step needed:

- [Chart.js](https://cdn.jsdelivr.net/npm/chart.js) — charting library
- [Google Fonts — Syne + DM Mono](https://fonts.google.com) — typography

---

## 🗂️ Project Structure

```
StudySync/
├── index.html       # App structure and all sections (Dashboard, Log, Progress, Goals)
├── style.css        # Full styling — dark theme, responsive layout, animations
└── app.js           # All JavaScript logic — localStorage, charts, form validation
```

---

## 🌿 Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/layout-structure` | HTML structure, CSS styling, base layout |
| `feature/dashboard` | Dashboard section and session display |
| `feature/session-logger` | Log session form and validation |
| `feature/charts` | Chart.js integration (bar + doughnut) |
| `feature/goal-tracker` | Goal setting and progress bar |
| `feature/animations` | CSS animations and toast notifications |

---

## 👥 Team Members

| Member | Role | Contributions |
|---|---|---|
| Nasir Bidhan | Team Lead | GitHub repo setup, Project Board, issue management, PR reviews, merge coordination |
| Anesh Maharaj | Frontend Developer | HTML page structure, CSS layout, responsive design, navbar, section scaffolding |
| Hassan Ahmed / Terry Rose | JavaScript Developer | localStorage logic, session CRUD, streak calculation, form validation, chart rendering |
| Nathaniel Paul | Design Specialist | Dark theme, CSS animations, toast notifications, typography, colour system, accessibility |

---

## 📋 GitHub Project Board

Track our progress here: [📌 StudySync Project Board](https://github.com/Ha-med-xyz/StudySync/projects)

View all issues: [🐛 Issues](https://github.com/Ha-med-xyz/StudySync/issues)

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure
- **CSS3** — custom properties, Flexbox/Grid, keyframe animations
- **JavaScript (ES6)** — DOM manipulation, localStorage, dynamic rendering
- **Chart.js** — data visualization
- **GitHub Pages** — deployment and hosting

---

## 🌐 Live Demo

> _Add your GitHub Pages link here after deployment._
>
> Example: `https://ha-med-xyz.github.io/StudySync`

---

## 💡 Lessons Learned

- Managing collaborative Git workflows with branches and pull requests
- Structuring a single-page app without a framework
- Debugging localStorage persistence across sessions
- Dividing responsibilities clearly while staying unblocked as a team

---

## 📄 License

This project was created for educational purposes as part of a Humber College Web Programming course. Taught and mentored by Professor Dor Zairi. 
