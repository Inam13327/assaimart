import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram } from 'lucide-react';

const TikTok = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendContactMessage } from '@/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await sendContactMessage(formData);
      toast({
        title: 'Message Sent!',
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      toast({
        title: 'Failed to send message',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'assaimartofficial@gmail.com',
      link: 'mailto:assaimartofficial@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+92-3497716806',
      link: 'tel:+92-3497716806',
    },
    {
      icon: MapPin,
      title: 'Address',
      content: '3rd Floor, Tajmahal Plaza, Abbottabad,   KPK  PAKISTAN',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium uppercase tracking-widest">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 mb-6">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a question or need assistance? We'd love to hear from you. 
              Reach out to our team and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card p-8 md:p-10 rounded-xl border border-border/50">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                    className="bg-background border-border resize-none"
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground mb-8">
                  We're here to help! Reach out to us through any of the following channels 
                  and our team will assist you promptly.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <info.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
            <div className="pt-8">
              <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
                Follow Us
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Stay connected with us on social media for the latest updates, 
                new arrivals, and exclusive offers.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/share/18MrnQLRBj/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-gold" />
                </a>
                <a
                  href="https://www.tiktok.com/@assaimartofficial?_r=1&_t=ZS-93Cfhw0wdcG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <TikTok className="h-5 w-5 text-gold" />
                </a>
                <a
                  href="https://www.instagram.com/assaimartofficial?igsh=Mzl3cGNzZzE4YXdm&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center hover:bg-gold/20 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-gold" />
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
