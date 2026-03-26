import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const TracksPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Tracks Management</h1>
          <p className="text-white/40 mt-2">TEST - Tracks pagina laadt!</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TracksPage;
