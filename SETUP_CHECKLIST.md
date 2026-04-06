# API Integration Setup Checklist

## ✅ What's Been Set Up

### 1. API Infrastructure
- [x] **Type definitions** (`src/api/types.ts`) - All Swagger DTOs converted to TypeScript
- [x] **API Client** (`src/api/client.ts`) - Base HTTP client with token management
- [x] **Service Layer**:
  - [x] Auth service (`src/api/services/auth.ts`)
  - [x] Company service (`src/api/services/company.ts`)
  - [x] Student service (`src/api/services/student.ts`)
  - [x] Internship service (`src/api/services/internship.ts`)

### 2. Authentication Management
- [x] **AuthContext** (`src/contexts/AuthContext.tsx`) - Global auth state management
- [x] **useAuth hook** - Easy access to auth state
- [x] **useAuthApi hook** (`src/hooks/useAuthApi.ts`) - Auth operations (login, signup, logout)
- [x] **Token persistence** - Tokens saved to localStorage

### 3. Configuration
- [x] **App.tsx** - Wrapped with AuthProvider
- [x] **.env.example** - Environment configuration template
- [x] **Documentation** - Complete API integration guide

## 📋 Next Steps

### 1. Create `.env` File
```bash
cp .env.example .env
# Edit .env with your backend URL
```

### 2. Update Login Pages
Update your login components to use the API:

**File**: `src/pages/auth/LoginStudent.tsx`
```typescript
import { useAuthApi } from "@/hooks/useAuthApi";
import { useNavigate } from "react-router-dom";

export function LoginStudent() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { role } = await login(
        formData.get("email") as string,
        formData.get("password") as string
      );
      
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/company/dashboard");
      }
    } catch (err) {
      // Error is in the error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

### 3. Update Signup Pages
Similar pattern for signup components:

**File**: `src/pages/auth/SignUpStudent.tsx`
```typescript
import { useAuthApi } from "@/hooks/useAuthApi";
import { useNavigate } from "react-router-dom";
import type { CreateStudentRequest } from "@/api/types";

export function SignUpStudent() {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const studentData: CreateStudentRequest = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      // Add other fields as needed
    };

    try {
      await signup(studentData, "student");
      navigate("/student/dashboard");
    } catch (err) {
      // Error is in the error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### 4. Update Logout Page
**File**: `src/pages/auth/LogoutPage.tsx`
```typescript
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate("/landing");
  }, [logout, navigate]);

  return <div>Logging out...</div>;
}
```

### 5. Create Protected Route Component
**File**: `src/components/ProtectedRoute.tsx`
```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "student" | "company";
}) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login/student" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

### 6. Use Protected Routes in App
**File**: `src/App.tsx` (Update routes)
```typescript
import { ProtectedRoute } from "./components/ProtectedRoute";

<Route
  path="/student/*"
  element={
    <ProtectedRoute requiredRole="student">
      <StudentLayout />
    </ProtectedRoute>
  }
/>

<Route
  path="/company/*"
  element={
    <ProtectedRoute requiredRole="company">
      <CompanyLayout />
    </ProtectedRoute>
  }
/>
```

### 7. Update Dashboard Components
**Example**: `src/pages/student/Dashboard.tsx`
```typescript
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { internshipService } from "@/api/services";
import type { InternshipResponse } from "@/api/types";

export function Dashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<InternshipResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const data = await internshipService.listInternships(undefined, 10, 0);
        setInternships(data.items);
      } catch (error) {
        console.error("Error fetching internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      {/* Internships list */}
    </div>
  );
}
```

## 🔒 Security Notes

1. **Token Management**: Tokens are stored in localStorage. For production:
   - Consider using httpOnly cookies
   - Implement token refresh logic
   - Add CSRF protection

2. **Environment Variables**: Never commit `.env` files with sensitive data

3. **CORS**: Ensure backend is configured for your frontend domain

4. **Authentication Headers**: Token is automatically added to all requests except public endpoints

## 🐛 Debugging

1. **Check Network Requests**: Open DevTools → Network tab to see API calls
2. **Check Token**: In console: `localStorage.getItem('accessToken')`
3. **Check Auth State**: In console: Use React DevTools to inspect AuthContext
4. **API Errors**: Check console for error messages and status codes

## 📚 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## ⚠️ Important Files to Update

Priority order for integrating API into your pages:
1. `src/pages/auth/LoginStudent.tsx` - ✅ Critical
2. `src/pages/auth/LoginCompany.tsx` - ✅ Critical
3. `src/pages/auth/SignUpStudent.tsx` - ✅ Critical
4. `src/pages/auth/SignUpCompany.tsx` - ✅ Critical
5. `src/pages/auth/LogoutPage.tsx` - ✅ Critical
6. `src/pages/student/Dashboard.tsx` - ⚠️ High Priority
7. `src/pages/company/CompanyDashboard.tsx` - ⚠️ High Priority
8. Other page components - ℹ️ As needed

## 📞 API Endpoints Quick Reference

| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| **Auth** | - | `/auth/api/v1/login` | - | - |
| **Companies** | `/company/api/v1/companies` | `/company/api/v1/companies` | `/company/api/v1/companies/{id}` | `/company/api/v1/companies/{id}` |
| **Students** | `/student/api/v1/students` | `/student/api/v1/students` | `/student/api/v1/students/{id}` | `/student/api/v1/students/{id}` |
| **Internships** | `/internship/api/v1/internships` | `/internship/api/v1/internships` | `/internship/api/v1/internships/{id}` | `/internship/api/v1/internships/{id}` |
| **Education** | - | `/student/api/v1/students/{id}/education` | `/student/api/v1/students/{id}/education/{educationId}` | `/student/api/v1/students/{id}/education/{educationId}` |
| **Experience** | - | `/student/api/v1/students/{id}/experience` | `/student/api/v1/students/{id}/experience/{experienceId}` | `/student/api/v1/students/{id}/experience/{experienceId}` |
