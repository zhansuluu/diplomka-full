import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import { LoginStudent } from './pages/auth/LoginStudent'
import { LoginCompany } from './pages/auth/LoginCompany'
import { ForgotPassword } from './pages/auth/ForgotPassword'
import { SignUpStudent } from './pages/auth/SignUpStudent'
import { SignUpChoice } from './pages/auth/SignUpChoice'
import { SignUpCompany } from './pages/auth/SignUpCompany'
import { GoogleAuthCallback } from './pages/auth/GoogleAuthCallback'

import { Dashboard } from './pages/student/Dashboard'
import { Profile } from './pages/student/Profile'
import { Internships } from './pages/student/Internships'
import { Favorites } from './pages/student/Favorites'
import { MyInternship } from './pages/student/MyInternship'
import { InternshipDetails } from './pages/student/InternshipDetails'

import { StudentLayout } from './layouts/StudentLayout'
import { StudentAuthOutlet } from './components/StudentAuthOutlet'

import { CompanyLayout } from './layouts/CompanyLayout'
import { CompanyAuthOutlet } from './components/CompanyAuthOutlet'
import { CompanyDashboard } from './pages/company/CompanyDashboard'
import { CreateCase } from './pages/company/CreateCase'
import { MyCases } from './pages/company/MyCases'
import { Submissions } from './pages/company/Submissions'
import { Candidates } from './pages/company/Candidates'
import { Notifications } from './pages/company/Notifications'
import { CompanyProfile } from './pages/company/CompanyProfile'
import { CompanyProfileForStudent } from './pages/company/CompanyProfileForStudent'
import { AICreator } from "./pages/company/AICreator";
import { KanbanBoard } from './pages/student/KanbanBoard';
import { TaskDetailsPage } from './pages/student/TaskDetailsPage';
import { LogoutPage } from './pages/auth/LogoutPage';
import { CandidateProfile } from './pages/company/CandidateProfile'
import { CasePage } from './pages/company/CasePage'
import { LandingPage } from './pages/landing/LandingPage'
import { ReviewSubmission } from './pages/company/ReviewSubmission'
import { CaseDetailPage } from './pages/company/CaseDetailPage'
import { CompanyInternshipEdit } from './pages/company/CompanyInternshipEdit'
import { GuestRoute } from './components/GuestRoute'
import { RequireAuthRoute } from './components/RequireAuthRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route
          path="/login/student"
          element={
            <GuestRoute>
              <LoginStudent />
            </GuestRoute>
          }
        />
        <Route
          path="/login/company"
          element={
            <GuestRoute>
              <LoginCompany />
            </GuestRoute>
          }
        />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUpChoice />
            </GuestRoute>
          }
        />
        <Route
          path="/signup/student"
          element={
            <GuestRoute>
              <SignUpStudent />
            </GuestRoute>
          }
        />
        <Route
          path="/signup/company"
          element={
            <GuestRoute>
              <SignUpCompany />
            </GuestRoute>
          }
        />

        <Route path="/student" element={<StudentLayout />}>
          <Route element={<StudentAuthOutlet />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="internships" element={<Internships />} />
            <Route path="internships/:id" element={<InternshipDetails />} />
            <Route path="company-profile/:companyId" element={<CompanyProfileForStudent />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="my-internship" element={<MyInternship />} />
            <Route path="my-internship/tasks" element={<KanbanBoard />} />
            <Route path="my-internship/tasks/1" element={<TaskDetailsPage />} />
          </Route>
        </Route>

        <Route path="/company" element={<CompanyLayout />}>
          <Route element={<CompanyAuthOutlet />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="create" element={<CreateCase />} />
            <Route path="internships/:id" element={<CompanyInternshipEdit />} />
            <Route path="cases" element={<MyCases />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="ai-creator" element={<AICreator />} />
            <Route path="candidates/1" element={<CandidateProfile />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="cases/:id/tasks" element={<CasePage />} />
            <Route path="review/1" element={<ReviewSubmission />} />
          </Route>
        </Route>

        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/logout"
          element={
            <RequireAuthRoute>
              <LogoutPage />
            </RequireAuthRoute>
          }
        />
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>
    </AuthProvider>
  )
}

export default App
