// ============================================================
//  INALEGWU EMMANUEL – VUG/SEN/22/7171
//  SEN 482 Calculator  |  Unique feature: Roman Numeral Converter
// ============================================================

"use strict";

// ── State ────────────────────────────────────────────────────
var currentExpression = "";
var LAST_RESULT = 0;

// ── Constants ────────────────────────────────────────────────
var OVERLINE = "\u0305"; // combining overline character
var MAX_ROMAN = 1000000000000; // 1 trillion

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

/**
 * Convert a number 0–999 to a Roman numeral string (no thousands).
 * Returns "" for 0.
 */
function toRomanGroup(num) {
  var val = [900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var sym = ["CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  var result = "";

  for (var i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      result += sym[i];
      num    -= val[i];
    }
  }
  return result;
}

/**
 * Convert a positive integer (1 – 1,000,000,000,000) to a Roman numeral
 * string.
 *
 * Numbers up to 3999 use standard Roman numerals.
 *
 * Numbers above 3999 use the traditional "vinculum" (overline) extension:
 * a combining overline character placed over a numeral multiplies its
 * value by 1000.
 *   - 1 overline  = ×1,000
 *   - 2 overlines = ×1,000,000
 *   - 3 overlines = ×1,000,000,000
 *   - 4 overlines = ×1,000,000,000,000  (so 1 trillion = "I" + 4 overlines)
 *
 * Returns null for out-of-range / non-integer values.
 */
function toRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > MAX_ROMAN) return null;

  // Standard range – identical to classic Roman numerals
  if (num <= 3999) {
    var val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    var sym = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    var result = "";

    for (var i = 0; i < val.length; i++) {
      while (num >= val[i]) {
        result += sym[i];
        num    -= val[i];
      }
    }
    return result;
  }

  // Extended range – split into base-1000 "digit groups"
  var groups = [];
  var n = num;

  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  groups.reverse(); // most significant group first

  var parts = [];
  for (var idx = 0; idx < groups.length; idx++) {
    var level = groups.length - 1 - idx; // how many overlines this group needs
    var g     = groups[idx];

    if (g === 0) continue;

    var roman = toRomanGroup(g);

    if (level > 0) {
      var lines = "";
      for (var l = 0; l < level; l++) lines += OVERLINE;
      roman = roman.split("").map(function (ch) { return ch + lines; }).join("");
    }
    parts.push(roman);
  }

  return parts.join(" ");
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
  var romanDiv  = document.getElementById("roman-display");
  var romanSpan = document.getElementById("roman-result");
  if (!romanDiv || !romanSpan) return;

  // Only show roman numeral when there's a plain positive integer on screen
  var trimmed = currentExpression.trim();
  var asInt   = parseInt(trimmed, 10);

  if (
    /^\d+$/.test(trimmed) &&     // pure digits only
    asInt >= 1 &&
    asInt <= MAX_ROMAN            // up to 1 trillion
  ) {
    var roman = toRoman(asInt);
    if (roman) {
      romanSpan.textContent  = roman;
      romanDiv.style.display = "flex";
    } else {
      romanDiv.style.display = "none";
    }
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
    // Standalone number: divide by 100
    currentExpression = String(parseFloat(match[1]) / 100);
  } else {
    // e.g. "200+50" → treat last number as % of left side
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
//  ROMAN NUMERAL CONVERTER BUTTON
// ============================================================

/**
 * Evaluates whatever is currently on screen, then forces the result
 * to be shown both as a plain number and (if 1 – 1,000,000,000,000)
 * as a Roman numeral.
 */
function convertToRoman() {
  if (!currentExpression) return;

  var result = calculateExpression(currentExpression);

  if (result === "Error" || !Number.isInteger(result) || result < 1 || result > MAX_ROMAN) {
    var romanDiv  = document.getElementById("roman-display");
    var romanSpan = document.getElementById("roman-result");
    if (romanSpan) romanSpan.textContent = "N/A";
    if (romanDiv)  romanDiv.style.display = "flex";
    return;
  }

  LAST_RESULT = result;
  currentExpression = String(result);
  updateDisplay(); // will also trigger updateRomanDisplay()
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
  module.exports = { calculateExpression, toRoman, toRomanGroup };
}