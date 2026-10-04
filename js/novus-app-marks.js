/* Novus product marks: the registry every app switcher and the workspace launcher draw from.
   A mark is a square of the product's own colour with a white line glyph on a 24-unit grid,
   stroke 1.8, round caps and joins. The colours are fixed product identity rather than theme
   values, so a mark keeps its colour in the dark theme. Each colour is a palette step of
   tokens.css, named here by token and never as a literal, and logos/marks/<id>.svg carries
   the same mark as a placed asset for anything that cannot run this script.

   NovaBank, NovaHub, NovaCard and NovaTrace are the four marks the consoles already drew, moved
   here unchanged. The other eight are drawn in the same style. An app with no mark here shows
   its initial on grey.

   Usage: <script src=".../js/novus-app-marks.js"></script>, or
   import "novus-design-kit/js/novus-app-marks.js" from a bundler; either way the registry is
   window.NovusAppMarks. A catalog's mark.glyph names an entry by its id. */
(function (global) {
  "use strict";

  var MARKS = [
    { id: "novabank", name: "NovaBank", token: "green-500",
      glyph: '<path d="M3 9.5 12 4l9 5.5"/><path d="M5.5 10.5v7M10 10.5v7M14 10.5v7M18.5 10.5v7"/><path d="M3 20h18"/>' },
    { id: "novahub", name: "NovaHub", token: "blue-500",
      glyph: '<circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/>' +
        '<circle cx="5" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/>' +
        '<path d="M6.4 6.4 10 10M17.6 6.4 14 10M6.4 17.6 10 14M17.6 17.6 14 14"/>' },
    { id: "novacard", name: "NovaCard", token: "indigo-500",
      glyph: '<rect x="3" y="6" width="18" height="12" rx="2.2"/><path d="M3 10.2h18M7 14.6h4"/>' },
    { id: "novatrace", name: "NovaTrace", token: "orange-500",
      glyph: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>' },
    /* A board: three columns of cards. */
    { id: "novaplan", name: "NovaPlan", token: "amber-600",
      glyph: '<rect x="3" y="4" width="18" height="16" rx="2.2"/><path d="M7.5 8v7M12 8v9.5M16.5 8v4.5"/>' },
    /* A lens. */
    { id: "novasearch", name: "NovaSearch", token: "indigo-300",
      glyph: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>' },
    /* A ticket, notched at both sides, with its perforation. */
    { id: "novaticket", name: "NovaTicket", token: "red-300",
      glyph: '<path d="M4.2 6h15.6c.7 0 1.2.5 1.2 1.2V10a2 2 0 0 0 0 4v2.8c0 .7-.5 1.2-1.2 1.2H4.2c-.7 0-1.2-.5-1.2-1.2V14a2 2 0 0 0 0-4V7.2C3 6.5 3.5 6 4.2 6Z"/>' +
        '<path d="M15 6.5v1.5M15 11.2v1.6M15 16v1.5"/>' },
    /* An agent standing in a branch location pin. */
    { id: "novaedge", name: "NovaEdge", token: "green-700",
      glyph: '<path d="M12 21s-6.8-5.6-6.8-11.2a6.8 6.8 0 0 1 13.6 0C18.8 15.4 12 21 12 21Z"/>' +
        '<circle cx="12" cy="8.6" r="1.9"/><path d="M8.9 13.6a3.4 3.4 0 0 1 6.2 0"/>' },
    /* An identity badge on its clip. */
    { id: "novus-id", name: "Novus ID", token: "blue-800",
      glyph: '<rect x="5.5" y="5" width="13" height="16" rx="2.2"/><path d="M10 5V3h4v2"/>' +
        '<circle cx="12" cy="11" r="2.2"/><path d="M8.6 17a3.6 3.6 0 0 1 6.8 0"/>' },
    /* A painter's palette. */
    { id: "design-kit", name: "Design kit", token: "red-800",
      glyph: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.3 0-1 .8-1.7 1.7-1.7h2.2a4.9 4.9 0 0 0 4.9-4.9C21.5 7.1 17.2 3.5 12 3.5Z"/>' +
        '<path d="M7.6 12.2h.01M8.8 8h.01M12.6 6.9h.01M16.3 8.6h.01"/>' },
    /* A browser window. */
    { id: "ibanking", name: "Internet banking", token: "orange-700",
      glyph: '<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><path d="M3 9h18"/><path d="M6 6.8h.01M8.6 6.8h.01"/><path d="M7 13h7M7 16h4.5"/>' },
    /* A phone. */
    { id: "mbanking", name: "Mobile banking", token: "amber-800",
      glyph: '<rect x="6.8" y="2.8" width="10.4" height="18.4" rx="2.2"/><path d="M11 17.8h2"/>' },
    /* A stack of coins under an arrow: credit going out. The glyph is NovaLending's own. */
    { id: "nova-lending", name: "NovaLending", token: "green-900",
      glyph: '<path d="M12 3v4M12 3 9.5 5.5M12 3l2.5 2.5"/><path d="M6 11a6 2.2 0 1 0 12 0a6 2.2 0 1 0-12 0Z"/>' +
        '<path d="M6 11v4c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-4"/><path d="M6 15v3c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2v-3"/>' }
  ];

  /* The ground an app with no mark here is shown on, with its initial in white. */
  var UNKNOWN_TOKEN = "neutral-600";

  var byId = {};
  MARKS.forEach(function (mark) {
    byId[mark.id] = Object.freeze({
      id: mark.id,
      name: mark.name,
      token: "--" + mark.token,
      colour: "var(--" + mark.token + ")",
      glyph: mark.glyph
    });
  });

  function has(id) {
    return typeof id === "string" && Object.prototype.hasOwnProperty.call(byId, id);
  }

  function get(id) {
    return has(id) ? byId[id] : undefined;
  }

  /* The glyph as inline SVG, drawn in currentColor: the mark's ground sets the colour white.
     Decorative, since a mark always sits beside the app's name. Empty for an unknown id. */
  function svg(id, size) {
    var mark = get(id);
    if (!mark) return "";
    var px = typeof size === "number" && size > 0 ? size : 24;
    return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      mark.glyph + "</svg>";
  }

  global.NovusAppMarks = Object.freeze({
    ids: function () { return MARKS.map(function (mark) { return mark.id; }); },
    has: has,
    get: get,
    svg: svg,
    unknown: Object.freeze({ token: "--" + UNKNOWN_TOKEN, colour: "var(--" + UNKNOWN_TOKEN + ")" })
  });
}(typeof window !== "undefined" ? window : globalThis));
