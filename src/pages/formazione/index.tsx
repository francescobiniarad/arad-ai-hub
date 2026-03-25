import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';

const items = [
  { id: 'certificazioni', label: 'Certificazioni AI', emoji: '🎓', color: '#6366F1' },
  { id: 'workshop', label: 'Workshop AI', emoji: '🧪', color: '#F59E0B' },
  { id: 'practical', label: 'Practical AI', emoji: '⚡', color: '#22C55E' },
  { id: 'materiali', label: 'Materiali Utili', emoji: '🔗', color: '#C5A028' },
  { id: 'news', label: 'News', emoji: '📰', color: '#06B6D4' },
  { id: 'gamification', label: 'Gamification', emoji: '🎮', color: '#EC4899' },
];

export const FormazionePage = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-3xl mb-8">Formazione AI</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, index) => (
          <Link key={item.id} to={`/formazione/${item.id}`}>
            <Card
              hoverable
              className="border-l-4"
              style={{
                borderLeftColor: item.color,
                animationDelay: `${index * 80}ms`,
              }}
            >
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="font-heading text-base mt-3">{item.label}</h3>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
