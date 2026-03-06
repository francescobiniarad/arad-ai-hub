import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { BoardIcon, TableIcon } from '../../components/icons';

const items = [
  {
    id: 'kanban',
    label: 'Kanban',
    desc: 'Board per il tracking visuale di tutte le idee R&D con post-it draggabili.',
    icon: <BoardIcon />,
    color: '#6366F1',
  },
  {
    id: 'tabella',
    label: 'Tabella Idee',
    desc: 'Vista Excel-like di tutte le idee con dettagli, punto di partenza e arrivo.',
    icon: <TableIcon />,
    color: '#06B6D4',
  },
];

export const RDPage = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="font-mono text-3xl font-bold mb-8">R&D</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, index) => (
          <Link key={item.id} to={`/rd/${item.id}`}>
            <Card
              hoverable
              className="border-l-4"
              style={{
                borderLeftColor: item.color,
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="mb-3" style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className="font-mono text-lg mb-2">{item.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
