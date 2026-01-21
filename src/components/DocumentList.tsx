import { Calendar, MapPin, FileText, Phone, Edit } from 'lucide-react';
import { FoundDocument } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface DocumentListProps {
  documents: FoundDocument[];
  onClaim: (document: FoundDocument) => void;
  onEdit: (document: FoundDocument) => void;
  user: User | null;
}

export default function DocumentList({ documents, onClaim, onEdit, user }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucun document trouvé pour cette catégorie</p>
        <p className="text-sm text-gray-400 mt-2">لم يتم العثور على أي وثيقة</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 animate-fadeIn"
        >
          <div className="flex flex-col sm:flex-row gap-0">
            {doc.image_url && (
              <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100">
                <img
                  src={doc.image_url}
                  alt={`${doc.owner_name} - ${doc.document_types?.name_fr}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 text-lg">{doc.owner_name}</h3>
                    {doc.case_number && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-mono font-semibold shadow-sm">
                        {doc.case_number}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {doc.document_types?.name_fr}
                    {doc.document_number && (
                      <span className="ml-2 text-gray-500">• N° {doc.document_number}</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>
                      {doc.wilayas?.name_fr} - {doc.found_location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>
                      Trouvé le {new Date(doc.found_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {doc.additional_info && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {doc.additional_info}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {user && doc.status === 'available' && (
                  <button
                    onClick={() => onClaim(doc)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 whitespace-nowrap transform hover:scale-105"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Réclamer</span>
                  </button>
                )}
                {doc.status !== 'available' && (
                  <div className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-semibold text-center">
                    Document {doc.status === 'claimed' ? 'réclamé' : 'restitué'}
                  </div>
                )}
                {user && doc.created_by === user.id && (
                  <button
                    onClick={() => onEdit(doc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 text-sm shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}