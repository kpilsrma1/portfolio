import { PageHeader } from "@/components/page-header";
import { uses } from "@/data/uses";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Uses",
  description: "The languages, frameworks, databases, and operations tools in day-to-day use.",
  path: "/uses",
});

export default function UsesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Uses"
        title="Tools and technologies I actually use"
        description="A current snapshot of the stack behind my professional work. It changes as projects change."
      />
      <section className="container-content py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          {uses.map((category) => (
            <section key={category.name} aria-labelledby={`uses-${slug(category.name)}`}>
              <h2 id={`uses-${slug(category.name)}`} className="text-h3 font-semibold text-foreground">
                {category.name}
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
                {category.items.map((item) => (
                  <li key={item.name} className="p-4 md:p-5">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">{item.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
