// Import the Bootstrap components we want to use.
// See https://github.com/twbs/bootstrap/blob/main/js/index.umd.js
import Carousel from 'js/bootstrap/src/carousel.js'
import Collapse from 'js/bootstrap/src/collapse.js'
import Dropdown from 'js/bootstrap/src/dropdown.js'
import Tooltip from "js/bootstrap/src/tooltip";
import Tab from 'js/bootstrap/src/tab.js'

// Initialize Bootstrap tooltips
(function () {
  'use strict'

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
  })
})()

// GitHub Issue Feedback Button
// based on script from https://fasterthanli.me/
document.addEventListener("DOMContentLoaded", () => {
  let button = document.querySelector("#feedback-button");
  button.addEventListener("click", (e) => {
    e.preventDefault();
    let html = document.querySelector("html");
    if (!html) {
      return;
    }
    let perc = ((html.scrollTop / html.scrollHeight) * 100).toFixed(1);
    let url = new URL(document.location.href);
    let hashSearch = new URLSearchParams();
    hashSearch.set("position", `${perc}`);
    url.hash = hashSearch.toString();

    let githubUrl = new URL(
      "https://github.com/nalsai/nalsai.de/issues/new",
    );
    let githubParams = new URLSearchParams();
    githubParams.set("title", `${document.title}`);
    let body = "I found something wrong on this page:\n" + url.toString() + "\n\nHere's what it is:\n\n";
    githubParams.set("body", body);
    githubUrl.search = githubParams.toString();
    window.open(githubUrl, "_blank");
  });

  let url = new URL(document.location.href);
  let hash = url.hash.replace(/^#/, "");
  let params = new URLSearchParams(hash);
  window.history.replaceState(null, null, url.toString());

  let positionString = params.get("position");
  let position = parseFloat(positionString);
  if (position > 0) {
    let html = document.querySelector("html");
    html.scrollTo({
      top: (position / 100) * html.scrollHeight,
    });
  }
});

// Google Translate button
(() => {
  'use strict'

  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get("lang");
  if (lang) {
    document.getElementById("lang-alert").classList.remove("d-none");
    document.getElementById("target-lang").innerHTML = `: ${lang}`;
    switch (lang) {
      case "de":
        document.getElementById("lang-not-available").innerHTML = "Diese Seite ist nicht verfügbar in der gewählten Sprache";
        document.getElementById("back").innerHTML = "Zurück";
        break;
    }
    document.getElementById("gtranslate-button").onclick = function () {
      this.remove();

      function setCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
      };
      setCookie('googtrans', '/' + document.documentElement.lang + '/' + urlParams.get("lang"), 1);

      var googleTranslateScript = document.createElement('script');
      googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(googleTranslateScript);
    }
  }
})();
