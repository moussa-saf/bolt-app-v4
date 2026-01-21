import algeriaMap from '../assets/Carte-Algérie.jpeg';

export default function AlgeriaMapBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg min-h-[400px] md:min-h-[500px]">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${algeriaMap})` }}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 p-8 md:p-12 text-white text-center space-y-4 flex flex-col justify-center min-h-[400px] md:min-h-[500px]">
        <h1 className="text-3xl md:text-4xl font-bold rtl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          أهلا بكم في منصة الوثائق المفقودة التي تم العثور عليها
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          Bienvenue sur Documents Perdus_Trouvés
        </h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Plateforme gratuite pour aider les Algériens à retrouver leurs documents perdus.
          Choisissez le type de document pour commencer.
        </p>
        <p className="text-sm md:text-base font-light rtl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          منصة مجانية لمساعدة الجزائريين في العثور على وثائقهم المفقودة
        </p>
      </div>
    </div>
  );
}
