import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface Testimonial {
  id: string;
  claimer_name: string;
  message: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  found_document_id: string;
}

interface AdminTestimonialsListProps {
  onUpdate: () => void;
}

export default function AdminTestimonialsList({ onUpdate }: AdminTestimonialsListProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, [showAll]);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!showAll) {
        query = query.eq('is_approved', false);
      }

      const { data } = await query;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (testimonialId: string) => {
    setActionLoading(testimonialId);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', testimonialId);

      if (error) throw error;

      await loadTestimonials();
      onUpdate();
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (testimonialId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter ce témoignage ? Il sera supprimé définitivement.')) {
      return;
    }

    setActionLoading(testimonialId);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      await loadTestimonials();
      onUpdate();
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      alert('Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleApproval = async (testimonialId: string, currentStatus: boolean) => {
    setActionLoading(testimonialId);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: !currentStatus })
        .eq('id', testimonialId);

      if (error) throw error;

      await loadTestimonials();
      onUpdate();
    } catch (error) {
      console.error('Error toggling approval:', error);
      alert('Erreur lors de la modification');
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
          {showAll ? 'Tous les témoignages' : 'Témoignages en attente de modération'}
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          {showAll ? 'Afficher en attente uniquement' : 'Afficher tous les témoignages'}
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Aucun témoignage {!showAll && 'en attente'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white border-2 rounded-lg p-4 ${
                testimonial.is_approved ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {testimonial.claimer_name}
                        </span>
                        {testimonial.is_approved ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approuvé</span>
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>En attente</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {testimonial.message}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500">
                    Créé le {new Date(testimonial.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  {!testimonial.is_approved ? (
                    <>
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        disabled={actionLoading === testimonial.id}
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        disabled={actionLoading === testimonial.id}
                        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeter</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleToggleApproval(testimonial.id, testimonial.is_approved)}
                      disabled={actionLoading === testimonial.id}
                      className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Retirer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
