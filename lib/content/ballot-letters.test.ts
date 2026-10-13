import { describe, expect, it } from "vitest";
import { ballotLetterCount, ballotLetterScale } from "./ballot-letters";

describe("ballot letter scale", () => {
  it("counts letters, not code units or surrounding space", () => {
    expect(ballotLetterCount("ל")).toBe(1);
    expect(ballotLetterCount(" זץ ")).toBe(2);
    expect(ballotLetterCount("מחל")).toBe(3);
    expect(ballotLetterCount("ודעם")).toBe(4);
    // A letter with a combining mark is one letter.
    expect(ballotLetterCount("שׁס")).toBe(2);
  });

  it("sets one, two and three letters at the same size, and only longer codes smaller", () => {
    expect(ballotLetterScale("ט")).toBe("regular");
    expect(ballotLetterScale("זץ")).toBe("regular");
    expect(ballotLetterScale("אמת")).toBe("regular");
    expect(ballotLetterScale("ודעם")).toBe("narrow");
    expect(ballotLetterScale("ודעםם")).toBe("narrow");
  });
});
