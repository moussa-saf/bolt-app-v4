import { X, AlertCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase, FoundDocument } from '../lib/supabase';

interface ClaimDocumentModalProps {
  isOpen: boolean;
  document: FoundDocument | null;
  onClose: () => void;
  onSuccess: () => void;
  onTestimonialRequest?: () => void;
}

export default function ClaimDocumentModal({ isOpen, document, onClose, onSuccess, onTestimonialRequest }: ClaimDocumentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    claimer_contact: '',
    verification_info: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('document_claims').insert([
        {
          found_document_id: document.id,
          ...formData,
        },
      ]);

      if (error) throw error;

      await supabase
        .from('found_documents')
        .update({ status: 'claimed' })
        .eq('id', document.id);

      setFormData({
        claimer_contact: '',
        verification_info: '',
      });
      setShowSuccess(true);
      onSuccess();
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleTestimonial = () => {
    setShowSuccess(false);
    onClose();
    if (onTestimonialRequest) {
      onTestimonialRequest();
    }
  };

  if (!isOpen || !document) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 rounded-t-2xl text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Réclamation envoyée!</h2>
            <p className="text-emerald-50">
              Vous serez contacté prochainement
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 text-sm font-medium">
                ⚠️ Important: Lorsque vous récupérez votre document, vous devez laisser un témoignage pour partager votre expérience avec la communauté.
              </p>
            </div>
            <p className="text-gray-700 text-center font-medium">
              Avez-vous déjà récupéré votre document?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Pas encore
              </button>
              <button
                onClick={handleTestimonial}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                Oui, laisser un témoignage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Réclamer ce document</h2>
            <p className="text-sm text-gray-600 mt-1">{document.owner_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informations importantes</p>
              <p>
                Le propriétaire du document vous contactera pour vérifier votre identité.
                Assurez-vous de fournir des informations exactes.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre contact (téléphone ou email) *
            </label>
            <input
              type="text"
              required
              value={formData.claimer_contact}
              onChange={(e) => setFormData({ ...formData, claimer_contact: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0555123456 ou email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations de vérification *
            </label>
            <textarea
              required
              value={formData.verification_info}
              onChange={(e) => setFormData({ ...formData, verification_info: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Fournissez des détails qui prouvent que ce document vous appartient (date de naissance, adresse, numéro complet du document, etc.)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ces informations seront partagées avec la personne qui a trouvé le document
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-medium text-gray-900">Contact de la personne qui a trouvé :</p>
            <p className="text-gray-700">{document.finder_contact}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi...' : 'Envoyer la réclamation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}