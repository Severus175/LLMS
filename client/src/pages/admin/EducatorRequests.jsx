import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const EducatorRequests = () => {

  const { getAuthHeaders, backendUrl } = useAdmin()

  const [requests, setRequests] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/educator-requests',
        { headers: getAuthHeaders() }
      )

      if (data.success) {
        setRequests(data.requests)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const approveRequest = async (requestId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/approve-educator',
        { requestId },
        { headers: getAuthHeaders() }
      )

      if (data.success) {
        toast.success(data.message)
        fetchRequests()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const rejectRequest = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/reject-educator',
        { requestId: selectedRequest._id, reason: rejectionReason },
        { headers: getAuthHeaders() }
      )

      if (data.success) {
        toast.success(data.message)
        setShowRejectModal(false)
        setSelectedRequest(null)
        setRejectionReason('')
        fetchRequests()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReject = (request) => {
    setSelectedRequest(request)
    setShowRejectModal(true)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return requests ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <h2 className="p-4 text-lg font-medium w-full border-b border-gray-500/20">Educator Requests</h2>
        <table className="table-fixed md:table-auto w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Request Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {requests.map((request, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={request.userId.imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{request.userId.name}</span>
                </td>
                <td className="px-4 py-3 truncate">{request.userId.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveRequest(request._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Educator Request</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject {selectedRequest?.userId.name}'s educator request?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setSelectedRequest(null)
                  setRejectionReason('')
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={rejectRequest}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : <Loading />
};

export default EducatorRequests;