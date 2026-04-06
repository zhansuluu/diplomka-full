// Example component showing how to use the API integration

import { useEffect, useState } from "react";
import { companyService, internshipService, studentService } from "./src/api/services";
import { useAuth } from "./src/contexts/AuthContext";
import type { CompanyResponse, InternshipResponse, StudentResponse, CompanyResponse as CompanyType } from "./src/api/types";

/**
 * Example 1: Fetching a list of companies (public endpoint)
 */
export function CompaniesListExample() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyService.listCompanies(10, 0);
        setCompanies(data.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch companies";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Companies</h2>
      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <h3>{company.companyName}</h3>
              <p>{company.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 2: Using authentication context
 */
export function UserProfileExample() {
  const { isAuthenticated, userRole, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in first</div>;
  }

  const displayName =
    userRole === "student" && user && "firstName" in user
      ? `${(user as StudentResponse).firstName} ${(user as StudentResponse).lastName}`
      : userRole === "company" && user && "companyName" in user
        ? (user as CompanyType).companyName
        : "User";

  return (
    <div>
      <h2>Welcome, {displayName}!</h2>
      <p>Role: {userRole}</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

/**
 * Example 3: Fetching data based on authentication
 */
export function InternshipsListExample() {
  const { isAuthenticated, userRole, user } = useAuth();
  const [internships, setInternships] = useState<InternshipResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);

        // If user is a company, fetch their internships
        let companyId: string | undefined;
        if (isAuthenticated && userRole === "company" && user && "id" in user) {
          companyId = (user as CompanyType).id;
        }

        const data = await internshipService.listInternships(companyId, 20, 0);
        setInternships(data.items);
      } catch (err) {
        console.error("Error fetching internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [isAuthenticated, userRole, user]);

  if (loading) return <div>Loading internships...</div>;

  return (
    <div>
      <h2>Available Internships ({internships.length})</h2>
      {internships.map((internship) => (
        <div key={internship.id}>
          <h3>{internship.title}</h3>
          <p>{internship.description}</p>
          <p>Duration: {internship.startDate} to {internship.endDate}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 4: Creating a resource with error handling
 */
export function CreateEducationExample({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      await studentService.addEducation(studentId, {
        institutionName: formData.get("institution") as string,
        degree: formData.get("degree") as string,
        fieldOfStudy: formData.get("field") as string,
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        gpa: formData.get("gpa") as string,
      });

      setSuccess(true);
      (e.currentTarget as HTMLFormElement).reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add education";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Education added successfully!</div>}
      
      <input
        type="text"
        name="institution"
        placeholder="Institution Name"
        required
      />
      
      <input
        type="text"
        name="degree"
        placeholder="Degree"
        required
      />
      
      <input
        type="text"
        name="field"
        placeholder="Field of Study"
        required
      />
      
      <input
        type="date"
        name="startDate"
        required
      />
      
      <input
        type="date"
        name="endDate"
      />
      
      <input
        type="number"
        name="gpa"
        placeholder="GPA"
        step="0.01"
      />
      
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Education"}
      </button>
    </form>
  );
}

/**
 * Example 5: Following/Unfollowing companies
 */
export function CompanyFollowExample({ companyId }: { companyId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await studentService.unfollowCompany(companyId);
        setIsFollowing(false);
      } else {
        await studentService.followCompany(companyId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={isFollowing ? "following" : ""}
    >
      {loading
        ? "Loading..."
        : isFollowing
          ? "Following"
          : "Follow Company"}
    </button>
  );
}
