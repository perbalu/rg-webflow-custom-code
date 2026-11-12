(function () {
  "use strict";

  if (window.RGRichText && window.RGRichText.refresh) {
    window.RGRichText.refresh(document);
    return;
  }

  var ROOT = ".w-richtext";
  var EXCLUDED = "script,style,pre,code,textarea,iframe,svg,math,[contenteditable='true']";
  var TEXT_SCOPE = "p,h1,h2,h3,h4,h5,h6,li,blockquote,figcaption";
  var BOUNDARY = /^(P|H[1-6]|LI|BLOCKQUOTE|FIGCAPTION|UL|OL|DIV|FIGURE|TABLE|SECTION|ARTICLE|ASIDE|NAV|HEADER|FOOTER|HR)$/;
  var palette = {
    "rg": ["--_primitives---colors--rg", "#004f85"],
    "rg-darker": ["--_primitives---colors--rg-darker", "#002f50"],
    "rg-dark": ["--_primitives---colors--rg-dark", "#003f6a"],
    "rg-darkest": ["--_primitives---colors--rg-darkest", "#000d15"],
    "rg-light": ["--_primitives---colors--rg-light", "#6695b6"],
    "rg-lighter": ["--_primitives---colors--rg-lighter", "#ccdce7"],
    "rg-lightest": ["--_primitives---colors--rg-lightest", "#e5edf3"],
    "rg-lightest-2": ["--_primitives---colors--rg-lightest-2", "#f0f4f8"],
    "rg-button-light": ["--_primitives---colors--rg-button-light", "#d6e3eb"],
    "rg-button-lighter": ["--_primitives---colors--rg-button-lighter", "#ebf1f5"],
    "white": ["--_primitives---colors--white", "#ffffff"],
    "beige": ["--_primitives---colors--beige", "#cfbaaf"],
    "grey300": ["--_primitives---colors--grey300", "#434d56"],
    "text": ["--color-scheme-1--text", "#434d56"],
    "neutral": ["--_primitives---colors--neutral", "#858585"],
    "neutral-light": ["--_primitives---colors--neutral-light", "#b6b6b6"],
    "neutral-lighter": ["--_primitives---colors--neutral-lighter", "#e6e7e7"],
    "neutral-lightest": ["--_primitives---colors--neutral-lightest", "#f9f9f9"],
    "neutral-dark": ["--_primitives---colors--neutral-dark", "#545454"],
    "neutral-darker": ["--_primitives---colors--neutral-darker", "#242424"],
    "neutral-darkest": ["--_primitives---colors--neutral-darkest", "#00101b"],
    "error": ["--_primitives---colors--error", "#c5192a"]
  };
  var allowedHex = new Set(Object.keys(palette).map(function (key) { return palette[key][1]; }));
  var edges = ["top", "right", "bottom", "left"];
  var edgeKeys = ["t", "r", "b", "l"];
  var pending = new Set();
  var scheduled = false;

  function own(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function lengthValue(value) {
    value = value.trim().toLowerCase();
    if (value === "0") return "0";
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem)$/.test(value)) return null;
    return Number.isFinite(parseFloat(value)) ? value : null;
  }

  function colorValue(value) {
    value = value.trim().toLowerCase();
    if (own(palette, value)) {
      return "var(" + palette[value][0] + ", " + palette[value][1] + ")";
    }
    return /^#[0-9a-f]{6}$/.test(value) && allowedHex.has(value) ? value : null;
  }

  function attributes(source) {
    var result = Object.create(null);
    source = source.replace(/[\u201c\u201d]/g, '"');
    while (source.trim()) {
      var match = /^\s+([a-z][a-z0-9-]*)\s*=\s*"([^"\r\n]*)"/.exec(source);
      if (!match || own(result, match[1])) return null;
      result[match[1]] = match[2];
      source = source.slice(match[0].length);
    }
    return result;
  }

  function marker(source) {
    var match = /^\[\[(\/?)(text|block|space)\b([\s\S]*?)\]\]$/.exec(source);
    if (!match) return null;
    return { name: match[2], closing: match[1] === "/", attrs: attributes(match[3]) };
  }

  function textSettings(attrs) {
    if (!attrs) return null;
    var settings = {};
    for (var key of Object.keys(attrs)) {
      var value;
      if (key === "color") value = colorValue(attrs[key]);
      else if (key === "size" || key === "size-mobile") value = lengthValue(attrs[key]);
      else if (key === "underline" && /^(true|false)$/.test(attrs[key])) value = attrs[key] === "true";
      else return null;
      if (value === null) return null;
      settings[key] = value;
    }
    return settings;
  }

  function spacingValues(value) {
    var values = value.trim().split(/\s+/).map(lengthValue);
    if (values.length < 1 || values.length > 2 || values.some(function (v) { return v === null; })) return null;
    return [values[0], values[1] || values[0], values[0], values[1] || values[0]];
  }

  function blockSettings(attrs) {
    if (!attrs) return null;
    for (var key of Object.keys(attrs)) {
      var base = key.replace(/-mobile$/, "");
      if (base === "align") {
        if (!["left", "center", "right"].includes(attrs[key])) return null;
      } else if (key === "list") {
        if (attrs[key] !== "square") return null;
      } else if (base === "margin" || base === "padding") {
        if (!spacingValues(attrs[key])) return null;
      } else if (/^(margin|padding)-(top|right|bottom|left)$/.test(base)) {
        if (lengthValue(attrs[key]) === null) return null;
      } else return null;
    }
    return attrs;
  }

  function spaceSettings(attrs) {
    if (!attrs || !own(attrs, "height")) return null;
    var result = {};
    for (var key of Object.keys(attrs)) {
      if (key !== "height" && key !== "height-mobile") return null;
      var value = lengthValue(attrs[key]);
      if (value === null) return null;
      result[key] = value;
    }
    return result;
  }

  function applySpacing(element, attrs, mobile) {
    var suffix = mobile ? "-mobile" : "";
    ["margin", "padding"].forEach(function (property) {
      var shorthand = attrs[property + suffix];
      var values = shorthand === undefined ? [] : spacingValues(shorthand);
      edges.forEach(function (edge, index) {
        var explicit = attrs[property + "-" + edge + suffix];
        var value = explicit === undefined ? values[index] : lengthValue(explicit);
        if (value !== undefined) {
          element.style.setProperty("--rg-rt-" + property[0] + edgeKeys[index] + suffix, value);
        }
      });
    });
  }

  function applyBlock(element, attrs, root) {
    element.setAttribute("data-rg-rt-block", "");
    applySpacing(element, attrs, false);
    applySpacing(element, attrs, true);
    ["align", "align-mobile"].forEach(function (key) {
      if (own(attrs, key)) {
        element.style.setProperty("--rg-rt-" + key, attrs[key]);
        element.setAttribute("data-rg-rt-" + key, "");
      }
    });
    if (attrs.list === "square") {
      element.querySelectorAll("ul").forEach(function (list) {
        if (list.closest(ROOT) === root) {
          list.setAttribute("data-rg-rt-square", "");
          if (!list.hasAttribute("role")) list.setAttribute("role", "list");
        }
      });
    }
  }

  function standaloneMarkers(root) {
    var result = [];
    root.querySelectorAll("p").forEach(function (paragraph) {
      if (paragraph.closest(ROOT) !== root || paragraph.closest(EXCLUDED)) return;
      if (paragraph.querySelector("img,video,iframe,svg,figure,br")) return;
      var token = marker(paragraph.textContent.trim());
      if (token && token.name !== "text") result.push({ element: paragraph, token: token });
    });
    return result;
  }

  function processStructure(root) {
    var found = standaloneMarkers(root);
    var stack = [];
    var pairs = [];
    found.forEach(function (item) {
      var token = item.token;
      if (token.name !== "block") return;
      if (!token.closing) {
        if (stack.length) stack.forEach(function (entry) { entry.valid = false; });
        stack.push({ item: item, settings: blockSettings(token.attrs), valid: stack.length === 0 });
      } else if (stack.length) {
        var entry = stack.pop();
        var closingValid = token.attrs && Object.keys(token.attrs).length === 0;
        if (entry.valid && entry.settings && closingValid && !stack.length && entry.item.element.parentNode === item.element.parentNode) {
          pairs.push({ start: entry.item.element, end: item.element, settings: entry.settings });
        }
      }
    });
    pairs.forEach(function (pair) {
      var parent = pair.start.parentNode;
      if (!parent || pair.end.parentNode !== parent) return;
      var node = pair.start.nextSibling;
      while (node && node !== pair.end) node = node.nextSibling;
      if (!node) return;
      var wrapper = document.createElement("div");
      parent.insertBefore(wrapper, pair.start);
      while (pair.start.nextSibling !== pair.end) wrapper.appendChild(pair.start.nextSibling);
      pair.start.remove();
      pair.end.remove();
      applyBlock(wrapper, pair.settings, root);
    });
    found.forEach(function (item) {
      if (item.token.name !== "space" || item.token.closing || !root.contains(item.element)) return;
      var settings = spaceSettings(item.token.attrs);
      if (!settings) return;
      var spacer = document.createElement("div");
      spacer.setAttribute("data-rg-rt-space", "");
      spacer.setAttribute("aria-hidden", "true");
      spacer.style.setProperty("--rg-rt-height", settings.height);
      if (settings["height-mobile"] !== undefined) spacer.style.setProperty("--rg-rt-height-mobile", settings["height-mobile"]);
      item.element.replaceWith(spacer);
    });
  }

  function inlineRuns(scope, root) {
    var runs = [];
    var run = [];
    function flush() {
      if (run.some(function (entry) { return entry.node; })) runs.push(run);
      run = [];
    }
    function visit(node) {
      if (node.nodeType === 3) {
        run.push({ node: node, value: node.nodeValue });
      } else if (node.nodeType === 1) {
        if (node !== scope && (node.matches(EXCLUDED) || node.matches(ROOT) || BOUNDARY.test(node.tagName))) {
          flush();
          return;
        }
        if (node.tagName === "BR") {
          run.push({ node: null, value: "\n" });
          return;
        }
        Array.from(node.childNodes).forEach(visit);
      }
    }
    if (scope.closest(ROOT) === root) visit(scope);
    flush();
    return runs;
  }

  function validTextPairs(text) {
    var expression = /\[\[(\/?)(text|block|space)\b([\s\S]*?)\]\]/g;
    var stack = [];
    var pairs = [];
    var match;
    while ((match = expression.exec(text))) {
      if (match[2] !== "text") continue;
      var attrs = attributes(match[3]);
      if (!match[1]) {
        if (stack.length) stack.forEach(function (entry) { entry.valid = false; });
        stack.push({ start: match.index, end: expression.lastIndex, settings: textSettings(attrs), valid: stack.length === 0 });
      } else if (stack.length) {
        var entry = stack.pop();
        if (entry.valid && entry.settings && attrs && !Object.keys(attrs).length && !stack.length) {
          pairs.push({ start: entry.start, contentStart: entry.end, contentEnd: match.index, end: expression.lastIndex, settings: entry.settings });
        }
      }
    }
    return pairs;
  }

  function styledText(value, settings) {
    var span = document.createElement("span");
    span.setAttribute("data-rg-rt-text", "");
    if (settings.color !== undefined) span.style.setProperty("color", settings.color);
    if (settings.size !== undefined) span.style.setProperty("--rg-rt-size", settings.size);
    if (settings["size-mobile"] !== undefined) span.style.setProperty("--rg-rt-size-mobile", settings["size-mobile"]);
    if (settings.underline) span.style.setProperty("text-decoration-line", "underline");
    span.textContent = value;
    return span;
  }

  function renderRun(run) {
    var text = "";
    run.forEach(function (entry) {
      entry.start = text.length;
      text += entry.value;
      entry.end = text.length;
    });
    if (text.indexOf("[[") === -1) return;
    var pairs = validTextPairs(text);
    if (!pairs.length) return;
    run.forEach(function (entry) {
      if (!entry.node) return;
      var relevant = pairs.filter(function (pair) { return pair.start < entry.end && pair.end > entry.start; });
      if (!relevant.length) return;
      var boundaries = new Set([entry.start, entry.end]);
      relevant.forEach(function (pair) {
        [pair.start, pair.contentStart, pair.contentEnd, pair.end].forEach(function (offset) {
          if (offset > entry.start && offset < entry.end) boundaries.add(offset);
        });
      });
      var points = Array.from(boundaries).sort(function (a, b) { return a - b; });
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < points.length - 1; i++) {
        var start = points[i];
        var end = points[i + 1];
        var pair = relevant.find(function (candidate) { return start >= candidate.start && start < candidate.end; });
        if (pair && (start < pair.contentStart || start >= pair.contentEnd)) continue;
        var value = entry.value.slice(start - entry.start, end - entry.start);
        fragment.appendChild(pair ? styledText(value, pair.settings) : document.createTextNode(value));
      }
      entry.node.replaceWith(fragment);
    });
  }

  function processRoot(root) {
    if (root.closest(EXCLUDED) || root.textContent.indexOf("[[") === -1) return;
    processStructure(root);
    root.querySelectorAll(TEXT_SCOPE).forEach(function (scope) {
      if (scope.closest(ROOT) !== root || scope.closest(EXCLUDED)) return;
      inlineRuns(scope, root).forEach(renderRun);
    });
  }

  function editorMode() {
    var webflow = window.Webflow;
    return webflow && typeof webflow.env === "function" && (webflow.env("design") || webflow.env("editor"));
  }

  function rootsWithin(scope) {
    var roots = [];
    if (scope && scope.nodeType === 1 && scope.matches(ROOT)) roots.push(scope);
    if (scope && scope.querySelectorAll) roots.push.apply(roots, scope.querySelectorAll(ROOT));
    return roots;
  }

  function refresh(scope) {
    if (editorMode()) return;
    rootsWithin(scope || document).forEach(processRoot);
  }

  function queueRoot(root) {
    if (!root) return;
    pending.add(root);
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(function () {
      scheduled = false;
      var batch = Array.from(pending);
      pending.clear();
      if (editorMode()) return;
      batch.forEach(function (element) {
        if (document.documentElement.contains(element)) processRoot(element);
      });
    }, 0);
  }

  function start() {
    if (editorMode()) return;
    refresh(document);
    if (typeof window.MutationObserver !== "function") return;
    var observer = new window.MutationObserver(function (records) {
      records.forEach(function (record) {
        var target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        if (target) queueRoot(target.closest(ROOT));
        record.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            queueRoot(node.closest(ROOT));
            rootsWithin(node).forEach(queueRoot);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.RGRichText = { version: "1.0.0", refresh: refresh };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
