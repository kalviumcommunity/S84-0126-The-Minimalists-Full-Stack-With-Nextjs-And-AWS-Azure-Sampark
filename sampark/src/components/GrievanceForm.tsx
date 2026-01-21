import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Upload, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';

export default function GrievanceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const id = 'SMPK' + Math.floor(Math.random() * 100000);
    setTrackingId(id);
    
    // Store in localStorage for tracking demo
    localStorage.setItem(id, JSON.stringify({
      status: 'Submitted',
      updates: [`Submitted on ${new Date().toLocaleString()}`],
      ...formData,
    }));

    toast.success('Grievance submitted successfully!');
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (trackingId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-3">
          Grievance Submitted!
        </h3>
        <p className="text-muted-foreground mb-6">
          Your tracking ID is:
        </p>
        <div className="inline-block px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 mb-6">
          <span className="font-display text-2xl font-bold text-primary">
            {trackingId}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Save this ID to track the status of your complaint.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setTrackingId(null);
            setFormData({ name: '', email: '', category: '', description: '', location: '' });
          }}
        >
          Submit Another Grievance
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="h-12"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            required
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="potholes">🚧 Potholes</SelectItem>
              <SelectItem value="waste">🗑️ Waste Management</SelectItem>
              <SelectItem value="water">💧 Water Supply</SelectItem>
              <SelectItem value="electricity">⚡ Electricity</SelectItem>
              <SelectItem value="drainage">🌊 Drainage</SelectItem>
              <SelectItem value="other">📋 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="Enter address or landmark"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
              className="h-12 pl-10"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the issue in detail..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          className="min-h-[120px] resize-none"
        />
      </div>

      <div className="p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer text-center">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Photos or videos (max 10MB)
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 text-base gold-gradient border-0 text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Submit Grievance
          </span>
        )}
      </Button>
    </form>
  );
}
