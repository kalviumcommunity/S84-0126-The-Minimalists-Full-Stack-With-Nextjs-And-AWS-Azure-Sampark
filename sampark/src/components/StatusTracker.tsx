import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TrackingData {
  status: string;
  updates: string[];
  name?: string;
  category?: string;
  location?: string;
}

const statusIcons = {
  Submitted: Clock,
  'In Progress': Loader2,
  Resolved: CheckCircle2,
};

const statusColors = {
  Submitted: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export default function StatusTracker() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setTrackingData(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = localStorage.getItem(trackingId.trim().toUpperCase());
    
    if (data) {
      const parsed = JSON.parse(data);
      setTrackingData(parsed);
      
      // Simulate status update after 3 seconds
      if (parsed.status === 'Submitted') {
        setTimeout(() => {
          const updated = {
            ...parsed,
            status: 'In Progress',
            updates: [
              ...parsed.updates,
              `Assigned to field team on ${new Date().toLocaleString()}`,
            ],
          };
          localStorage.setItem(trackingId.trim().toUpperCase(), JSON.stringify(updated));
          setTrackingData(updated);
        }, 3000);
      }
    } else {
      setError('Invalid Tracking ID. Please check and try again.');
    }

    setIsSearching(false);
  };

  const StatusIcon = trackingData ? statusIcons[trackingData.status as keyof typeof statusIcons] || AlertCircle : null;
  const statusColor = trackingData ? statusColors[trackingData.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700' : '';

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Enter your tracking ID (e.g., SMPK12345)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="h-12 pl-10 uppercase"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Button
          onClick={handleTrack}
          disabled={isSearching || !trackingId.trim()}
          className="h-12 px-6 hero-gradient"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Track'
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                <p className="font-display text-lg font-bold text-foreground">
                  {trackingId.toUpperCase()}
                </p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}>
                {StatusIcon && (
                  <StatusIcon className={`w-4 h-4 ${trackingData.status === 'In Progress' ? 'animate-spin' : ''}`} />
                )}
                <span className="font-medium text-sm">{trackingData.status}</span>
              </div>
            </div>

            {(trackingData.category || trackingData.location) && (
              <div className="grid sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-secondary/50">
                {trackingData.category && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {trackingData.category}
                    </p>
                  </div>
                )}
                {trackingData.location && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-sm font-medium text-foreground">
                      {trackingData.location}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Timeline</p>
              <div className="space-y-3">
                {trackingData.updates.map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{update}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
