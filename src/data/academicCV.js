import cvData from "./cvData.json";
import journalPapers from "./journalPapers.json";

// Keep the website and downloadable CV's publication list in sync with the journal.
export const publications = journalPapers.map((paper) => ({
  id: paper.slug,
  Title: paper.title,
  Authors: paper.authors.join(", "),
  AuthorsList: paper.authors,
  Journal: paper.journal,
  Year: paper.year,
  Link: paper.url,
  pdf: paper.pdf,
}));

export const academicCV = cvData.map((section) =>
  section.name === "Published Papers" ? { ...section, list: publications } : section
);
