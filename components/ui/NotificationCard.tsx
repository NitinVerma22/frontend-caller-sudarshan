import { Check } from 'lucide-react';
import { cn } from '@/utils';

interface NotificationCardProps {
  type: 'overdue' | 'new_leads' | 'due_soon' | 'target_update';
  title: string;
  description: string;
  time: string;
  className?: string;
  onRead?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  description,
  time,
  className,
  onRead
}) => {
  const dotColors = {
    overdue: 'bg-red-500',
    new_leads: 'bg-emerald-500',
    due_soon: 'bg-amber-500',
    target_update: 'bg-slate-500'
  };

  return (
    <div className={cn(
      "bg-[#111827] border border-slate-800/60 rounded-3xl p-6 mb-4 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] group",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn("w-2.5 h-2.5 rounded-full mt-2 shrink-0", dotColors[type])} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-white font-bold text-lg leading-tight mb-1 flex-1">
              {title}
            </h3>
            {onRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead();
                }}
                className="ml-2 p-1.5 rounded-lg bg-slate-800/50 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all opacity-0 group-hover:opacity-100"
                title="Mark as read"
              >
                <Check size={16} />
              </button>
            )}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            {description}
          </p>
          <span className="text-slate-500 text-xs font-medium">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
