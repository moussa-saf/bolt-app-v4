import { FileSearch, Heart, Info, Shield, Home, LogIn, Settings } from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAboutClick?: () => void;
  onHomeClick?: () => void;
  showHomeButton?: boolean;
  onAuthClick?: () => void;
  onAdminClick?: () => void;
  onPrivacyClick?: () => void;
}

export default function Header({ onAboutClick, onHomeClick, showHomeButton = false, onAuthClick, onAdminClick, onPrivacyClick }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  return (
    <header className="bg-white shadow-md border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl shadow-md">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Documents Perdus_Trouvés</h1>
              <p className="text-sm text-gray-600">الوثائق المفقودة التي تم العثور عليها - Algérie</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {showHomeButton && (
              <button
                onClick={onHomeClick}
                className="flex items-center space-x-1.5 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-1.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <button
              onClick={onAboutClick}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium hidden sm:inline">À propos</span>
            </button>
            <button
              onClick={onPrivacyClick}
              className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium hidden sm:inline">Loi 18-07</span>
            </button>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 font-medium hidden sm:inline">Gratuit</span>
            </div>
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}