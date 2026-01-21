import { useState, useEffect } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import DocumentTypeCard from './components/DocumentTypeCard';
import DocumentList from './components/DocumentList';
import ReportDocumentModal from './components/ReportDocumentModal';
import ClaimDocumentModal from './components/ClaimDocumentModal';
import EditDocumentModal from './components/EditDocumentModal';
import AboutModal from './components/AboutModal';
import TestimonialModal from './components/TestimonialModal';
import TestimonialsSection from './components/TestimonialsSection';
import StatisticsSection from './components/StatisticsSection';
import FilterSection from './components/FilterSection';
import AuthModal from './components/AuthModal';
import AlgeriaMapBanner from './components/AlgeriaMapBanner';
import InstallPrompt from './components/InstallPrompt';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import { supabase, DocumentType, FoundDocument, Wilaya } from './lib/supabase';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading: authLoading, privacyPolicyAccepted, acceptPrivacyPolicy } = useAuth();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [documents, setDocuments] = useState<FoundDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<FoundDocument | null>(null);
  const [documentCounts, setDocumentCounts] = useState<Record<string, number>>({});
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (!authLoading && !initialLoadDone) {
      loadDocumentTypes();
      loadWilayas();
      setInitialLoadDone(true);
    }
  }, [authLoading, initialLoadDone]);

  useEffect(() => {
    if (user && !authLoading && !privacyPolicyAccepted) {
      setShowPrivacyModal(true);
    }
  }, [user, authLoading, privacyPolicyAccepted]);

  useEffect(() => {
    if (selectedType) {
      loadDocuments(selectedType.id);
    }
  }, [selectedType, searchQuery, selectedWilaya, selectedStatus, dateFrom, dateTo]);

  const loadDocumentTypes = async () => {
    if (initialLoadDone) {
      setLoading(true);
    }
    try {
      const { data: types } = await supabase
        .from('document_types')
        .select('*')
        .order('display_order');

      if (types) {
        setDocumentTypes(types);

        const { data: docs } = await supabase
          .from('found_documents')
          .select('document_type_id')
          .eq('status', 'available')
          .eq('is_deleted', false);

        if (docs) {
          const counts: Record<string, number> = {};
          docs.forEach((doc) => {
            counts[doc.document_type_id] = (counts[doc.document_type_id] || 0) + 1;
          });
          setDocumentCounts(counts);
        }
      }
    } catch (error) {
      console.error('Error loading document types:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWilayas = async () => {
    try {
      const { data } = await supabase
        .from('wilayas')
        .select('*')
        .order('code');
      if (data) setWilayas(data);
    } catch (error) {
      console.error('Error loading wilayas:', error);
    }
  };

  const loadDocuments = async (typeId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('found_documents')
        .select(`
          *,
          document_types(*),
          wilayas(*)
        `)
        .eq('document_type_id', typeId)
        .eq('is_approved', true)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(
          `owner_name.ilike.%${searchQuery}%,found_location.ilike.%${searchQuery}%,document_number.ilike.%${searchQuery}%,case_number.ilike.%${searchQuery}%`
        );
      }

      if (selectedWilaya) {
        query = query.eq('wilaya_id', selectedWilaya);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      if (dateFrom) {
        query = query.gte('created_at', `${dateFrom}T00:00:00`);
      }

      if (dateTo) {
        query = query.lte('created_at', `${dateTo}T23:59:59`);
      }

      const { data } = await query;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = (document: FoundDocument) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDocument(document);
    setShowClaimModal(true);
  };

  const handleSuccess = () => {
    if (selectedType) {
      loadDocuments(selectedType.id);
    }
    loadDocumentTypes();
  };

  const handleHomeClick = () => {
    setSelectedType(null);
    setSearchQuery('');
    setSelectedWilaya(null);
    setSelectedStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  if (authLoading || !initialLoadDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (user && !privacyPolicyAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50">
        <Header
          onAboutClick={() => setShowAboutModal(true)}
          onHomeClick={handleHomeClick}
          showHomeButton={false}
          onAuthClick={() => setShowAuthModal(true)}
          onAdminClick={() => setShowAdminDashboard(true)}
          onPrivacyClick={() => setShowPrivacyModal(true)}
        />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Acceptation requise</h2>
            <p className="text-gray-600">
              Pour utiliser la plateforme, vous devez accepter notre politique de confidentialité conformément à la Loi 18-07.
            </p>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Lire et accepter la politique
            </button>
          </div>
        </div>

        <PrivacyPolicyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          onAccept={acceptPrivacyPolicy}
          mandatory={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50">
      <Header
        onAboutClick={() => setShowAboutModal(true)}
        onHomeClick={handleHomeClick}
        showHomeButton={selectedType !== null}
        onAuthClick={() => setShowAuthModal(true)}
        onAdminClick={() => setShowAdminDashboard(true)}
        onPrivacyClick={() => setShowPrivacyModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedType ? (
          <div className="space-y-8">
            <AlgeriaMapBanner />

            <div className="flex justify-center">
              <button
                onClick={() => setShowReportModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 text-lg"
              >
                <Plus className="w-6 h-6" />
                <span>J'ai trouvé un document</span>
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Rechercher un document par type
              </h3>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documentTypes.map((type) => (
                    <DocumentTypeCard
                      key={type.id}
                      documentType={type}
                      onClick={() => setSelectedType(type)}
                      count={documentCounts[type.id]}
                    />
                  ))}
                </div>
              )}
            </div>

            <StatisticsSection />

            <TestimonialsSection />

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center">
              <p className="text-yellow-900 font-medium">Espace publicitaire disponible</p>
              <p className="text-yellow-800 text-sm mt-1">Espace réservé pour la publicité partenaire</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedType(null);
                    setSearchQuery('');
                    setSelectedWilaya(null);
                    setSelectedStatus('all');
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedType.name_fr}
                  </h2>
                  <p className="text-sm text-gray-600 rtl">{selectedType.name_ar}</p>
                </div>
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Signaler un document</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, lieu ou numéro..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <FilterSection
              wilayas={wilayas}
              selectedWilaya={selectedWilaya}
              selectedStatus={selectedStatus}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onWilayaChange={setSelectedWilaya}
              onStatusChange={setSelectedStatus}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onClearFilters={() => {
                setSelectedWilaya(null);
                setSelectedStatus('all');
                setDateFrom('');
                setDateTo('');
              }}
            />

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : (
              <DocumentList
                documents={documents}
                onClaim={handleClaim}
                onEdit={(doc) => {
                  setSelectedDocument(doc);
                  setShowEditModal(true);
                }}
                user={user}
              />
            )}
          </div>
        )}
      </main>

      <ReportDocumentModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={handleSuccess}
      />

      <ClaimDocumentModal
        isOpen={showClaimModal}
        document={selectedDocument}
        onClose={() => setShowClaimModal(false)}
        onSuccess={handleSuccess}
        onTestimonialRequest={() => {
          setShowTestimonialModal(true);
        }}
      />

      <TestimonialModal
        isOpen={showTestimonialModal}
        document={selectedDocument}
        onClose={() => {
          setShowTestimonialModal(false);
          setSelectedDocument(null);
        }}
        onSuccess={() => {
          handleSuccess();
          setShowTestimonialModal(false);
          setSelectedDocument(null);
        }}
      />

      <EditDocumentModal
        isOpen={showEditModal}
        document={selectedDocument}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDocument(null);
        }}
        onSuccess={() => {
          handleSuccess();
          setShowEditModal(false);
          setSelectedDocument(null);
        }}
      />

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        onPrivacyClick={() => setShowPrivacyModal(true)}
      />

      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />

      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={acceptPrivacyPolicy}
        mandatory={user !== null && !privacyPolicyAccepted}
      />

      <InstallPrompt />

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
          <p className="text-center text-gray-600 text-sm">
            Service gratuit • خدمة مجانية • Algérie 🇩🇿
          </p>
          <div className="text-center text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} Documents Perdus_Trouvés. Tous droits réservés.</p>
            <p className="mt-1">
              Propriétaire: <span className="font-medium text-gray-700">SAF Moussa</span> • Contact: <a href="mailto:moussa.saf@gmail.com" className="text-emerald-600 hover:text-emerald-700 underline">moussa.saf@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;