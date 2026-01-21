import { useState, useEffect } from 'react';
import { Star, Quote, ThumbsUp } from 'lucide-react';
import { supabase, Testimonial } from '../lib/supabase';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
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

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
          <ThumbsUp className="w-8 h-8 text-emerald-600" />
          <span>Témoignages</span>
        </h3>
        <p className="text-gray-600 mt-2">
          Ce qu'ils disent après avoir récupéré leur document
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-emerald-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.claimer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.claimer_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(testimonial.created_at).toLocaleDateString('fr-DZ', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <Quote className="w-6 h-6 text-emerald-300 group-hover:text-emerald-400 transition-colors" />
            </div>

            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed italic">
              "{testimonial.message}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
