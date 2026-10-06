/** An issue as the survey UI needs it, in the current language. */
export interface ClientIssue {
  id: string;
  title: string;
  description: string;
  moreInfo: string;
  question: string;
  options: { id: string; text: string }[];
}

/** Registry facts the result view needs to link parties (names come from the route's metadata). */
export interface ClientParty {
  id: string;
  name: string;
}
