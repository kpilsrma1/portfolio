import type { Principle } from "@/types/content";

export const principles: Principle[] = [
  {
    title: "Maintainability first",
    description:
      "Code is read and changed far more often than it is written. Clear names, small modules, and predictable structure make the next change cheaper.",
  },
  {
    title: "Reliable APIs",
    description:
      "Explicit contracts, validation at the boundary, and consistent error handling so that consumers can trust what they get back.",
  },
  {
    title: "Clear separation of concerns",
    description:
      "Business rules stay independent of frameworks and storage. That keeps them testable and lets infrastructure change without rewrites.",
  },
  {
    title: "Secure handling of data",
    description:
      "Least privilege, server-side authorisation, and no secrets in code. Tenant and user boundaries are enforced in the data layer.",
  },
  {
    title: "Performance-conscious implementation",
    description:
      "Measure before optimising, then fix the query, the index, or the render path that actually matters.",
  },
  {
    title: "Practical problem solving",
    description:
      "Understand the workflow behind the request, deliver the simplest thing that solves it well, and leave room to grow.",
  },
];
