import { useState, useEffect } from 'react';
import { X, FileText, MessageSquare, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import AdminDocumentsList from './AdminDocumentsList';
import AdminTestimonialsList from './AdminTestimonialsList';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Stats {
  pendingDocuments: number;
  approvedDocuments: number;
  pendingTestimonials: number;
  approvedTestimonials: number;
  totalUsers: number;
}

type TabType = 'documents' | 'testimonials' | 'stats';

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [stats, setStats] = useState<Stats>({
    pendingDocuments: 0,
    approvedDocuments: 0,
    pendingTestimonials: 0,
    approvedTestimonials: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [docsResult, approvedDocsResult, testimonialsResult, approvedTestimonialsResult] = await Promise.all([
        supabase.from('found_documents').select('id', { count: 'exact' }).eq('is_approved', false),
        supabase.from('found_documents').select('id', { count: 'exact' }).eq('is_approved', true),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_approved', false),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_approved', true),
      ]);

      setStats({
        pendingDocuments: docsResult.count || 0,
        approvedDocuments: approvedDocsResult.count || 0,
        pendingTestimonials: testimonialsResult.count || 0,
        approvedTestimonials: approvedTestimonialsResult.count || 0,
        totalUsers: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h2>
            <p className="text-sm text-gray-600 mt-1">Gérez les documents et témoignages</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Documents en attente</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingDocuments}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Documents approuvés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approvedDocuments}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Témoignages en attente</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingTestimonials}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Témoignages approuvés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approvedTestimonials}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'documents'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Documents ({stats.pendingDocuments})</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'testimonials'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Témoignages ({stats.pendingTestimonials})</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'stats'
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Statistiques</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'documents' && <AdminDocumentsList onUpdate={loadStats} />}
              {activeTab === 'testimonials' && <AdminTestimonialsList onUpdate={loadStats} />}
              {activeTab === 'stats' && (
                <div className="text-center py-12 text-gray-600">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Statistiques détaillées à venir</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
