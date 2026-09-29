import type { EducationEntry } from "@/types/content";

/**
 * Institutions and years are not published until they are confirmed.
 */
export const education: EducationEntry[] = [
  {
    id: "mca",
    degree: "Master of Computer Applications (MCA)",
  },
  {
    id: "bsc-cs",
    degree: "Bachelor of Science",
    field: "Computer Science",
    detail: "68%",
  },
];
