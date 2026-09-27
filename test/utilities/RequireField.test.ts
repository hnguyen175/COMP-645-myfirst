import * as Vitest from "vitest";
import must from "../../www/ts/utilities/RequiredField";

Vitest.test("must tests for all scenarios", () => {
    Vitest.expect(() => must(null)).toThrow("required value was not found");
    Vitest.expect(() => must(undefined)).toThrow("required value was not found");
    Vitest.expect(() => must(123)).not.toThrow();
});