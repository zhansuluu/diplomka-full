/**
 * API INTEGRATION PATTERNS & EXAMPLES
 * Production-Ready Code Templates for Each Page
 */

// ============================================================================
// PATTERN 1: FETCH LIST DATA (Internships, Companies, Students)
// ============================================================================

import { useAsyncData } from "../../hooks/useAsyncData";
import { internshipService } from "../../api";

export const ExampleListPage = () => {
  const { data, loading, error, refetch } = useAsyncData(
    () => internshipService.listInternships(undefined, 50, 0),
    [] // dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};

// ============================================================================
// PATTERN 2: FETCH SINGLE ITEM (Profile, Detail Page)
// ============================================================================

import { useParams } from "react-router-dom";

export const ExampleDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: internship, loading, error } = useAsyncData(
    () => internshipService.getInternship(id!),
    [id]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!internship) return <div>Not found</div>;

  return <div>{internship.title}</div>;
};

// ============================================================================
// PATTERN 3: MUTATION (CREATE/UPDATE/DELETE)
// ============================================================================

import { useAsyncMutation } from "../../hooks/useAsyncData";

export const ExampleFormPage = () => {
  const { execute: createInternship, loading } = useAsyncMutation(
    (title: string, description: string) =>
      internshipService.createInternship({
        companyId: "company-id",
        title,
        description,
        requirements: "req",
        startDate: "2024-01-01",
        endDate: "2024-03-01",
      })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createInternship("Title", "Desc");
      console.log("Created:", result);
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

// ============================================================================
// PATTERN 4: AUTHENTICATED REQUEST (with Bearer token)
// ============================================================================

import { useAuthContext } from "../../contexts/AuthContext";

export const ExampleAuthPage = () => {
  const { isAuthenticated, user } = useAuthContext();

  const { data: profile, loading } = useAsyncData(
    () => userService.getProfile(user?.id!),
    [user?.id] // refetch when user changes
  );

  if (!isAuthenticated) return <div>Please login</div>;
  if (loading) return <div>Loading profile...</div>;

  return <div>Welcome {profile?.firstName}</div>;
};

// ============================================================================
// APPLICATION CHECKLIST
// ============================================================================

/**
 * ✓ Student/Internships.tsx - DONE (mock → API)
 * □ Student/Favorites.tsx - Replace mock with studentService.getFollowedCompanies()
 * □ Student/Profile.tsx - Use studentService.getStudent(userId)
 * □ Company/Candidates.tsx - Use companyService.getCompany(companyId) + fetch submissions
 * □ Company/CompanyDashboard.tsx - Use internshipService.listInternships(companyId)
 * □ Landing/LandingPage.tsx - Use companyService.listCompanies() for showcase
 *
 * AUTH FLOW:
 * □ Verify AuthContext.tsx login() uses studentService/companyService correctly
 * □ Test token storage and retrieval in localStorage
 * □ Test logout clears token and redirects to /auth/login
 *
 * ERROR HANDLING:
 * □ Wrap pages with <ErrorBoundary>
 * □ Add try-catch in mutation handlers
 * □ Show user-friendly error messages
 *
 * PRODUCTION CHECKLIST:
 * □ Set VITE_API_URL to production domain in .env.production
 * □ Test all API calls with real backend
 * □ Verify token refresh mechanism (if needed)
 * □ Add loading skeletons for better UX
 * □ Test error states (network down, 401 unauthorized, etc)
 */
