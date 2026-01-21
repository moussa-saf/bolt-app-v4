import { useState, useEffect } from 'react';
import { X, FileText, MapPin, Calendar, Image as ImageIcon, Pencil, Loader } from 'lucide-react';
import { supabase, FoundDocument } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import EditDocumentModal from './EditDocumentModal';

interface MyDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyDocumentsModal({ isOpen, onClose }: MyDocumentsModalProps) {
  const [documents, setDocuments] = useState<FoundDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDocument, setEditingDocument] = useState<FoundDocument | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMyDocuments();
    }
  }, [isOpen]);

  const loadMyDocuments = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from('found_documents')
        .select(`
          *,
          document_types(*),
          wilayas(*)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading my documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes documents</h2>
            <p className="text-sm text-gray-600 mt-1">Documents que j'ai signalés</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <LoadingSpinner />
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Vous n'avez signalé aucun document</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`border-2 rounded-lg p-4 ${
                    doc.is_approved
                      ? 'border-green-200 bg-green-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              {doc.document_types?.name_fr}
                            </span>
                            {doc.case_number && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {doc.case_number}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded ${
                              doc.is_approved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {doc.is_approved ? 'Approuvé' : 'En attente'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 rtl">{doc.document_types?.name_ar}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <span className="font-medium">Initiales:</span>
                          <span>{doc.owner_name}</span>
                        </div>
                        {doc.document_number && (
                          <div className="flex items-center space-x-2 text-gray-700">
                            <span className="font-medium">N°:</span>
                            <span>{doc.document_number}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{doc.wilayas?.name_fr}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{new Date(doc.found_date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Lieu:</span> {doc.found_location}
                      </div>

                      {doc.additional_info && (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">Info:</span> {doc.additional_info}
                        </div>
                      )}

                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Contact:</span> {doc.finder_contact}
                      </div>

                      {doc.image_url && (
                        <button
                          onClick={() => setSelectedImage(doc.image_url!)}
                          className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Voir l'image</span>
                        </button>
                      )}

                      <div className="text-xs text-gray-500">
                        Créé le {new Date(doc.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingDocument(doc)}
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img
              src={selectedImage}
              alt="Document"
              className="max-w-full max-h-screen rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <EditDocumentModal
        isOpen={!!editingDocument}
        document={editingDocument}
        onClose={() => setEditingDocument(null)}
        onSuccess={loadMyDocuments}
      />
    </div>
  );
}
