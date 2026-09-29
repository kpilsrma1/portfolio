import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="container-content flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-h1 font-semibold text-foreground">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-foreground-secondary">
        The address may be mistyped, or the page may have moved. The links below lead back to the main sections.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" className="h-11 px-5">
          <Link href="/">
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-start" />
            Back to home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-5">
          <Link href="/projects">View projects</Link>
        </Button>
      </div>
    </section>
  );
}
