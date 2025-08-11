export default function ContactSection() {
  return (
    <section className="container py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">Contact & Socials</h2>
        <p className="text-muted-foreground max-w-2xl">
          Have questions or want to get involved? Reach out and follow us.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-sm text-muted-foreground">
            <a className="underline" href="mailto:girardmusicboosters@gmail.com">girardmusicboosters@gmail.com</a>
          </p>
        </div>
        <div>
          <h3 className="font-medium">Social</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <a className="underline" href="https://www.facebook.com/GirardMusicandDramaBoosters" target="_blank" rel="noopener noreferrer">
                Facebook — @GirardMusicandDramaBoosters
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-medium">Mailing Address</h3>
          <address className="not-italic text-sm text-muted-foreground">
            P.O. Box 425<br />
            Girard, PA 16417
          </address>
        </div>
      </div>
    </section>
  );
}
