import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const AllEducators = () => {

  const { getAuthHeaders, backendUrl } = useAdmin()

  const [educators, setEducators] = useState(null)

  const fetchEducators = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/educators',
        { headers: getAuthHeaders() }
      )

      if (data.success) {
        setEducators(data.educators)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchEducators()
  }, [])

  return educators ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <h2 className="p-4 text-lg font-medium w-full border-b border-gray-500/20">All Educators</h2>
        <table className="table-fixed md:table-auto w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Educator</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Joined Date</th>
              <th className="px-4 py-3 font-semibold">Approved Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {educators.map((educator, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={educator.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{educator.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{educator.email}</td>
                <td className="px-4 py-3">{new Date(educator.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(educator.approvedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
};

export default AllEducators;