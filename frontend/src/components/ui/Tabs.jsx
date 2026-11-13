import { cn } from '@/lib/utils';

export function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={cn('border-b border-border flex items-center gap-6 text-sm', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3 pt-1 border-b-2 font-medium flex items-center gap-2 transition-colors relative text-xs',
              isActive
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-neutral-slate hover:text-neutral-dark hover:border-neutral-muted'
            )}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                  isActive ? 'bg-primary text-white' : 'bg-neutral-light text-neutral-slate'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
