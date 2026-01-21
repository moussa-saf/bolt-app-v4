import { useState, useEffect } from 'react';
import { FileCheck, Users, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Statistics {
  totalDocuments: number;
  claimedDocuments: number;
  activeWilayas: number;
  thisMonth: number;
}

export default function StatisticsSection() {
  const [stats, setStats] = useState<Statistics>({
    totalDocuments: 0,
    claimedDocuments: 0,
    activeWilayas: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const { data: allDocs } = await supabase
        .from('found_documents')
        .select('status, wilaya_id, created_at')
        .eq('is_deleted', false);

      if (allDocs) {
        const claimed = allDocs.filter(d => d.status === 'claimed' || d.status === 'returned').length;
        const uniqueWilayas = new Set(allDocs.map(d => d.wilaya_id)).size;

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonth = allDocs.filter(d => new Date(d.created_at) >= firstDayOfMonth).length;

        setStats({
          totalDocuments: allDocs.length,
          claimedDocuments: claimed,
          activeWilayas: uniqueWilayas,
          thisMonth
        });
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  const statsData = [
    {
      icon: FileCheck,
      label: 'Documents trouvés',
      value: stats.totalDocuments,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Documents récupérés',
      value: stats.claimedDocuments,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: MapPin,
      label: 'Wilayas actives',
      value: stats.activeWilayas,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Ce mois-ci',
      value: stats.thisMonth,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-emerald-200 group"
          >
            <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-7 h-7 ${stat.iconColor}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 font-medium">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
