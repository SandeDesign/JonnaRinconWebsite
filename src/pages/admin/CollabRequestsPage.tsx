import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Check, X, Clock, Handshake } from 'lucide-react';

interface CollabRequest {
  id: string;
  artistId: string;
  artistName: string;
  artistEmail: string;
  title: string;
  type: string;
  description: string;
  budget: number | null;
  preferredStartDate: string | null;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

const CollabRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CollabRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    const requestsRef = collection(db, 'collabRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs: CollabRequest[] = [];
      snapshot.forEach((doc) => {
        reqs.push({ id: doc.id, ...doc.data() } as CollabRequest);
      });
      setRequests(reqs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (request: CollabRequest) => {
    try {
      // Create collaboration from the request
      await addDoc(collection(db, 'collaborations'), {
        clientName: request.artistName,
        clientEmail: request.artistEmail,
        assignedTo: request.artistId,
        title: request.title,
        type: request.type,
        description: request.description,
        budget: request.budget || 0,
        paidAmount: 0,
        paymentStatus: 'unpaid',
        status: 'inquiry',
        startDate: request.preferredStartDate ? new Date(request.preferredStartDate) : null,
        deadline: null,
        endDate: null,
        contractPDF: null,
        attachments: [],
        notes: request.message || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update request status
      await updateDoc(doc(db, 'collabRequests', request.id), {
        status: 'approved',
      });

      alert('✅ Request approved and collaboration created!');
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('❌ Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
      await updateDoc(doc(db, 'collabRequests', requestId), {
        status: 'rejected',
      });
      alert('✅ Request rejected');
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('❌ Failed to reject request');
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to permanently delete this request?')) return;

    try {
      await deleteDoc(doc(db, 'collabRequests', requestId));
      alert('✅ Request deleted');
    } catch (error) {
      console.error('Failed to delete request:', error);
      alert('❌ Failed to delete request');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Collaboration Requests</h1>
          <p className="text-gray-400 mt-2">Review and approve collaboration requests from artists</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{requests.length}</p>
          </div>
          <div className="bg-gray-800 border border-yellow-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400 mt-1">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-green-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Approved</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-red-600 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-400 mt-1">
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b border-gray-700">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 capitalize transition ${
                filter === status
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
              <span className="ml-2 text-sm">
                (
                {status === 'all'
                  ? requests.length
                  : requests.filter((r) => r.status === status).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center text-gray-400">
              Loading requests...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
              <Handshake size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No {filter !== 'all' ? filter : ''} requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-gray-800 border rounded-xl p-6 ${
                  request.status === 'pending' ? 'border-yellow-600' :
                  request.status === 'approved' ? 'border-green-600' :
                  'border-red-600'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{request.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          request.status === 'approved' ? 'bg-green-900 text-green-300' :
                          'bg-red-900 text-red-300'
                        }`}
                      >
                        {request.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                        {request.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-white">{request.artistName}</p>
                      <p>{request.artistEmail}</p>
                      <p className="text-xs mt-1">
                        Submitted: {request.createdAt?.toDate?.()?.toLocaleString() || 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition flex items-center gap-2"
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition flex items-center gap-2"
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status !== 'pending' && (
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm transition"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-900 rounded-lg">
                  <div>
                    <span className="text-gray-400 text-sm">Type:</span>
                    <p className="text-white font-medium capitalize">{request.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Budget:</span>
                    <p className="text-white font-medium">
                      {request.budget ? `€${request.budget.toFixed(2)}` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Preferred Start:</span>
                    <p className="text-white font-medium">
                      {request.preferredStartDate
                        ? new Date(request.preferredStartDate).toLocaleDateString()
                        : 'Flexible'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Artist ID:</span>
                    <p className="text-white font-mono text-xs">{request.artistId.slice(0, 8)}...</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-200 bg-gray-900 p-4 rounded-lg">{request.description}</p>
                </div>

                {/* Message */}
                {request.message && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Additional Message</h4>
                    <p className="text-gray-200 bg-gray-900 p-4 rounded-lg">{request.message}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollabRequestsPage;
