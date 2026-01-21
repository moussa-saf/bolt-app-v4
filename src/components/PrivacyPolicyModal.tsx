import { X, Shield, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  mandatory?: boolean;
}

export default function PrivacyPolicyModal({ isOpen, onClose, onAccept, mandatory = false }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !mandatory) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h2 className="text-xl font-bold">Politique de Confidentialité</h2>
          </div>
          {!mandatory && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(85vh-80px)] space-y-6">
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg">
            <p className="text-sm font-semibold text-emerald-900">
              Conformément à la Loi 18-07 du 10 juin 2018 relative à la protection des personnes physiques
              dans le traitement des données à caractère personnel
            </p>
          </div>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">1. Collecte des Données</h3>
            <p className="text-gray-700 leading-relaxed">
              Notre plateforme collecte uniquement les informations nécessaires au bon fonctionnement du service :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2 ml-4">
              <li>Adresse email (pour l'authentification)</li>
              <li>Initiales du nom du propriétaire (pour les documents déclarés)</li>
              <li>Informations sur les documents perdus/trouvés</li>
              <li>Numéro de téléphone (si fourni volontairement)</li>
              <li>Photos de documents (si fournies)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">2. Utilisation des Données</h3>
            <p className="text-gray-700 leading-relaxed">
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2 ml-4">
              <li>Faciliter la recherche et la récupération de documents perdus</li>
              <li>Permettre la communication entre les utilisateurs</li>
              <li>Améliorer les services de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">3. Protection des Données</h3>
            <p className="text-gray-700 leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger
              vos données contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">4. Vos Droits</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              Conformément à la loi 18-07, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Droit d'accès :</strong> consulter vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données via le bouton "Supprimer mes données"</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">5. Conservation des Données</h3>
            <p className="text-gray-700 leading-relaxed">
              Les données relatives aux documents sont conservées pendant 2 ans maximum après leur déclaration.
              Vous pouvez à tout moment supprimer vos données via votre compte utilisateur.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">6. Partage des Données</h3>
            <p className="text-gray-700 leading-relaxed">
              Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers,
              sauf obligation légale ou pour le bon fonctionnement du service (hébergement sécurisé).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">7. Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              Notre site utilise des cookies essentiels pour le fonctionnement de l'authentification
              et la sécurité. Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">8. Modifications</h3>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité.
              Les utilisateurs seront informés de tout changement important.
            </p>
          </section>

          <section className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              Contact
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant vos données personnelles ou pour exercer vos droits,
              contactez-nous à :
            </p>
            <a
              href="mailto:contact@documents-lost.vercel.app"
              className="text-emerald-600 hover:text-emerald-700 font-semibold mt-2 inline-block"
            >
              contact@documents-lost.vercel.app
            </a>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <p className="text-sm text-blue-900">
              <strong>Référence légale :</strong> Loi n° 18-07 du 10 juin 2018 relative à la protection
              des personnes physiques dans le traitement des données à caractère personnel (Journal Officiel
              de la République Algérienne n°34 du 10 juin 2018).
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          {mandatory ? (
            <div className="space-y-3">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
                <p className="text-sm text-amber-900 font-medium">
                  ⚠️ Vous devez accepter la politique de confidentialité pour utiliser la plateforme
                </p>
              </div>
              <button
                onClick={handleAccept}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                J'accepte la politique de confidentialité
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              J'ai compris
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
