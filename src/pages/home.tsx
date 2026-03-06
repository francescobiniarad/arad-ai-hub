import { Link } from 'react-router-dom';
import { Card } from '../components/ui';
import { BeakerIcon, GraduationCapIcon, RocketIcon } from '../components/icons';

const cards = [
  {
    id: 'rd',
    label: 'R&D',
    desc: 'Kanban board e tabella idee per il tracking degli stream AI interni.',
    icon: <BeakerIcon />,
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    path: '/rd',
  },
  {
    id: 'formazione',
    label: 'Formazione AI',
    desc: 'Certificazioni, workshop, sessioni pratiche e gamification.',
    icon: <GraduationCapIcon />,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    path: '/formazione',
  },
  {
    id: 'offering',
    label: 'AI Offering',
    desc: 'Decision sheet per valutare e prioritizzare le idee di servizio AI.',
    icon: <RocketIcon />,
    gradient: 'linear-gradient(135deg, #22C55E, #06B6D4)',
    path: '/offering',
  },
];

export const HomePage = () => {
  return (
    <div className="pt-12 animate-fade-in">
      <div className="text-center mb-14">
        <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ARAD Digital AI Hub
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Centro di comando interno per il tracking di tutte le iniziative AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <Link key={card.id} to={card.path}>
            <Card
              hoverable
              gradient={card.gradient}
              className="h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white"
                style={{ background: card.gradient }}
              >
                {card.icon}
              </div>
              <h2 className="font-mono text-xl font-bold mb-2">{card.label}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
