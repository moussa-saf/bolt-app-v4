import { Filter, X, Calendar } from 'lucide-react';
import { Wilaya } from '../lib/supabase';

interface FilterSectionProps {
  wilayas: Wilaya[];
  selectedWilaya: number | null;
  selectedStatus: string;
  dateFrom: string;
  dateTo: string;
  onWilayaChange: (wilayaId: number | null) => void;
  onStatusChange: (status: string) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClearFilters: () => void;
}

export default function FilterSection({
  wilayas,
  selectedWilaya,
  selectedStatus,
  dateFrom,
  dateTo,
  onWilayaChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters
}: FilterSectionProps) {
  const hasActiveFilters = selectedWilaya !== null || selectedStatus !== 'all' || dateFrom !== '' || dateTo !== '';

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wilaya
          </label>
          <select
            value={selectedWilaya || ''}
            onChange={(e) => onWilayaChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">Toutes les wilayas</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya.id} value={wilaya.id}>
                {wilaya.code} - {wilaya.name_fr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="claimed">Réclamé</option>
            <option value="returned">Restitué</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          Date d'ajout
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Du</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              max={dateTo || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Au</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              min={dateFrom}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedWilaya && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              {wilayas.find(w => w.id === selectedWilaya)?.name_fr}
              <button
                onClick={() => onWilayaChange(null)}
                className="ml-2 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {selectedStatus === 'available' && 'Disponible'}
              {selectedStatus === 'claimed' && 'Réclamé'}
              {selectedStatus === 'returned' && 'Restitué'}
              <button
                onClick={() => onStatusChange('all')}
                className="ml-2 hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          {(dateFrom || dateTo) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <Calendar className="w-3 h-3 mr-1" />
              {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : dateFrom ? `Depuis ${dateFrom}` : `Jusqu'à ${dateTo}`}
              <button
                onClick={() => {
                  onDateFromChange('');
                  onDateToChange('');
                }}
                className="ml-2 hover:text-purple-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
