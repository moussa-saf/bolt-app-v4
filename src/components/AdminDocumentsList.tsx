import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, MapPin, Calendar, FileText, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { supabase, FoundDocument } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import EditDocumentModal from './EditDocumentModal';

interface AdminDocumentsListProps {
  onUpdate: () => void;
}

export default function AdminDocumentsList({ onUpdate }: AdminDocumentsListProps) {
  const [documents, setDocuments] = useState<FoundDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<FoundDocument | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [showAll]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('found_documents')
        .select(`
          *,
          document_types(*),
          wilayas(*)
        `)
        .order('created_at', { ascending: false });

      if (!showAll) {
        query = query.eq('is_approved', false);
      }

      const { data } = await query;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: string) => {
    setActionLoading(documentId);
    try {
      const { error } = await supabase
        .from('found_documents')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (error) throw error;

      await loadDocuments();
      onUpdate();
    } catch (error) {
      console.error('Error approving document:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter ce document ? Il sera supprimé définitivement.')) {
      return;
    }

    setActionLoading(documentId);
    try {
      const { error } = await supabase
        .from('found_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      await loadDocuments();
      onUpdate();
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert('Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleApproval = async (documentId: string, currentStatus: boolean) => {
    setActionLoading(documentId);
    try {
      const { error } = await supabase
        .from('found_documents')
        .update({
          is_approved: !currentStatus,
          approved_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq('id', documentId);

      if (error) throw error;

      await loadDocuments();
      onUpdate();
    } catch (error) {
      console.error('Error toggling approval:', error);
      alert('Erreur lors de la modification');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce document ?')) {
      return;
    }

    setActionLoading(documentId);
    try {
      const { error } = await supabase
        .from('found_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      await loadDocuments();
      onUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {showAll ? 'Tous les documents' : 'Documents en attente de modération'}
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showAll ? 'Afficher en attente uniquement' : 'Afficher tous les documents'}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Aucun document {!showAll && 'en attente'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`bg-white border-2 rounded-lg p-4 ${
                doc.is_approved ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
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
                        {doc.is_approved ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approuvé</span>
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
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

                  {(doc.original_image_url || doc.image_url) && (
                    <button
                      onClick={() => setSelectedImage(doc.original_image_url || doc.image_url!)}
                      className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Voir l'image {doc.original_image_url ? '(originale)' : ''}</span>
                    </button>
                  )}

                  <div className="text-xs text-gray-500">
                    Créé le {new Date(doc.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  <button
                    onClick={() => setEditingDocument(doc)}
                    disabled={actionLoading === doc.id}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  {!doc.is_approved ? (
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={actionLoading === doc.id}
                      className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approuver</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleApproval(doc.id, doc.is_approved)}
                      disabled={actionLoading === doc.id}
                      className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Retirer</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={actionLoading === doc.id}
                    className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <XCircle className="w-6 h-6 text-gray-700" />
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
        onSuccess={() => {
          loadDocuments();
          onUpdate();
        }}
      />
    </div>
  );
}
