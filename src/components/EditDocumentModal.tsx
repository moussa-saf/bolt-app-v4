import { X, Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, DocumentType, Wilaya, FoundDocument } from '../lib/supabase';
import { processDocumentImage, validateImageFile } from '../utils/imageProcessing';

interface EditDocumentModalProps {
  isOpen: boolean;
  document: FoundDocument | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDocumentModal({ isOpen, document, onClose, onSuccess }: EditDocumentModalProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [applyBlur, setApplyBlur] = useState(true);
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

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (document) {
        setFormData({
          document_type_id: document.document_type_id,
          wilaya_id: document.wilaya_id.toString(),
          owner_name: document.owner_name,
          document_number: document.document_number || '',
          found_date: document.found_date,
          found_location: document.found_location,
          additional_info: document.additional_info,
          finder_contact: document.finder_contact,
        });
        if (document.original_image_url || document.image_url) {
          setImagePreview(document.original_image_url || document.image_url);
        }
      }
    }
  }, [isOpen, document]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    setLoading(true);

    try {
      let blurredUrl = document.image_url;
      let originalUrl = document.original_image_url;

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

      const { error } = await supabase
        .from('found_documents')
        .update({
          ...formData,
          wilaya_id: parseInt(formData.wilaya_id),
          document_number: formData.document_number || null,
          image_url: blurredUrl,
          original_image_url: originalUrl,
        })
        .eq('id', document.id);

      if (error) throw error;

      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!document) return;

    const confirmMessage = 'Êtes-vous sûr de vouloir supprimer ce document ?\n\nCette action masquera le document de la liste publique.';
    if (!confirm(confirmMessage)) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('found_documents')
        .update({ is_deleted: true })
        .eq('id', document.id);

      if (error) throw error;

      alert('Document supprimé avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Modifier le document</h2>
            <p className="text-sm text-gray-600 mt-1">Mettez à jour les informations du document trouvé</p>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Nom sur le document *
            </label>
            <input
              type="text"
              required
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: BENALI Mohamed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro du document (optionnel)
            </label>
            <input
              type="text"
              value={formData.document_number}
              onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: derniers chiffres uniquement pour la sécurité"
            />
            <p className="text-xs text-gray-500 mt-1">
              Pour protéger la vie privée, entrez seulement les derniers chiffres
            </p>
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Autres détails qui pourraient aider à l'identification..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo du document (optionnel)
            </label>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyBlur}
                  onChange={(e) => setApplyBlur(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  {applyBlur ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  Appliquer le floutage automatique (recommandé)
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-1 ml-6">
                Le floutage protège les informations sensibles
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="sr-only"
                id="edit-image-input"
              />
              <label
                htmlFor="edit-image-input"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Cliquez pour changer l\'image'}
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
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex gap-3">
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
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Supprimer ce document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
