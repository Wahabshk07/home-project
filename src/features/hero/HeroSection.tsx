import Image from "next/image";

import { heroContent } from "./content";
import { HeroSearchCard } from "./HeroSearchCard";
import { HeroStatCount } from "./HeroStatCount";

/**
 * Full-width hero: left copy + stats, right search card.
 */
export function HeroSection() {
  const { image, eyebrow, title, subtitle, stats } = heroContent;

  return (
    <section className="relative w-full max-w-none overflow-hidden bg-white">
      <div className="relative w-full min-w-0 bg-white">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          className="block h-auto w-full max-w-none"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 pb-28 pt-28 sm:px-6 sm:pb-32 sm:pt-32 lg:px-8 lg:pb-36">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
          <div className="max-w-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] lg:max-w-none">
            <div className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-lg border border-white/20">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
              {eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/95 sm:text-xl">{subtitle}</p>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-8 sm:gap-10">
              {stats.map((item, index) => (
                <div key={item.label} className="border-l border-white/20 pl-6 first:border-0 first:pl-0">
                  <p className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                    <HeroStatCount
                      target={Number(item.digits)}
                      suffix={item.accent}
                      suffixClassName="text-cyan-300 text-2xl"
                      delayMs={index * 140}
                    />
                  </p>
                  <p className="mt-3 text-xs text-white/75 font-medium uppercase tracking-wide sm:text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full justify-self-end lg:max-w-md xl:max-w-lg">
            <HeroSearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}
