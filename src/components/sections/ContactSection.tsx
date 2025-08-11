export default function ContactSection() {
  return (
    <section className="container py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">Contact & Socials</h2>
        <p className="text-muted-foreground max-w-2xl">
          Have questions or want to get involved? Reach out and follow us.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-sm text-muted-foreground">
            <a className="underline" href="mailto:girardboosters@example.com">girardboosters@example.com</a>
          </p>
        </div>
        <div>
          <h3 className="font-medium">Social</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><a className="underline" href="#">Facebook</a></li>
            <li><a className="underline" href="#">Instagram</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
