import Image from "next/image";
import type { ReactNode } from "react";
import knessetFront from "@/assets/images/knesset-front.webp";

/**
 * The dark band that closes the home page: the Knesset building, in the site's
 * two colours, over the text passed in. The photo's credit line is required by
 * its licence (assets/images/CREDITS.md); names and licence codes only, so it
 * reads the same in both languages.
 */
export function KnessetBand({ alt, children }: { alt: string; children: ReactNode }) {
  return (
    <div className="bg-ink text-ink-foreground on-ink">
      <figure>
        <div className="relative">
          <Image
            src={knessetFront}
            alt={alt}
            sizes="100vw"
            className="h-56 w-full object-cover object-[56%_50%] sm:h-80 lg:h-[26rem]"
          />
          <div
            aria-hidden="true"
            className="to-ink absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent"
          />
        </div>
        <figcaption
          lang="en"
          dir="ltr"
          className="text-ink-muted mx-auto flex w-full max-w-[70rem] justify-end px-4 text-xs"
        >
          <span>
            <a
              href="https://commons.wikimedia.org/wiki/File:Knesset_front_side_-_2022.jpg"
              rel="noopener noreferrer"
              target="_blank"
              className="text-ink-foreground inline-block py-2 underline underline-offset-4"
            >
              Clema12 / Wikimedia Commons
            </a>
            {" · "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              rel="noopener noreferrer license"
              target="_blank"
              className="text-ink-foreground inline-block py-2 underline underline-offset-4"
            >
              CC BY-SA 4.0
            </a>
          </span>
        </figcaption>
      </figure>
      {children}
    </div>
  );
}
