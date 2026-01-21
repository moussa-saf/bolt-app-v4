import * as Icons from 'lucide-react';
import { DocumentType } from '../lib/supabase';

interface DocumentTypeCardProps {
  documentType: DocumentType;
  onClick: () => void;
  count?: number;
}

export default function DocumentTypeCard({ documentType, onClick, count }: DocumentTypeCardProps) {
  const IconComponent = Icons[documentType.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-emerald-400 group w-full transform hover:scale-105 hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 group-hover:from-emerald-100 group-hover:to-teal-100 transition-all duration-300 p-4 rounded-xl shadow-sm group-hover:shadow-md">
          {IconComponent && <IconComponent className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{documentType.name_fr}</h3>
          <p className="text-xs text-gray-600 mt-1 rtl">{documentType.name_ar}</p>
          {count !== undefined && count > 0 && (
            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full text-xs font-bold shadow-sm animate-pulse-slow">
              {count} document{count > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}