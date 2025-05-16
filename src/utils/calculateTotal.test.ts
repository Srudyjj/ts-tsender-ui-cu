import { describe, expect, it } from "vitest";
import { calculateTotal } from "./calculateTotal"; // Import the function to test

// 'describe' groups related tests for the 'calculateTotal' function
describe("calculateTotal", () => {
  // 'it' defines a specific test case or scenario
  it("should sum numbers separated by newlines", () => {
    const input = "100\n200\n50";
    const expectedOutput = 350;
    // 'expect' makes an assertion: does the actual output match the expected output?
    expect(calculateTotal(input)).toBe(expectedOutput);
  });

  it("should sum numbers separated by commas", () => {
    expect(calculateTotal("100,200,75")).toBe(375);
  });

  it("should handle a single number", () => {
    expect(calculateTotal("500")).toBe(500);
  });

  it("should return 0 for an empty string", () => {
    expect(calculateTotal("")).toBe(0);
  });
});
