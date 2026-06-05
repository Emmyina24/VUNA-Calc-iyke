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

/**
 * Convert a positive integer (1–3999) to a Roman numeral string.
 * Returns null for out-of-range values.
 */
function toRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return null;

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

  // Only show roman numeral when there's a plain integer on screen
  var trimmed = currentExpression.trim();
  var asInt   = parseInt(trimmed, 10);

  if (
    /^\d+$/.test(trimmed) &&          // pure digits only
    asInt >= 1 &&
    asInt <= 3999
  ) {
    romanSpan.textContent  = toRoman(asInt);
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
  module.exports = { calculateExpression, toRoman };
}