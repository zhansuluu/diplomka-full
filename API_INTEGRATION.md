# API Integration Guide

## Overview
This document describes how to use the integrated REST API in your frontend application.

## Setup

### 1. Environment Configuration
Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:8080
```

### 2. Initialize AuthProvider
The app is already wrapped with `AuthProvider` in `App.tsx`, which manages authentication state globally.

## Available Services

### Auth Service
Located in `src/api/services/auth.ts`

```typescript
import { authService } from "@/api";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password123"
});

// Logout
authService.logout();

// Get current token
const token = authService.getToken();

// Set token manually
authService.setToken("token_string");
```

### Student Service
Located in `src/api/services/student.ts`

```typescript
import { studentService } from "@/api";

// List students
const response = await studentService.listStudents(limit, offset);

// Create student
const student = await studentService.createStudent(studentData);

// Get student by ID
const student = await studentService.getStudent(studentId);

// Update student
await studentService.updateStudent(studentId, updateData);

// Delete student
await studentService.deleteStudent(studentId);

// Education endpoints
const education = await studentService.addEducation(studentId, educationData);
await studentService.updateEducation(studentId, educationId, updateData);
await studentService.deleteEducation(studentId, educationId);

// Experience endpoints
const experience = await studentService.addExperience(studentId, experienceData);
await studentService.updateExperience(studentId, experienceId, updateData);
await studentService.deleteExperience(studentId, experienceId);

// Company follow endpoints
await studentService.followCompany(companyId);
await studentService.unfollowCompany(companyId);
const followedCompanies = await studentService.getFollowedCompanies(limit, offset);
```

### Company Service
Located in `src/api/services/company.ts`

```typescript
import { companyService } from "@/api";

// List companies
const response = await companyService.listCompanies(limit, offset);

// Create company
const company = await companyService.createCompany(companyData);

// Get company by ID
const company = await companyService.getCompany(companyId);

// Update company
await companyService.updateCompany(companyId, updateData);

// Delete company
await companyService.deleteCompany(companyId);

// Get company followers
const followers = await companyService.getFollowers(companyId, limit, offset);
```

### Internship Service
Located in `src/api/services/internship.ts`

```typescript
import { internshipService } from "@/api";

// List internships
const response = await internshipService.listInternships(companyId, limit, offset);

// Create internship
const internship = await internshipService.createInternship(internshipData);

// Get internship by ID
const internship = await internshipService.getInternship(internshipId);

// Update internship
await internshipService.updateInternship(internshipId, updateData);

// Delete internship
await internshipService.deleteInternship(internshipId);
```

## Using Auth Context

The `useAuth()` hook provides authentication state and methods:

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { 
    isAuthenticated,  // boolean
    isLoading,        // boolean (initial auth check)
    userRole,         // 'student' | 'company' | null
    user,             // StudentResponse | CompanyResponse | null
    login,            // function
    logout,           // function
    setUser           // function
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login("email@example.com", "password");
      // User is now logged in
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.firstName || user?.companyName}!</p>
          <p>Role: {userRole}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Using Auth API Hook

For more control over auth operations, use the `useAuthApi()` hook:

```typescript
import { useAuthApi } from "@/hooks/useAuthApi";

function LoginForm() {
  const { login, signup, logout, isLoading, error } = useAuthApi();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { role, user } = await login(email, password);
      console.log(`Logged in as ${role}:`, user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleSignup = async (studentData: CreateStudentRequest) => {
    try {
      const user = await signup(studentData, "student");
      console.log("Signed up:", user);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={() => handleLogin("test@example.com", "password")} disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}
```

## Type Definitions

All types are available from `src/api/types.ts`:

```typescript
import {
  StudentResponse,
  CompanyResponse,
  InternshipResponse,
  EducationItem,
  ExperienceItem,
  // ... and many more
} from "@/api";
```

## Error Handling

The API client automatically handles:
- **401 Unauthorized**: Clears token and redirects to login
- **Network errors**: Throws error with descriptive message
- **HTTP errors**: Returns error with status code and message

```typescript
try {
  await studentService.getStudent(id);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}
```

## Authentication Flow

1. User logs in with email and password
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically added to all subsequent requests
5. On page refresh, auth state is restored from stored token
6. If token is invalid (401), user is redirected to login

## Protected Routes

Create a protected route component:

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "student" | "company" }) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login/student" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

## Example: Complete Login Component

```typescript
import { useAuthApi } from "@/hooks/useAuthApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

function LoginStudent() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { login, isLoading, error } = useAuthApi();

  useEffect(() => {
    if (isAuthenticated && userRole === "student") {
      navigate("/student/dashboard");
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { role } = await login(email, password);
      if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/company/dashboard");
      }
    } catch (err) {
      // Error is handled in the component via the error state
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />
      
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        disabled={isLoading}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## Testing the API

Use the provided API in your components:

```typescript
import { useEffect, useState } from "react";
import { companyService } from "@/api";
import { CompanyResponse } from "@/api/types";

function CompanyList() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.listCompanies(10, 0);
        setCompanies(data.items);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {companies.map(company => (
        <div key={company.id}>
          <h3>{company.companyName}</h3>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Important Notes

1. **Token Storage**: Tokens are stored in localStorage. For production, consider using more secure storage methods.
2. **CORS**: Ensure your backend is configured to accept requests from your frontend URL.
3. **Token Expiration**: The API returns `expiresIn` from login. You may want to implement token refresh logic.
4. **Error Messages**: Check the browser console for detailed error messages and network requests.
