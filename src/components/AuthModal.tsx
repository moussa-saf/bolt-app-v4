import { X, Mail, Lock, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onPrivacyClick?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess, onPrivacyClick }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !acceptedPrivacy) {
      setError('Vous devez accepter la politique de confidentialité pour créer un compte');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('User already registered')) {
          setError('Cet email est déjà enregistré');
        } else {
          setError(error.message);
        }
      } else {
        if (isSignUp) {
          alert('✅ Compte créé avec succès! Vous pouvez maintenant vous connecter.');
        }
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setAcceptedPrivacy(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSignUp ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            <h2 className="text-xl font-bold">
              {isSignUp ? 'Créer un compte' : 'Se connecter'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="exemple@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                  Conformément à la <strong>Loi n° 18-07 du 10/06/2018</strong>, vos données (nom, téléphone, photo) sont collectées pour connecter perdants/trouveurs. Vous pouvez les supprimer à tout moment.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onPrivacyClick?.();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    En savoir plus
                  </button>
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    J'ACCEPTE *
                  </span>
                </label>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isSignUp ? 'Créer mon compte' : 'Se connecter'}</span>
              </>
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {isSignUp
                ? 'Vous avez déjà un compte? Se connecter'
                : "Vous n'avez pas de compte? S'inscrire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
