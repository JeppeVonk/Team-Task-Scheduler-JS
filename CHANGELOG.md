## v0.3.0 (2025-09-22)

### BREAKING CHANGE

- requires React 19+ and Tailwind 4+; project setup and configs changed (vite.config.js replaces postcss/tailwind config files).

### Feat

- **build**: upgrade to React 19, Tailwind 4 and Vite 7

### Fix

- **ui**: correct property names and typos in components

## v0.2.0 (2025-09-15)

### BREAKING CHANGE

- buildSchedule signature and return format have changed

### Feat

- **ui**: add distance removal and switch DistanceForm to table layout
- **ui**: add match removal and switch MatchForm to table layout
- **ui**: improve PlayerForm with task sync, removal, and better table
- **ui**: add task removal and improve TaskForm layout
- **ui**: enhance ScheduleTable with table view and stats
- **scheduler**: port Python scheduling logic to JS and add config
- **app**: initialize project with Vite + React + Tailwind setup

### Fix

- **schedule**: correct argument order when calling buildSchedule
- **html**: add viewport meta tag for responsive layout

### Refactor

- **app**: improve layout and integrate config values
