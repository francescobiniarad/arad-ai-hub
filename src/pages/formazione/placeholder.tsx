interface PlaceholderPageProps {
  title: string;
  text: string;
  color: string;
}

export const PlaceholderPage = ({ title, text, color }: PlaceholderPageProps) => {
  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl mb-3">{title}</h1>
      <div
        className="rounded-sm p-12 text-center border border-dashed bg-brand-ice"
        style={{ borderColor: `${color}40` }}
      >
        <p className="text-brand-muted text-base leading-relaxed max-w-xl mx-auto">
          {text}
        </p>
        <p className="text-brand-muted/60 text-sm mt-5 italic">Sezione in arrivo...</p>
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
