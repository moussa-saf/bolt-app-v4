import { AlertCircle, Trash2 } from 'lucide-react';
import { FoundDocument } from '../lib/supabase';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  document: FoundDocument | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  document,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Confirmer la suppression
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Êtes-vous sûr de vouloir supprimer le document <strong>{document.owner_name}</strong> ?
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              ({document.document_types?.name_fr})
            </span>
          </p>

          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6">
            Cette action est irréversible. Le document et sa photo seront complètement supprimés.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Suppression...' : 'Supprimer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
