import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const AdminDashboard = () => {

  const { getAuthHeaders, backendUrl } = useAdmin()

  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/admin/dashboard',
        { headers: getAuthHeaders() }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.patients_icon} alt="users_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalUsers}</p>
              <p className='text-base text-gray-500'>Total Users</p>
            </div>
          </div>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.person_tick_icon} alt="requests_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.pendingRequests}</p>
              <p className='text-base text-gray-500'>Pending Requests</p>
            </div>
          </div>
          <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
            <img src={assets.my_course_icon} alt="educators_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalEducators}</p>
              <p className='text-base text-gray-500'>Total Educators</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Recent Educator Requests</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">User Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Request Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.recentRequests.map((request, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={request.userId.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{request.userId.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{request.userId.email}</td>
                    <td className="px-4 py-3 truncate">{new Date(request.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default AdminDashboard