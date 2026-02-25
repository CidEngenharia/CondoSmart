# CondoSmart AI - Development Rules & Tech Stack

## Tech Stack
- **Framework**: React 19 with TypeScript for type-safe component development.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Styling**: Tailwind CSS for utility-first, responsive, and maintainable styling.
- **Backend/Auth**: Supabase for real-time database, authentication, and storage.
- **AI Engine**: Google Gemini AI (`@google/genai`) for LLM, voice concierge, and image generation.
- **UI Components**: Shadcn/UI (Radix UI) for accessible and customizable interface elements.
- **Icons**: Lucide React for consistent and scalable iconography within React components.
- **State Management**: React Hooks (useState, useEffect, useContext) for local and global state.

## Development Rules

### 1. Component Architecture
- **Small Components**: Keep components under 100 lines of code. If a component grows larger, refactor it into smaller sub-components.
- **File Structure**: Every new component or hook must have its own dedicated file in `src/components/` or `src/hooks/`.
- **Naming**: Use PascalCase for component files (e.g., `ProfileCard.tsx`) and camelCase for utility files.

### 2. Styling & UI
- **Tailwind Only**: Use Tailwind CSS classes for all styling. Avoid custom CSS files or inline styles unless absolutely necessary for dynamic values.
- **Shadcn/UI**: Prioritize using existing Shadcn/UI components for inputs, buttons, modals, and complex UI patterns.
- **Responsiveness**: Always design with a mobile-first approach using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.).

### 3. Data & Logic
- **Supabase**: All persistent data (users, condos, residents, vehicles) must be stored in Supabase. Use the client provided in `src/js/supabase.js`.
- **AI Integration**: Use the `geminiService.ts` for all AI-related interactions. Do not hardcode API keys; use environment variables.
- **Error Handling**: Do not use silent try/catch blocks. Allow errors to bubble up or handle them with user-facing toast notifications.

### 4. TypeScript
- **Strict Typing**: Avoid using `any`. Define interfaces or types for all data structures, especially those coming from the database or AI responses.
- **Enums**: Use the existing enums in `src/services/types.ts` for application views, plan types, and user roles.

### 5. Icons
- **Lucide React**: Use `lucide-react` for all new icons in React components to ensure consistency. FontAwesome should only be used if maintaining legacy HTML files.