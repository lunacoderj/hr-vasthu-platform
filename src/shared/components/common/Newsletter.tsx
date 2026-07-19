import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Input } from '../ui';
import { useNotification } from '../../hooks/useNotification';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showNotification({
      type: 'success',
      message: 'Thank you for subscribing to our newsletter!',
    });
    
    setEmail('');
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-4">
        Subscribe to our Newsletter
      </h3>
      <p className="text-stone-600 dark:text-stone-400 text-sm mb-4">
        Get the latest updates on Vastu tips, new books, and exclusive spiritual guidance.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            className="w-full bg-white dark:bg-stone-900"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          icon={<Send size={16} />}
          iconPosition="right"
          className="shrink-0"
        >
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
