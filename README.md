# Anime Search App

A fast and accessible anime search app built with **React 18**, **TypeScript**, and **MUI**  & [Jikan API](https://jikan.moe). 

This project was developed to fulfill an interview technical requirement.

## Live Demo

[https://anime-search-app-liard.vercel.app](https://anime-search-app-liard.vercel.app)

---

## Requirement vs Implementation

| Requirement| Status | Implementation Notes|
|-------------------------------------------------------------|--------|------------------------------------------------------------------------|
| Use React 18                                                | ✅     | `"react": "^19.0.0"` in `package.json`                                  |
| Use React Hooks (no class components)                       | ✅     | All components use `useState`, `useEffect`, etc.                      |
| Use TypeScript                                              | ✅     | `.tsx` based project, with strong typings                             |
| Use `react-router-dom`                                      | ✅     | Routing between Search and Detail pages                              |
| Use any HTTP library (axios or fetch)                       | ✅     | `axios` is used inside `services/api.ts`                              |
| Use any UI library (MUI preferred)                          | ✅     | MUI v5 with responsive grid, typography, and skeletons                |
| Search page must support pagination (server-side)           | ✅     | Use `Pagination` component with API’s `last_visible_page`            |
| Search must support instant search with 250ms debounce      | ✅     | Debounced with `setTimeout` in `useEffect` (250ms)                    |

---

## Bonus Features

| Feature| Status | Notes                                                                 |
|-------------------------------------|--------|-----------------------------------------------------------------------|
| Creative UI                         | ✅     | Styled layout, clean card grid, proper spacing                        |
| Skeleton Loading Animations         | ✅     | For both grid and card title                                          |
| Error Handling                      | ✅     | Error message if API fails                                            |
| Edge Case Handling                  | ✅     | “No result found” message|
| Race Condition Handling             | ✅     | Cancels previous API if new query happens before completion           |
| Accessibility (a11y)                | ✅     | `aria-label`, `tabIndex`, `role="button"` for cards                   |
| Persistent Search State                 | ✅     | Search query & page preserved in URL, so users can go back or share the result detail                          |

