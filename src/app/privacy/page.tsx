import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { isContactFormEnabled } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "What this website does and does not collect.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const formEnabled = isContactFormEnabled();

  return (
    <>
      <PageHeader eyebrow="Privacy" title="Privacy policy" description="A short, accurate description of the data this site handles." />
      <section className="container-content py-14 md:py-20">
        <div className="prose-article">
          <h2 id="summary">Summary</h2>
          <p>
            This is a personal portfolio website operated by {siteConfig.fullName}. It exists to present professional work. It does not use
            advertising, tracking cookies, or third-party analytics scripts.
          </p>

          <h2 id="data-collected">Data collected</h2>
          <p>
            Browsing the site does not create an account, set tracking cookies, or send your activity to analytics providers. The theme
            preference you choose with the light/dark toggle is stored in your browser&apos;s local storage and never leaves your device.
          </p>
          {formEnabled ? (
            <p>
              If you use the contact form, the name, email address, and message you enter are sent by email to the site owner through a
              transactional email provider. They are used only to reply to you and are not sold or shared for marketing.
            </p>
          ) : (
            <p>
              The contact page offers direct links such as email and professional profiles. No contact form submissions are processed or
              stored by this site.
            </p>
          )}

          <h2 id="server-logs">Server logs</h2>
          <p>
            Like most websites, the hosting server may keep standard access logs (IP address, requested URL, timestamp, user agent) for
            security and troubleshooting. These are retained only as long as needed for that purpose.
          </p>

          <h2 id="external-links">External links</h2>
          <p>
            Links to external sites such as GitHub or LinkedIn are governed by those sites&apos; own privacy policies.
          </p>

          <h2 id="contact">Questions</h2>
          <p>
            Questions about this policy can be sent through the{" "}
            <a href="/contact">contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
