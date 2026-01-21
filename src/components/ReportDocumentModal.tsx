import { X, Upload, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, DocumentType, Wilaya, checkDuplicateDocument, DuplicateDocument } from '../lib/supabase';
import { isValidInitialsFormat, sanitizeText } from '../utils/validation';
import { processDocumentImage, validateImageFile } from '../utils/imageProcessing';

interface ReportDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReportDocumentModal({ isOpen, onClose, onSuccess }: ReportDocumentModalProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    document_type_id: '',
    wilaya_id: '',
    owner_name: '',
    document_number: '',
    found_date: '',
    found_location: '',
    additional_info: '',
    finder_contact: '',
  });
  const [applyBlur, setApplyBlur] = useState(true);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [initialsError, setInitialsError] = useState<string>('');
  const [duplicates, setDuplicates] = useState<DuplicateDocument[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const [typesRes, wilayasRes] = await Promise.all([
      supabase.from('document_types').select('*').order('display_order'),
      supabase.from('wilayas').select('*').order('name_fr'),
    ]);

    if (typesRes.data) setDocumentTypes(typesRes.data);
    if (wilayasRes.data) setWilayas(wilayasRes.data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<{ blurredUrl: string | null; originalUrl: string | null }> => {
    if (!imageFile) return { blurredUrl: null, originalUrl: null };

    try {
      setUploading(true);

      const baseFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      let blurredUrl = null;
      let originalUrl = null;

      if (applyBlur) {
        const blurredBlob = await processDocumentImage(imageFile, true);
        const blurredFileName = `${baseFileName}-blurred`;

        const { error: blurredError } = await supabase.storage
          .from('documents')
          .upload(blurredFileName, blurredBlob, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          });

        if (blurredError) {
          console.error('Blurred upload error:', blurredError);
          throw new Error(blurredError.message || 'Erreur lors du téléchargement de l\'image floutée');
        }

        const { data: blurredUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(blurredFileName);

        blurredUrl = blurredUrlData?.publicUrl || null;

        const originalBlob = await processDocumentImage(imageFile, false);
        const originalFileName = `${baseFileName}-original`;

        const { error: originalError } = await supabase.storage
          .from('documents')
          .upload(originalFileName, originalBlob, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          });

        if (originalError) {
          console.error('Original upload error:', originalError);
          throw new Error(originalError.message || 'Erreur lors du téléchargement de l\'image originale');
        }

        const { data: originalUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(originalFileName);

        originalUrl = originalUrlData?.publicUrl || null;
      } else {
        const processedBlob = await processDocumentImage(imageFile, false);
        const fileName = baseFileName;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, processedBlob, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(uploadError.message || 'Erreur lors du téléchargement');
        }

        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        const url = publicUrlData?.publicUrl || null;
        blurredUrl = url;
        originalUrl = url;
      }

      return { blurredUrl, originalUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const checkForDuplicates = async () => {
    if (!formData.document_type_id || !formData.document_number || !formData.wilaya_id) {
      return;
    }

    setCheckingDuplicates(true);
    try {
      const results = await checkDuplicateDocument(
        formData.document_type_id,
        formData.document_number,
        parseInt(formData.wilaya_id)
      );

      if (results.length > 0) {
        setDuplicates(results);
        setShowDuplicateWarning(true);
      } else {
        setDuplicates([]);
        setShowDuplicateWarning(false);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const initialsValidation = isValidInitialsFormat(formData.owner_name);
    if (!initialsValidation.valid) {
      setInitialsError(initialsValidation.error || '');
      return;
    }

    if (!cguAccepted) {
      alert('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    if (showDuplicateWarning && duplicates.length > 0) {
      const confirmed = window.confirm(
        `⚠️ Attention: ${duplicates.length} document(s) similaire(s) trouvé(s)!\n\n` +
        `Voulez-vous quand même soumettre ce document?\n\n` +
        `Note: Les doublons peuvent être refusés lors de la modération.`
      );
      if (!confirmed) {
        return;
      }
    }

    setLoading(true);

    try {
      let blurredUrl = null;
      let originalUrl = null;
      if (imageFile) {
        try {
          const urls = await uploadImage();
          blurredUrl = urls.blurredUrl;
          originalUrl = urls.originalUrl;
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          alert(`Erreur lors du téléchargement de l'image: ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`);
          setLoading(false);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('found_documents').insert([
        {
          ...formData,
          owner_name: sanitizeText(formData.owner_name),
          wilaya_id: parseInt(formData.wilaya_id),
          document_number: formData.document_number ? sanitizeText(formData.document_number) : null,
          image_url: blurredUrl,
          original_image_url: originalUrl,
          image_needs_blur: applyBlur,
          cgu_accepted: cguAccepted,
          is_approved: false,
          created_by: user?.id || null,
        },
      ]);

      if (error) throw error;

      alert('✅ Document signalé avec succès!\n\nVotre document sera publié après validation par notre équipe.');

      setFormData({
        document_type_id: '',
        wilaya_id: '',
        owner_name: '',
        document_number: '',
        found_date: '',
        found_location: '',
        additional_info: '',
        finder_contact: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setCguAccepted(false);
      setApplyBlur(true);
      setInitialsError('');
      setDuplicates([]);
      setShowDuplicateWarning(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting document:', error);
      alert('Erreur lors de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Signaler un document trouvé</h2>
            <p className="text-sm text-gray-600 mt-1">Aidez quelqu'un à retrouver son document</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de document *
              </label>
              <select
                required
                value={formData.document_type_id}
                onChange={(e) => setFormData({ ...formData, document_type_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name_fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilaya *
              </label>
              <select
                required
                value={formData.wilaya_id}
                onChange={(e) => setFormData({ ...formData, wilaya_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>
                    {wilaya.code} - {wilaya.name_fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initiales du propriétaire * (Confidentialité)
            </label>
            <input
              type="text"
              required
              value={formData.owner_name}
              onChange={(e) => {
                setFormData({ ...formData, owner_name: e.target.value });
                setInitialsError('');
              }}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                initialsError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: K. M."
              maxLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez UNIQUEMENT les initiales (ex: K. M.) pour protéger la vie privée
            </p>
            {initialsError && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {initialsError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3-4 derniers chiffres du document (optionnel)
            </label>
            <input
              type="text"
              onBlur={checkForDuplicates}
              value={formData.document_number}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 4) {
                  setFormData({ ...formData, document_number: value });
                }
              }}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: 3456"
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum 4 chiffres pour protéger la vie privée du propriétaire
            </p>
            {checkingDuplicates && (
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 animate-spin" />
                Vérification des doublons...
              </p>
            )}
            {showDuplicateWarning && duplicates.length > 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  ⚠️ {duplicates.length} document(s) similaire(s) déjà signalé(s)
                </p>
                <ul className="mt-2 text-xs text-yellow-700 space-y-1">
                  {duplicates.map((dup) => (
                    <li key={dup.id}>
                      • {dup.case_number || 'N/A'} - Initiales: {dup.owner_name} - Statut: {dup.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de découverte *
              </label>
              <input
                type="date"
                required
                value={formData.found_date}
                onChange={(e) => setFormData({ ...formData, found_date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de découverte *
              </label>
              <input
                type="text"
                required
                value={formData.found_location}
                onChange={(e) => setFormData({ ...formData, found_location: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: Centre-ville, près de la poste"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre contact (téléphone ou email) *
            </label>
            <input
              type="text"
              required
              value={formData.finder_contact}
              onChange={(e) => setFormData({ ...formData, finder_contact: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: 0555123456 ou email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations supplémentaires
            </label>
            <textarea
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Autres détails qui pourraient aider à l'identification..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo du document (optionnel) - Floutage automatique recommandé
            </label>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyBlur}
                  onChange={(e) => setApplyBlur(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  {applyBlur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Appliquer le floutage automatique (recommandé)
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-1 ml-6">
                Le floutage protège les informations sensibles (photo, signature, numéro complet)
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="sr-only"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Cliquez pour télécharger une image'}
                  </span>
                </div>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cguAccepted}
                onChange={(e) => setCguAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-900 font-medium">
                  J'accepte les conditions générales d'utilisation *
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Je m'engage à fournir des informations exactes et à respecter la confidentialité des données personnelles.
                </p>
              </div>
            </label>
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
              disabled={loading || !cguAccepted}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}