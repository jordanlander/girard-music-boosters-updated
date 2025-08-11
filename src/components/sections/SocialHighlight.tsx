type Props = { facebookUrl: string };

export default function SocialHighlight({ facebookUrl }: Props) {
  const pageUrl = encodeURIComponent(facebookUrl);
  return (
    <section aria-labelledby="social-highlight" className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 id="social-highlight" className="font-display text-xl sm:text-2xl font-semibold">
          Follow us on Facebook
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          News, events, photos, and announcements updated regularly.
        </p>
        <div className="mt-4">
          <div className="w-full overflow-hidden rounded-md border border-border">
            <iframe
              title="Facebook Page Plugin"
              loading="lazy"
              style={{ border: 'none', width: '100%', height: 420 }}
              src={`https://www.facebook.com/plugins/page.php?href=${pageUrl}&tabs=timeline&width=500&height=420&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
          <div className="mt-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm underline"
              aria-label="Visit our Facebook page (opens in a new tab)"
            >
              Visit our Facebook page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
