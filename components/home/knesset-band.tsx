import Image from "next/image";
import type { ReactNode } from "react";
import knessetFront from "@/assets/images/knesset-front.webp";

/**
 * The dark band that closes the home page: the Knesset building, in the site's
 * two colours, over the text passed in.
 */
export function KnessetBand({ alt, children }: { alt: string; children: ReactNode }) {
  return (
    <div className="bg-ink text-ink-foreground on-ink">
      <div className="relative">
        <Image
          src={knessetFront}
          alt={alt}
          sizes="100vw"
          className="h-56 w-full object-cover object-top sm:h-80 lg:h-[26rem]"
        />
        <div
          aria-hidden="true"
          className="to-ink absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent"
        />
      </div>
      {children}
    </div>
  );
}
