import { User, LogOut, FileText, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MyDocumentsModal from './MyDocumentsModal';
import { supabase } from '../lib/supabase';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showMyDocuments, setShowMyDocuments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleteLoading(true);
    try {
      const { error: documentsError } = await supabase
        .from('found_documents')
        .delete()
        .eq('created_by', user.id);

      if (documentsError) throw documentsError;

      const { error: testimonialsError } = await supabase
        .from('testimonials')
        .delete()
        .eq('user_id', user.id);

      if (testimonialsError) throw testimonialsError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

      if (authError) {
        await supabase.rpc('delete_user');
      }

      alert('✅ Vos données ont été supprimées avec succès.');
      await signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('❌ Erreur lors de la suppression de vos données. Veuillez contacter le support à contact@documents-lost.vercel.app');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Connecté en tant que:</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setShowMyDocuments(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Mes documents</span>
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer mes données</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}

      <MyDocumentsModal
        isOpen={showMyDocuments}
        onClose={() => setShowMyDocuments(false)}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Supprimer mes données
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cette action est irréversible et supprimera :
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
                  <li>Votre compte utilisateur</li>
                  <li>Tous vos documents déclarés</li>
                  <li>Vos témoignages</li>
                  <li>Toutes vos données personnelles</li>
                </ul>
                <p className="text-sm text-gray-700 font-medium mb-4">
                  Êtes-vous sûr de vouloir continuer ?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Suppression...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
