import { ContactCta } from "@/components/sections/contact-cta";
import { ExperiencePreview } from "@/components/sections/experience-preview";
import { Expertise } from "@/components/sections/expertise";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";
import { Principles } from "@/components/sections/principles";
import { Writing } from "@/components/sections/writing";
import { getPublishedPosts } from "@/lib/blog";
import { hasResumeFile } from "@/lib/resume";

export default async function HomePage() {
  const [posts, hasResume] = await Promise.all([getPublishedPosts(), hasResumeFile()]);

  return (
    <>
      <Hero hasResume={hasResume} />
      <FeaturedProjects />
      <Expertise />
      <ExperiencePreview />
      <Principles />
      <Writing posts={posts} />
      <ContactCta />
    </>
  );
}
