import React, { useContext } from 'react'
import { Routes, Route, useLocation, useMatch } from 'react-router-dom'
import Navbar from './components/student/Navbar'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import CoursesList from './pages/student/CoursesList'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Educator from './pages/educator/Educator'
import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'
import Admin from './pages/admin/Admin'
import AdminDashboard from './pages/admin/AdminDashboard'
import EducatorRequests from './pages/admin/EducatorRequests'
import AllEducators from './pages/admin/AllEducators'
import AdminLogin from './pages/admin/AdminLogin'
import { AdminProvider } from './context/AdminContext'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*');
  const isAdminRoute = useMatch('/admin/*');

  return (
    <AdminProvider>
      <div className="text-default min-h-screen bg-white">
        <ToastContainer />
        {/* Render Student Navbar only if not on educator routes */}
        {!isEducatorRoute && !isAdminRoute && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />
          <Route path='/educator' element={<Educator />}>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin' element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          }>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='educator-requests' element={<EducatorRequests />} />
            <Route path='all-educators' element={<AllEducators />} />
          </Route>
        </Routes>
      </div>
    </AdminProvider>
  )
}

export default App