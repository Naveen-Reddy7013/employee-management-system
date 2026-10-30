# Tech Stack

- You are building a React application.
- Use TypeScript.
- Use React Router. KEEP the routes in src/App.tsx
- Always put source code in the src folder.
- Put pages into src/pages/
- Put components into src/components/
- The main page (default page) is src/pages/Index.tsx
- UPDATE the main page to include the new components. OTHERWISE, the user can NOT see any components!
- ALWAYS try to use the shadcn/ui library.
- Styling: build the interface from shadcn/ui components (Button, Card, Input, Label, Dialog, Table, Tabs, Badge, Select and so on) and give them the app's look through the theme's color variables. Do NOT hand-style elements with long Tailwind class lists, and do NOT rewrite a shadcn component's own classes. Use Tailwind utility classes only for layout around components (flex, grid, gap, spacing, responsive). If a component you need is not in src/components/ui yet, add it in the shadcn style first, then use it.
- The app has ONE appearance: light. Do NOT create a dark mode, a dark theme, a theme toggle or any `dark:` styles, and do not read `prefers-color-scheme`.
- Quality bar: the interface must be beautiful AND work. Build exactly what the spec asks for, and make every requirement reachable and usable in the UI. Every screen needs a clear layout and hierarchy, consistent spacing, and its empty, loading and error states. No lorem ipsum, and no buttons that do nothing.

Available packages and libraries:

- The lucide-react package is installed for icons.
- The `motion` package is installed for animation (use the pieces in src/components/motion.tsx).
- You ALREADY have ALL the shadcn/ui components and their dependencies installed. So you don't need to install them again.
- You have ALL the necessary Radix UI components installed.
- Use prebuilt components from the shadcn/ui library after importing them. Note that these files shouldn't be edited, so make new components if you need to change them.

# Ready-made pieces (already in the app: use them, do not rebuild them)

- Page frame: wrap the routes in src/App.tsx with `AppShell` (src/components/layout/AppShell.tsx), one `nav` entry per page, and the layout the approved blueprint names: `layout="sidebar"` (the default), `"topbar"` or `"focused"`. A one-screen app can use `"focused"`.
- Every page is a `PageContainer` holding a `PageHeader`, then `Section`s. Headline numbers on a dashboard: `StatCard`.
- Every list, table or data screen has all three states: `EmptyState`, `LoadingState`, `ErrorState` (src/components/states/).
- Entrances: `FadeIn`, `Stagger` with `StaggerItem`, `PageTransition`, `Pressable` (src/components/motion.tsx). One short entrance per section. Never loop an animation.
- Icons: import from `@/lib/icons` first (every name in it exists). Otherwise import the exact name from `lucide-react`. Never use emoji as icons.
- Each of these files begins with a comment showing how to use it. Read it before you use the piece.
- If the user picked a theme, its instructions give the exact values for `src/globals.css` and the font to import. Follow them and keep the variable names.
