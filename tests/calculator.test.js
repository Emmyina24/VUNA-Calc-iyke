// tests/calculator.test.js
// SEN 482 – Inalegwu Emmanuel VUG/SEN/22/7171
// Unit tests: core math + Roman numeral converter

const { calculateExpression, toRoman } = require("../assets/js/script.js");

// ============================================================
//  calculateExpression — core math
// ============================================================

describe("calculateExpression – basic arithmetic", () => {
  test("adds two numbers", () => {
    expect(calculateExpression("2+3")).toBe(5);
  });

  test("subtracts two numbers", () => {
    expect(calculateExpression("10-4")).toBe(6);
  });

  test("multiplies two numbers", () => {
    expect(calculateExpression("6*7")).toBe(42);
  });

  test("divides two numbers", () => {
    expect(calculateExpression("20/4")).toBe(5);
  });

  test("handles decimal arithmetic", () => {
    expect(calculateExpression("1.5+2.5")).toBe(4);
  });

  test("respects operator precedence (BODMAS)", () => {
    expect(calculateExpression("2+3*4")).toBe(14);
  });

  test("handles chained operations", () => {
    expect(calculateExpression("100-20-30")).toBe(50);
  });
});

describe("calculateExpression – edge cases", () => {
  test("returns Error for division by zero", () => {
    expect(calculateExpression("5/0")).toBe("Error");
  });

  test("returns Error for empty string", () => {
    expect(calculateExpression("")).toBe("Error");
  });

  test("returns Error for letters", () => {
    expect(calculateExpression("abc")).toBe("Error");
  });

  test("returns Error for null input", () => {
    expect(calculateExpression(null)).toBe("Error");
  });

  test("evaluates zero correctly", () => {
    expect(calculateExpression("0")).toBe(0);
  });

  test("handles large numbers", () => {
    expect(calculateExpression("999999+1")).toBe(1000000);
  });
});

// ============================================================
//  toRoman — unique feature
// ============================================================

describe("toRoman – basic conversions", () => {
  test("converts 1 to I", () => {
    expect(toRoman(1)).toBe("I");
  });

  test("converts 4 to IV", () => {
    expect(toRoman(4)).toBe("IV");
  });

  test("converts 9 to IX", () => {
    expect(toRoman(9)).toBe("IX");
  });

  test("converts 14 to XIV", () => {
    expect(toRoman(14)).toBe("XIV");
  });

  test("converts 40 to XL", () => {
    expect(toRoman(40)).toBe("XL");
  });

  test("converts 90 to XC", () => {
    expect(toRoman(90)).toBe("XC");
  });

  test("converts 400 to CD", () => {
    expect(toRoman(400)).toBe("CD");
  });

  test("converts 900 to CM", () => {
    expect(toRoman(900)).toBe("CM");
  });

  test("converts 1000 to M", () => {
    expect(toRoman(1000)).toBe("M");
  });

  test("converts 1994 to MCMXCIV", () => {
    expect(toRoman(1994)).toBe("MCMXCIV");
  });

  test("converts 2024 to MMXXIV", () => {
    expect(toRoman(2024)).toBe("MMXXIV");
  });

  test("converts 3999 to MMMCMXCIX (max value)", () => {
    expect(toRoman(3999)).toBe("MMMCMXCIX");
  });
});

describe("toRoman – edge cases (extended output)", () => {
  const OVERLINE = "\u0305";

  test("zero represented as 'N'", () => {
    expect(toRoman(0)).toBe("N");
  });

  test("negative numbers are signed (e.g. -5 -> -V)", () => {
    expect(toRoman(-5)).toBe("-V");
  });

  test("numbers >= 4000 use overline grouping", () => {
    const expected = "I" + OVERLINE + "V" + OVERLINE; // 4000 -> overlined IV
    expect(toRoman(4000)).toBe(expected);
  });

  test("returns null for decimals", () => {
    expect(toRoman(3.5)).toBeNull();
  });

  test("returns null for non-integer input", () => {
    expect(toRoman("X")).toBeNull();
  });
});