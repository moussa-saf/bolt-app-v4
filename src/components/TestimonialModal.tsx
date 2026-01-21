import { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { supabase, FoundDocument } from '../lib/supabase';

interface TestimonialModalProps {
  isOpen: boolean;
  document: FoundDocument | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialModal({ isOpen, document, onClose, onSuccess }: TestimonialModalProps) {
  const [claimerName, setClaimerName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !document) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: testimonialError } = await supabase
        .from('testimonials')
        .insert({
          found_document_id: document.id,
          claimer_name: claimerName.trim(),
          message: message.trim(),
          rating
        });

      if (testimonialError) throw testimonialError;

      const { error: updateError } = await supabase
        .from('found_documents')
        .update({
          testimonial_submitted: true,
          status: 'returned'
        })
        .eq('id', document.id);

      if (updateError) throw updateError;

      alert('✅ Merci pour votre témoignage!\n\nLe document a été marqué comme restitué.');

      setClaimerName('');
      setMessage('');
      setRating(5);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError('Erreur lors de l\'envoi du témoignage. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Merci d'avoir récupéré votre document!</h2>
            <p className="text-emerald-100 text-sm mt-1">Partagez votre expérience avec la communauté</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <p className="text-emerald-900 font-medium">
              Document: {document.document_types?.name_fr}
            </p>
            <p className="text-emerald-700 text-sm mt-1">
              Trouvé à {document.found_location}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vos initiales * (pour rester anonyme)
            </label>
            <input
              type="text"
              value={claimerName}
              onChange={(e) => setClaimerName(e.target.value)}
              placeholder="Ex: A. M."
              required
              maxLength={10}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Seules vos initiales seront affichées publiquement (ex: A. M., K. B.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre évaluation * (cliquez sur les étoiles)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none cursor-pointer active:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600 font-medium">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Très bien'}
                {rating === 3 && 'Bien'}
                {rating === 2 && 'Moyen'}
                {rating === 1 && 'Passable'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre message de remerciement *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Racontez votre expérience et remerciez la personne qui a trouvé votre document..."
              required
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {message.length}/500 caractères
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-blue-900 text-sm">
              Votre témoignage sera vérifié avant publication pour garantir la qualité de la plateforme.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !claimerName.trim() || !message.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Envoyer mon témoignage</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
