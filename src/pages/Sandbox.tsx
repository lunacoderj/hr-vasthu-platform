import { Button, Input, Textarea, Card, Spinner } from '../shared/components/ui';
import Container from '../shared/components/layout/Container';
import Typography from '../shared/components/content/Typography';
import { Mail, Search, CheckCircle } from 'lucide-react';
import { useNotification } from '../shared/hooks/useNotification';

const Sandbox = () => {
  const { showNotification } = useNotification();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-12">
      <Container>
        <Typography variant="display" className="mb-4 text-gold-500">
          Component Sandbox
        </Typography>
        <Typography variant="body" className="mb-12 max-w-2xl">
          This is a visual test environment for the Phase 3 Core UI components built for the HR Vasthu Digital Platform.
        </Typography>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Typography */}
          <section className="space-y-6">
            <Typography variant="h2" className="border-b pb-2">Typography</Typography>
            <div className="space-y-4">
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="body">
                This is standard body text using the Inter font. It is highly readable and designed for long-form content.
              </Typography>
            </div>
          </section>

          {/* Buttons */}
          <section className="space-y-6">
            <Typography variant="h2" className="border-b pb-2">Buttons</Typography>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" isLoading>Loading</Button>
              <Button variant="secondary" icon={<CheckCircle size={18} />} iconPosition="right">
                With Icon
              </Button>
              <Button variant="primary" isDisabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </section>

          {/* Inputs */}
          <section className="space-y-6">
            <Typography variant="h2" className="border-b pb-2">Form Elements</Typography>
            <div className="space-y-4 max-w-sm">
              <Input 
                label="Email Address" 
                placeholder="Enter your email" 
                leftIcon={<Mail size={18} />}
                required
              />
              <Input 
                label="Search" 
                placeholder="Search articles..." 
                rightIcon={<Search size={18} />}
              />
              <Input 
                label="Username" 
                error="Username is already taken."
                defaultValue="hrvasthu"
              />
              <Textarea 
                label="Message"
                placeholder="Write your message here..."
                hint="Maximum 500 characters."
              />
            </div>
          </section>

          {/* Cards & Loaders */}
          <section className="space-y-6">
            <Typography variant="h2" className="border-b pb-2">Cards & Loaders</Typography>
            
            <div className="flex gap-4 mb-8">
              <Spinner size="md" variant="primary" />
              <Spinner size="md" variant="stone" />
            </div>

            <Card elevation="md" className="max-w-md">
              <Typography variant="h4" className="mb-2">Spiritual Guidance</Typography>
              <Typography variant="body" className="mb-6">
                Discover the ancient secrets of Vastu and align your space with cosmic energies for prosperity.
              </Typography>
              <Button variant="tertiary" className="w-full">Read More</Button>
            </Card>

            <Button 
              onClick={() => showNotification({ type: 'success', message: 'Notification test successful!' })}
              variant="secondary"
            >
              Test Notification
            </Button>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default Sandbox;
