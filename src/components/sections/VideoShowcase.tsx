import React from "react";

interface VideoItem {
  src: string;
  title: string;
}

export default function VideoShowcase({ videos }: { videos: VideoItem[] }) {
  if (videos.length === 0) return null;
  const video = videos[0];
  return (
    <section id="videos" className="py-12 bg-background text-foreground">
      <div className="container">
        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold">Band Videos</h2>
          <p className="text-muted-foreground">Watch our musicians in action.</p>
        </div>
        <div className="max-w-4xl mx-auto relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute inset-y-0 left-0 w-4 bg-primary" aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 w-4 bg-primary" aria-hidden="true" />
          <video src={video.src} controls className="w-full h-full" title={video.title} />
        </div>
      </div>
    </section>
  );
}
