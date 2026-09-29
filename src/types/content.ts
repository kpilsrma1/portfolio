export type PublicationStatus = "published" | "draft";

export type ProjectCategory =
  | "Business Platform"
  | "Operations Platform"
  | "Records Platform";

export type MockupVariant = "dashboard" | "workflow" | "records";

export interface ArchitectureLayer {
  name: string;
  items: string[];
}

export interface ProjectSection {
  heading: string;
  body: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  /** Which original CSS mockup illustrates the card and hero. */
  mockup: MockupVariant;
  technologies: string[];
  role: string;
  /** Only set when the engagement dates have been verified. */
  duration?: string;
  /** Only set when a publicly reachable demo exists. */
  demoUrl?: string;
  /** Only set when the repository is public and sharing is authorised. */
  repositoryUrl?: string;
  confidential: boolean;
  featured: boolean;
  status: PublicationStatus;
  /**
   * False until the owner confirms the contribution list against the
   * résumé. The UI describes contributions at a functional level while this
   * is false.
   */
  contributionsVerified: boolean;

  businessProblem: string[];
  usersAndWorkflow: string[];
  functionalAreas: string[];
  contributions: string[];
  architecture: ArchitectureLayer[];
  challenges: ProjectSection[];
  decisions: ProjectSection[];
  outcomes: string[];
  relatedSlugs: string[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  /** Free-text date range. Omitted while unverified. */
  dateRange?: string;
  datesVerified: boolean;
  current: boolean;
  location?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export interface SkillGroup {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  field?: string;
  detail?: string;
}

export interface Principle {
  title: string;
  description: string;
}

export interface UsesCategory {
  name: string;
  items: { name: string; note: string }[];
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  status: PublicationStatus;
  author?: string;
  updated?: string;
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string;
  readingTime: string;
  wordCount: number;
}

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}
