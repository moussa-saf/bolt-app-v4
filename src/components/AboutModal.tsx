import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-xl md:text-2xl font-bold">Conditions Générales d'Utilisation</h2>
            <h2 className="text-lg md:text-xl font-bold rtl mt-1">الشروط العامة للاستخدام</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-8 space-y-8 text-gray-700">
          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. À Propos du Service</h3>
              <p className="text-sm leading-relaxed">
                Documents Perdus_Trouvés est une plateforme gratuite dédiée aux citoyens algériens pour faciliter la restitution et la récupération de documents perdus. Notre mission est de créer un lien direct entre les personnes ayant trouvé des documents et leurs propriétaires légitimes.
              </p>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">١. حول الخدمة</h3>
              <p className="text-sm leading-relaxed">
                منصة الوثائق المفقودة والموجودة هي منصة مجانية مخصصة للمواطنين الجزائريين لتسهيل إرجاع واسترجاع الوثائق المفقودة. مهمتنا هي إنشاء رابط مباشر بين الأشخاص الذين عثروا على الوثائق وأصحابها الشرعيين.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Utilisation du Service</h3>
              <p className="text-sm leading-relaxed mb-2">
                En accédant et en utilisant cette plateforme, vous acceptez de respecter les conditions suivantes :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Vous garantissez que vous utilisez le service de bonne foi</li>
                <li>Vous ne devez pas utiliser la plateforme à des fins frauduleuses ou illégales</li>
                <li>Vous acceptez de fournir des informations exactes et véridiques</li>
                <li>Vous respectez les droits d'autrui et la vie privée</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٢. استخدام الخدمة</h3>
              <p className="text-sm leading-relaxed mb-2">
                بالدخول واستخدام هذه المنصة، فإنك توافق على احترام الشروط التالية:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>تضمن أنك تستخدم الخدمة بحسن نية</li>
                <li>يجب عدم استخدام المنصة لأغراض احتيالية أو غير قانونية</li>
                <li>توافق على تقديم معلومات دقيقة وصحيحة</li>
                <li>تحترم حقوق الآخرين والخصوصية</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Responsabilités de l'Utilisateur</h3>
              <p className="text-sm leading-relaxed mb-2">
                Les utilisateurs sont responsables de :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>La véracité des informations fournies sur les documents</li>
                <li>La confidentialité de leurs données personnelles</li>
                <li>Le respect de la loi algérienne en vigueur</li>
                <li>La non-divulgation de documents d'autrui sans consentement</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٣. مسؤوليات المستخدم</h3>
              <p className="text-sm leading-relaxed mb-2">
                المستخدمون مسؤولون عن:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>صحة المعلومات المقدمة عن الوثائق</li>
                <li>سرية بياناتهم الشخصية</li>
                <li>احترام القانون الجزائري الساري</li>
                <li>عدم الكشف عن وثائق الآخرين دون موافقة</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Signaler un Document Trouvé</h3>
              <p className="text-sm leading-relaxed mb-2">
                Lorsque vous signalez un document trouvé, vous vous engagez à :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Fournir une description précise du document</li>
                <li>Indiquer le lieu de découverte avec exactitude</li>
                <li>Respecter la confidentialité des informations personnelles visibles</li>
                <li>Conserver le document dans un état sûr jusqu'à sa restitution</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٤. الإبلاغ عن وثيقة موجودة</h3>
              <p className="text-sm leading-relaxed mb-2">
                عند الإبلاغ عن وثيقة موجودة، فإنك تلتزم بـ:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>تقديم وصف دقيق للوثيقة</li>
                <li>تحديد مكان الاكتشاف بدقة</li>
                <li>احترام سرية المعلومات الشخصية المرئية</li>
                <li>الاحتفاظ بالوثيقة في حالة آمنة حتى إرجاعها</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Réclamer un Document</h3>
              <p className="text-sm leading-relaxed mb-2">
                Pour réclamer un document, vous devez :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Fournir une preuve d'identité valide</li>
                <li>Justifier votre propriété du document</li>
                <li>Accepter les conditions de restitution</li>
                <li>Communiquer en toute bonne foi avec la personne ayant trouvé le document</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٥. المطالبة بوثيقة</h3>
              <p className="text-sm leading-relaxed mb-2">
                للمطالبة بوثيقة، يجب عليك:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>تقديم إثبات هوية صالح</li>
                <li>إثبات ملكيتك للوثيقة</li>
                <li>قبول شروط الإرجاع</li>
                <li>التواصل بحسن نية مع الشخص الذي عثر على الوثيقة</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Protection des Données Personnelles</h3>
              <p className="text-sm leading-relaxed">
                Nous nous engageons à protéger vos données personnelles. Les informations collectées sont utilisées uniquement pour faciliter la restitution des documents. Nous ne partagerons vos données avec des tiers sans votre consentement explicite, sauf en cas d'obligation légale.
              </p>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٦. حماية البيانات الشخصية</h3>
              <p className="text-sm leading-relaxed">
                نلتزم بحماية بياناتك الشخصية. يتم استخدام المعلومات التي تم جمعها فقط لتسهيل إرجاع الوثائق. لن نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة، إلا في حالة التزام قانوني.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation de Responsabilité</h3>
              <p className="text-sm leading-relaxed mb-2">
                Documents Perdus_Trouvés n'est pas responsable de :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Les pertes ou dommages aux documents après leur signalement</li>
                <li>Les différends entre utilisateurs concernant les documents</li>
                <li>L'exactitude des informations fournies par les utilisateurs</li>
                <li>Les interruptions de service ou défaillances techniques</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٧. حدود المسؤولية</h3>
              <p className="text-sm leading-relaxed mb-2">
                منصة الوثائق المفقودة والموجودة ليست مسؤولة عن:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>الخسائر أو الأضرار التي تلحق بالوثائق بعد الإبلاغ عنها</li>
                <li>النزاعات بين المستخدمين بشأن الوثائق</li>
                <li>دقة المعلومات المقدمة من المستخدمين</li>
                <li>انقطاع الخدمة أو الأعطال الفنية</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Comportement Interdit</h3>
              <p className="text-sm leading-relaxed mb-2">
                Les utilisateurs ne doivent pas :
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>Utiliser la plateforme pour commettre des fraudes ou arnaques</li>
                <li>Publier des contenu offensants, discriminatoires ou harcelants</li>
                <li>Violer les droits d'auteur ou les droits de propriété intellectuelle</li>
                <li>Tenter d'accéder sans autorisation aux systèmes de la plateforme</li>
              </ul>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٨. السلوك المحظور</h3>
              <p className="text-sm leading-relaxed mb-2">
                يجب على المستخدمين عدم:
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside">
                <li>استخدام المنصة لارتكاب عمليات احتيال أو نصب</li>
                <li>نشر محتوى مسيء أو تمييزي أو مضايق</li>
                <li>انتهاك حقوق النشر أو حقوق الملكية الفكرية</li>
                <li>محاولة الوصول دون تصريح إلى أنظمة المنصة</li>
              </ul>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Modifications des Conditions</h3>
              <p className="text-sm leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Votre utilisation continue du service implique votre acceptation des nouvelles conditions.
              </p>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">٩. تعديل الشروط</h3>
              <p className="text-sm leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستدخل التعديلات حيز التنفيذ فور نشرها على الموقع. يعني استمرارك في استخدام الخدمة قبولك للشروط الجديدة.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Droit Applicable</h3>
              <p className="text-sm leading-relaxed">
                Ces conditions générales sont régies par la loi algérienne. Tout différend sera résolu selon les procédures légales en vigueur en Algérie.
              </p>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">١٠. القانون المطبق</h3>
              <p className="text-sm leading-relaxed">
                تخضع هذه الشروط العامة للقانون الجزائري. سيتم حل أي نزاع وفقاً للإجراءات القانونية السارية في الجزائر.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Contact</h3>
              <p className="text-sm leading-relaxed mb-3">
                Pour toute question concernant ces conditions ou le service, veuillez nous contacter. Nous sommes à votre disposition pour clarifier ou aider.
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-gray-900">SAF Moussa</p>
                <p className="text-sm text-gray-700">Propriétaire de la plateforme</p>
                <a href="mailto:moussa.saf@gmail.com" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
                  moussa.saf@gmail.com
                </a>
              </div>
            </div>
            <div className="rtl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">١١. اتصل بنا</h3>
              <p className="text-sm leading-relaxed mb-3">
                لأي أسئلة حول هذه الشروط أو الخدمة، يرجى الاتصال بنا. نحن تحت تصرفكم للتوضيح أو المساعدة.
              </p>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <p className="text-sm font-semibold text-gray-900">صاف موسى</p>
                <p className="text-sm text-gray-700">مالك المنصة</p>
                <a href="mailto:moussa.saf@gmail.com" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
                  moussa.saf@gmail.com
                </a>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">
                <strong>Dernière mise à jour :</strong> Décembre 2025
              </p>
              <p className="text-xs text-gray-600 mt-2">
                En utilisant cette plateforme, vous confirmez avoir lu et accepté l'intégralité de ces conditions générales d'utilisation.
              </p>
            </div>
            <div className="rtl">
              <p className="text-xs text-gray-600">
                <strong>آخر تحديث:</strong> ديسمبر ٢٠٢٥
              </p>
              <p className="text-xs text-gray-600 mt-2">
                باستخدام هذه المنصة، فإنك تؤكد أنك قرأت ووافقت على جميع شروط الاستخدام العامة.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
