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
          <div className="max-w-xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] lg:max-w-none">
            <p className="inline-flex items-center rounded-md bg-button px-4 py-2 text-sm font-semibold text-white shadow-sm">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">{subtitle}</p>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 sm:gap-8">
              {stats.map((item, index) => (
                <div key={item.label}>
                  <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                    <HeroStatCount
                      target={Number(item.digits)}
                      suffix={item.accent}
                      suffixClassName="text-button"
                      delayMs={index * 140}
                    />
                  </p>
                  <p className="mt-1 text-xs text-white/80 sm:text-sm">{item.label}</p>
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
