// ============================================================
//  INALEGWU EMMANUEL – VUG/SEN/22/7171
//  SEN 482 Calculator  |  Unique feature: Roman Numeral Converter
// ============================================================

"use strict";

// ── State ────────────────────────────────────────────────────
var currentExpression = "";
var LAST_RESULT = 0;

// ============================================================
//  CORE MATH HELPERS  (exported for Jest)
// ============================================================

/**
 * Safely evaluate a numeric expression string.
 * Returns a number, or the string "Error".
 */
function calculateExpression(expression) {
  if (!expression || expression.trim() === "") return "Error";
  try {
    // Only allow safe characters: digits, operators, dot, space, parentheses
    if (!/^[0-9+\-*/.() %\s]+$/.test(expression)) return "Error";

    var result = eval(expression);

    if (typeof result !== "number" || isNaN(result) || !isFinite(result)) {
      return "Error";
    }
    return result;
  } catch (e) {
    return "Error";
  }
}

// Helper: convert a number in the range 0–999 to plain Roman numerals.
// Returns empty string for 0.
function toRomanGroup(n) {
  var val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var sym = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  var num = Number(n);
  if (!Number.isInteger(num) || num < 0) return null;
  if (num === 0) return "";

  var result = "";
  for (var i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      result += sym[i];
      num -= val[i];
    }
  }
  return result;
}

/**
 * Convert ANY integer (zero, negative, or arbitrarily large) into a
 * Roman numeral string using group-overline (vinculum) notation for
 * values >= 4000. Returns null only for non-integer input.
 */
function toRoman(num) {
  if (!Number.isInteger(num)) return null;
  if (num === 0) return "N"; // "nulla"

  var negative = num < 0;
  if (negative) num = -num;

  if (num < 4000) {
    return (negative ? "-" : "") + toRomanGroup(num);
  }

  var groups = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  var result = "";
  for (var g = groups.length - 1; g >= 0; g--) {
    var digit = groups[g];
    if (digit === 0) continue;
    var romanPart = toRomanGroup(digit);
    if (g > 0) {
      var overline = "\u0305".repeat(g);
      romanPart = romanPart.split("").map(function (ch) { return ch + overline; }).join("");
    }
    result += romanPart;
  }

  return (negative ? "-" : "") + result;
}

/**
 * BigInt-aware variant that accepts a decimal-digit string (optionally
 * prefixed with '-') and returns same overline-grouped result.
 */
function toRomanBig(numStr) {
  if (!/^-?\d+$/.test(numStr)) return null;
  var negative = numStr[0] === "-";
  if (negative) numStr = numStr.slice(1);
  var big = BigInt(numStr);
  if (big === 0n) return "N";

  var val = [1000n, 900n, 500n, 400n, 100n, 90n, 50n, 40n, 10n, 9n, 5n, 4n, 1n];
  var sym = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];

  function basicRomanBig(n) {
    var res = "";
    for (var i = 0; i < val.length; i++) {
      while (n >= val[i]) {
        res += sym[i];
        n -= val[i];
      }
    }
    return res;
  }

  if (big < 4000n) return (negative ? "-" : "") + basicRomanBig(big);

  var groups = [];
  while (big > 0n) {
    groups.push(Number(big % 1000n));
    big = big / 1000n;
  }

  var result = "";
  for (var g = groups.length - 1; g >= 0; g--) {
    var digit = groups[g];
    if (digit === 0) continue;
    var romanPart = basicRomanBig(BigInt(digit));
    if (g > 0) {
      var overline = "\u0305".repeat(g);
      romanPart = romanPart.split("").map(function (ch) { return ch + overline; }).join("");
    }
    result += romanPart;
  }

  return (negative ? "-" : "") + result;
}

// ============================================================
//  UI HELPERS
// ============================================================

function updateDisplay() {
  var display = document.getElementById("result");
  if (display) display.value = currentExpression || "0";
  updateRomanDisplay();
}

function updateRomanDisplay() {
  var romanDiv    = document.getElementById("roman-display");
  var romanSpan   = document.getElementById("roman-result");
  if (!romanDiv || !romanSpan) return;

  var trimmed = currentExpression.trim();
  var numbers = trimmed.match(/-?\d+\.?\d*/g);
  var match   = numbers ? numbers[numbers.length - 1] : null;

  if (match) {
    var numStr = match.split(".")[0];
    var asInt  = parseInt(numStr, 10);
    var roman;
    if (!Number.isSafeInteger(asInt) && /^-?\d+$/.test(numStr)) {
      roman = toRomanBig(numStr);
    } else {
      roman = toRoman(asInt);
    }
    romanSpan.textContent  = roman;
    romanDiv.style.display = "flex";
  } else {
    romanDiv.style.display = "none";
  }
}

// ============================================================
//  BUTTON HANDLERS
// ============================================================

function appendToResult(value) {
  currentExpression += value.toString();
  updateDisplay();
}

function operatorToResult(value) {
  currentExpression += value;
  updateDisplay();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay();
}

function clearResult() {
  currentExpression = "";
  updateDisplay();
}

function percentToResult() {
  if (!currentExpression) return;

  var match = currentExpression.match(/^([\d.]+)$/);
  if (match) {
    currentExpression = String(parseFloat(match[1]) / 100);
  } else {
    var parts = currentExpression.match(/^(.+?)([+\-*/])(\d+\.?\d*)$/);
    if (parts) {
      var left    = parseFloat(parts[1]);
      var op      = parts[2];
      var pct     = parseFloat(parts[3]);
      var pctVal  = (left * pct) / 100;
      currentExpression = parts[1] + op + pctVal;
    }
  }
  updateDisplay();
}

function calculateResult() {
  if (!currentExpression) return;

  var result = calculateExpression(currentExpression);
  if (result === "Error") {
    currentExpression = "Error";
  } else {
    LAST_RESULT = result;
    currentExpression = String(result);
  }
  updateDisplay();
}

// ============================================================
//  THEME TOGGLE
// ============================================================

function toggleTheme() {
  var body = document.body;
  var btn  = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    if (btn) { btn.innerHTML = "☀️"; btn.title = "Switch to light mode"; }
    localStorage.setItem("theme", "dark");
  } else {
    if (btn) { btn.innerHTML = "🌙"; btn.title = "Switch to dark mode"; }
    localStorage.setItem("theme", "light");
  }
}

// ============================================================
//  INIT  (browser only – skipped by Jest/Node)
// ============================================================

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", function () {
    var theme = localStorage.getItem("theme");
    var btn   = document.getElementById("theme-toggle");

    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (btn) { btn.innerHTML = "☀️"; btn.title = "Switch to light mode"; }
    } else {
      if (btn) { btn.innerHTML = "🌙"; btn.title = "Switch to dark mode"; }
    }
  });
}

// ============================================================
//  EXPORTS  (Jest / Node – ignored in browser)
// ============================================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateExpression, toRoman, toRomanBig, toRomanGroup };
}