  "use client";

  import { useLanguage } from "@/context/LanguageContext";

  export default function LanguageSettings() {
    const { language, setLanguage, t } = useLanguage();

    const languages = [
      { code: "ru", label: "Русский", active: true },
      { code: "en", label: "English", active: true },
      { code: "es", label: "Español", active: false },
      { code: "de", label: "Deutsch", active: false },
      { code: "fr", label: "Français", active: false },
    ];

    return (
      /* Убрали max-w-sm, добавили w-full */
      <div className="bg-[#0b1224] w-full p-4 md:p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-white text-xs md:text-sm font-bold mb-4 uppercase tracking-widest opacity-70">
          {t.settings.language}
        </h3>
        
        {/* Сетка: на мобильных 1 колонка, на планшетах/ПК можно сделать 2, 
            но для настроек лучше оставить 1 колонку на всю ширину */}
        <div className="flex flex-col w-full gap-2">
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            const isAvailable = lang.active;

            return (
              <button
                key={lang.code}
                disabled={!lang.active}
                onClick={() => {
                  if (lang.active) {
                    setLanguage(lang.code as "en" | "ru");
                    // Не нужно делать window.location.reload()! 
                    // React сам перерисует компоненты, использующие t
                  }
                }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all border w-full ${
                  isSelected
                    ? "bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]"
                    : isAvailable
                      ? "bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/[0.07] hover:border-white/10"
                      : "bg-transparent border-transparent text-white/20 cursor-not-allowed italic"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full transition-all ${
                    isSelected ? "bg-blue-400 shadow-[0_0_8px_#3b82f6]" : "bg-white/10"
                  }`} />
                  <span className={!isAvailable ? "opacity-50" : ""}>{lang.label}</span>
                </div>

                <div className="flex items-center gap-3">
                  {!isAvailable && (
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 uppercase tracking-tighter">
                      Soon
                    </span>
                  )}
                  
                  {isSelected && (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-5 pt-4 border-t border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-tight">
          </p>
        </div>
      </div>
    );
  }