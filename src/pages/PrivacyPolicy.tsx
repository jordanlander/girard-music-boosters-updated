import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    document.title = "Privacy Policy | Girard Music & Drama Boosters";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container flex flex-col items-start gap-2 py-3 min-[481px]:flex-row min-[481px]:items-center min-[481px]:justify-between min-[481px]:gap-0">
          <Link to="/" className="flex items-center gap-3">
            <img src={`${baseUrl}lovable-uploads/4dd1825b-a51e-4884-9527-cb64042a826c.png`} alt="Yellowjacket logo" className="h-10 w-10" />
            <span className="font-display text-lg sm:text-xl">Girard Music & Drama Boosters</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <a href="/#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Events</a>
            <a href="/#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gallery</a>
            <a href="/#leaders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaders</a>
          </nav>
        </div>
      </header>
      <main className="container py-10 prose prose-neutral dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>
          At <strong>Girard Music & Drama Boosters</strong>, we respect your privacy. We collect only the
          personal information you provide, such as your name and email address, to respond to your
          requests for information about events, volunteering, or other booster activities.
        </p>
        <p>
          We <strong>do not share or sell your information</strong> to third parties. Your data is used solely
          to contact you regarding your inquiry, provide updates, and coordinate booster-related
          activities.
        </p>
        <p>
          By submitting your information through our website or Google ads, you agree to this policy.
          If you have any questions about your information, please contact us at
          <a className="underline" href="mailto:girardmusicboosters@gmail.com">girardmusicboosters@gmail.com</a>.
        </p>
      </main>
      <footer className="border-t border-border">
        <div className="container py-8 text-sm text-muted-foreground flex items-center justify-between gap-2">
          <div>
            <div>© {new Date().getFullYear()} Girard Music & Drama Boosters</div>
            <div className="mt-2">Community support that makes the arts possible.</div>
          </div>
          <div className="flex gap-4">
            <Button variant="link" size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/admin" aria-label="Admin login">Login</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

