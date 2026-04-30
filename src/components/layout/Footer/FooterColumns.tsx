import Link from "next/link";

import { BrandLogoImg } from "@/components/layout/BrandLogo";
import { siteConfig } from "@/config/site";
function BrandBlock() {
  return (
    <div>
      <Link href="/" className="inline-flex bg-white">
        <BrandLogoImg imgClassName="md:h-14" />
      </Link>
      <p className="mt-5 max-w-xs text-sm leading-relaxed text-footer-muted">{siteConfig.address}</p>
      
    </div>
   

  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-3 text-sm  text-white">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition hover:text-footer-muted">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterColumns() {
  const { footerColumns } = siteConfig;

  return (
    <div className="bg-footer-bg px-4 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <BrandBlock />
        <LinkColumn title={footerColumns.forClients.title} links={footerColumns.forClients.links} />
        <LinkColumn title={footerColumns.resources.title} links={footerColumns.resources.links} />
        <LinkColumn title={footerColumns.jobCategories.title} links={footerColumns.jobCategories.links} />
      </div>
    </div>
  );
}
