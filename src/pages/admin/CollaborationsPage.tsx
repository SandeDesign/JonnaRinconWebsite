import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useCollaborations } from '../../hooks/useCollaborations';
import { CollaborationStatus } from '../../lib/firebase/types';

const CollaborationsPage: React.FC = () => {
  const { collaborations, loading } = useCollaborations();

  const getStatusColor = (status: CollaborationStatus) => {
    const colors: Record<CollaborationStatus, string> = {
      inquiry: 'bg-gray-500/20 text-gray-400',
      negotiating: 'bg-yellow-500/20 text-yellow-400',
      agreed: 'bg-blue-500/20 text-blue-400',
      contract_sent: 'bg-purple-500/20 text-purple-400',
      signed: 'bg-green-500/20 text-green-400',
      in_progress: 'bg-cyan-500/20 text-cyan-400',
      completed: 'bg-green-600/20 text-green-500',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Collaborations & Contracts</h1>
          <p className="text-gray-400 mt-2">Manage partnerships and deals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-2xl font-bold text-white mt-1">{collaborations.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {collaborations.filter(c => ['agreed', 'contract_sent', 'signed', 'in_progress'].includes(c.status)).length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {collaborations.filter(c => c.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-white mt-1">
              €{collaborations.reduce((sum, c) => sum + c.paidAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Collaborations List */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : collaborations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No collaborations yet</td>
                  </tr>
                ) : (
                  collaborations.map((collab) => (
                    <tr key={collab.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{collab.title}</p>
                        <p className="text-sm text-gray-400">{collab.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{collab.clientName}</p>
                        <p className="text-sm text-gray-400">{collab.clientEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                          {collab.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {collab.budget ? `€${collab.budget.toFixed(2)}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(collab.status)}`}>
                          {collab.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white">€{collab.paidAmount.toFixed(2)}</p>
                          <p className={`text-sm ${
                            collab.paymentStatus === 'paid' ? 'text-green-400' :
                            collab.paymentStatus === 'partial' ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {collab.paymentStatus}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollaborationsPage;
