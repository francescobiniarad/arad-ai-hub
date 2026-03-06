interface PlaceholderPageProps {
  title: string;
  text: string;
  color: string;
}

export const PlaceholderPage = ({ title, text, color }: PlaceholderPageProps) => {
  return (
    <div className="animate-fade-in">
      <h1 className="font-mono text-2xl font-bold mb-3">{title}</h1>
      <div
        className="rounded-2xl p-12 text-center border border-dashed"
        style={{
          background: 'rgba(30,41,59,0.5)',
          borderColor: `${color}40`,
        }}
      >
        <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
          {text}
        </p>
        <p className="text-slate-600 text-sm mt-5 italic">Sezione in arrivo...</p>
      </div>
    </div>
  );
};

export const NewsPage = () => (
  <PlaceholderPage
    title="📰 News"
    text="L'idea è quella di creare una sorta di hub delle news in ambito AI per il team."
    color="#06B6D4"
  />
);

export const GamificationPage = () => (
  <PlaceholderPage
    title="🎮 Gamification dell'Esperienza"
    text="L'ultimate goal è creare una piattaforma che gamifica l'esperienza, l'utilizzo e l'apprendimento di temi AI. Ci saranno leaderboard, streaks e giochi engaging."
    color="#EC4899"
  />
);
