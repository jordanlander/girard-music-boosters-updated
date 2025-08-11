type Props = { facebookUrl: string };

export default function SocialHighlight({ facebookUrl }: Props) {
  const pageUrl = encodeURIComponent(facebookUrl);
  return (
    <section aria-labelledby="social-highlight" className="bg-card border border-border rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 text-center">
        <h2 id="social-highlight" className="font-display text-xl sm:text-2xl font-semibold">
          Follow us on Facebook
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          News, events, photos, and announcements updated regularly.
        </p>
        <div className="mt-4">
          <div className="mx-auto w-full max-w-2xl sm:max-w-4xl overflow-hidden rounded-md border border-border">
            <iframe
              title="Facebook Page Plugin"
              loading="lazy"
              className="w-full h-[520px] sm:h-[620px] lg:h-[700px] border-0"
              src={`https://www.facebook.com/plugins/page.php?href=${pageUrl}&tabs=timeline&width=1000&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
          <div className="mt-3 flex justify-center">
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
