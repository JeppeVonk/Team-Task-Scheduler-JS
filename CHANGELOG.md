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
