# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Overview

This is a React + TypeScript + Vite application for managing student income and expenses in an educational setting. The application uses:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin for fast compilation
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: React Context API for sidebar state, local state for main data
- **Routing**: Client-side routing with react-router-dom

## Key Application Structure

### Data Models (`src/types/index.ts`)
- `Parent` - Parent information with contact details
- `Student` - Student linked to parents with teacher/section info
- `IncomeItem` - Fee structures (per_student or per_parent pricing)
- `IncomeTransaction` - Payment records linking parents/students to income items
- `ExpenseTransaction` - Expense records with cost center categorization
- `CostCenter` - Expense categorization system
- `Teacher` - Teacher information with subjects and employee details
- `Section` - Class sections with capacity and teacher assignments
- `User` - System users with authentication and role assignment
- `Role` - User roles with permissions and access control

### Main Application Flow (`src/App.tsx`)
- Single-page application with page-based navigation
- All data stored in React state (no persistence layer)
- Sample data included for development
- Pages: Income Form, Expenses, Reports, KPI Dashboard, Students, Data Management, Settings

### Data Management System (`src/components/Data/`)
- **DataMain** - Main data management dashboard with navigation cards
- **ParentsData** - CRUD operations for parents/guardians with search and filtering
- **StudentsData** - Student management with parent associations
- **TeachersData** - Teacher and section management with tabbed interface
- **ItemsData** - Income item management with pricing types
- **UsersData** - User and role management with permission system
- Each data component includes: search, add, edit, delete, and validation

### Component Architecture
- **Layout Components**: `ResponsiveLayout`, `MobileHeader`, `SideMenu`
- **Feature Components**: Organized by domain (IncomeForm, Expenses, Reports, etc.)
- **UI Components**: Extensive Shadcn/ui component library in `src/components/ui/`
- **Shared Components**: `MainMenu`, `KPIDashboard`, theme provider

### Development Notes
- Uses path alias `@` pointing to `src/` directory
- Configured for development server on `::` (IPv6) port 8080
- Includes TypeScript strict configuration
- ESLint configured with React hooks and refresh plugins
- No test framework currently configured
- No backend/API integration - all data is local state

### State Management Pattern
- Central state management in App.tsx using React hooks
- Data flows down through props to child components
- Event handlers passed down for state updates
- Context used minimally (only for sidebar state)

### UI/UX Features
- Responsive design with mobile-first approach
- Dark mode support configured (defaulted to light)
- Toast notifications for user feedback
- Theme system with CSS custom properties
- Sidebar navigation with mobile drawer pattern