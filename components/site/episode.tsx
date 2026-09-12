"use client";

import Image from "next/image";
import { useState } from "react";
import { Ic } from "./icons";
import type { Episode } from "@/lib/content";

/**
 * One podcast episode.
 *
 * The YouTube player is not mounted until someone asks for it. Three embedded
 * iframes on a page cost roughly a megabyte of third-party script and set
 * cookies before anyone has pressed anything; the poster is a local image and
 * the iframe arrives on the click that wants it. `youtube-nocookie` for the
 * same reason the live site uses it.
 *
 * @param variant `card` is the three-up grid on the home page; `row` is the
 *   full-width alternating layout on the podcast page.
 */
export function EpisodeItem({
  ep,
  variant = "card",
  priority = false,
}: {
  ep: Episode;
  variant?: "card" | "row";
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${ep.youtubeId}`;

  return (
    <article className={variant === "row" ? "s-eprow" : "s-ep"} data-reveal>
      <div className="s-ep__media">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}?autoplay=1&rel=0`}
            title={ep.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={ep.poster}
              alt=""
              width={1280}
              height={720}
              priority={priority}
              sizes={variant === "row" ? "(max-width: 860px) 100vw, 45vw" : "(max-width: 1080px) 100vw, 33vw"}
            />
            <button
              className="s-ep__play"
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${ep.title}`}
            >
              <span>
                <Ic n="play" size={24} fill />
              </span>
            </button>
          </>
        )}
      </div>

      <div className="s-ep__body">
        <p className="s-ep__code">{ep.code}</p>
        <h3 className="s-ep__t">{ep.title}</h3>
        <p className="s-ep__g">{ep.guests}</p>
        <p className="s-ep__s">{ep.summary}</p>
        <p className="s-ep__foot">
          <a
            className="s-link"
            href={watchUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Watch on YouTube
            <Ic n="arrowUpR" size={16} />
          </a>
        </p>
      </div>
    </article>
  );
}
