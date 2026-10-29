import React from 'react';
import * as Icons from 'lucide-react';

const DashboardCard = ({ card, onClick }) => {
  const IconComponent = Icons[card.icon] || Icons.Square;

  return (
    <button
      type="button"
      onClick={() => onClick(card.id)}
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="absolute inset-0 bg-primary/[0.02] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
            <IconComponent
              size={20}
              className="text-primary transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <div className="mt-1 h-2 w-2 rounded-full bg-primary/25 transition-colors duration-200 group-hover:bg-primary/50" />
        </div>

        <h3 className="mb-1.5 text-sm font-semibold leading-tight text-foreground">
          {card.title}
        </h3>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {card.description}
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-primary/40 transition-transform duration-200 group-hover:scale-x-100" />
    </button>
  );
};

export default DashboardCard;
