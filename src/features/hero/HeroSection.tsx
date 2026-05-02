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

      <div className="absolute inset-0 z-10 flex flex-col justify-center px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-32 lg:px-8 lg:pb-36">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-20">
          <div className="max-w-2xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)] lg:max-w-none">
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-lg px-4 py-2 text-xs font-medium text-white/90 border border-white/20">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/60"></span>
              {eyebrow}
            </div>
            <h1 className="mt-8 text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl">
              {title}
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg font-light">{subtitle}</p>

            <div className="mt-16 grid max-w-md grid-cols-3 gap-10 sm:gap-12">
              {stats.map((item, index) => (
                <div key={item.label} className="border-l border-white/15 pl-8 first:border-0 first:pl-0">
                  <p className="text-4xl font-light text-white sm:text-5xl">
                    <HeroStatCount
                      target={Number(item.digits)}
                      suffix={item.accent}
                      suffixClassName="text-white/80 text-2xl font-light"
                      delayMs={index * 140}
                    />
                  </p>
                  <p className="mt-4 text-xs text-white/70 font-light uppercase tracking-widest sm:text-xs">{item.label}</p>
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
