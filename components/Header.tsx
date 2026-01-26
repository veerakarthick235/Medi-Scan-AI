import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MediScan AI</h1>
              <p className="text-sm text-muted-foreground">
                Privacy-First Rural Clinic Triage
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              All processing is local
            </p>
            <p className="text-xs text-muted-foreground">Zero data transmission</p>
          </div>
        </div>
      </div>
    </header>
  );
}
