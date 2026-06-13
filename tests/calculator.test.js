// tests/calculator.test.js
// SEN 482 – Inalegwu Emmanuel VUG/SEN/22/7171
// Unit tests: core math + Roman numeral converter

const { calculateExpression, toRoman, toRomanGroup } = require("../assets/js/script.js");

const OVERLINE = "\u0305"; // combining overline character

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
//  toRoman — unique feature (standard range, 1–3999)
// ============================================================

describe("toRoman – basic conversions (1–3999)", () => {
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

  test("converts 3999 to MMMCMXCIX", () => {
    expect(toRoman(3999)).toBe("MMMCMXCIX");
  });
});

// ============================================================
//  toRoman — extended range (4000 and above, with overlines)
// ============================================================

describe("toRoman – extended conversions (4000+)", () => {
  test("converts 4000 to overlined IV (×1000)", () => {
    const expected = "I" + OVERLINE + "V" + OVERLINE;
    expect(toRoman(4000)).toBe(expected);
  });

  test("converts 5000 to overlined V (×1000)", () => {
    const expected = "V" + OVERLINE;
    expect(toRoman(5000)).toBe(expected);
  });

  test("converts 10000 to overlined X (×1000)", () => {
    const expected = "X" + OVERLINE;
    expect(toRoman(10000)).toBe(expected);
  });

  test("converts 3999000 correctly (mix of ×1000 group + base group)", () => {
    // 3999 thousand + 0 => overlined MMMCMXCIX
    const expected = "MMMCMXCIX".split("").map(ch => ch + OVERLINE).join("");
    expect(toRoman(3999000)).toBe(expected);
  });

  test("converts 1234567 to combination of ×1000 group and base group", () => {
    // 1234 (×1000, overlined) + 567 (plain)
    const thousandsPart = "MCCXXXIV".split("").map(ch => ch + OVERLINE).join("");
    const unitsPart = "DLXVII";
    expect(toRoman(1234567)).toBe(`${thousandsPart} ${unitsPart}`);
  });

  test("converts 1000000 to overlined I (×1,000,000 = two overlines)", () => {
    const expected = "I" + OVERLINE + OVERLINE;
    expect(toRoman(1000000)).toBe(expected);
  });

  test("converts 1000000000 to overlined I (×1,000,000,000 = three overlines)", () => {
    const expected = "I" + OVERLINE + OVERLINE + OVERLINE;
    expect(toRoman(1000000000)).toBe(expected);
  });

  test("converts 1000000000000 (1 trillion) to I with four overlines", () => {
    const expected = "I" + OVERLINE.repeat(4);
    expect(toRoman(1000000000000)).toBe(expected);
  });
});

// ============================================================
//  toRomanGroup — helper (0–999, no thousands)
// ============================================================

describe("toRomanGroup – sub-1000 grouping helper", () => {
  test("converts 0 to empty string", () => {
    expect(toRomanGroup(0)).toBe("");
  });

  test("converts 4 to IV", () => {
    expect(toRomanGroup(4)).toBe("IV");
  });

  test("converts 999 to CMXCIX", () => {
    expect(toRomanGroup(999)).toBe("CMXCIX");
  });

  test("converts 500 to D", () => {
    expect(toRomanGroup(500)).toBe("D");
  });
});

// ============================================================
//  toRoman — edge cases
// ============================================================

describe("toRoman – edge cases", () => {
  test("returns null for 0", () => {
    expect(toRoman(0)).toBeNull();
  });

  test("returns null for negative numbers", () => {
    expect(toRoman(-5)).toBeNull();
  });

  test("returns null for numbers above 1 trillion", () => {
    expect(toRoman(1000000000001)).toBeNull();
  });

  test("returns null for decimals", () => {
    expect(toRoman(3.5)).toBeNull();
  });

  test("returns null for non-integer input", () => {
    expect(toRoman("X")).toBeNull();
  });
});