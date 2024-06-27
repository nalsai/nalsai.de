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


// Cookie helper functions
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  // if currently on localhost, domain doesn't need to be set
  if (location.hostname === "localhost") {
    document.cookie = name + "=" + (value || "") + expires + ";path=/;SameSite=Strict";
    return;
  }
  const domain = "; domain=." + location.hostname.split('.').reverse()[1] + "." + location.hostname.split('.').reverse()[0];
  console.log(domain);
  document.cookie = name + "=" + (value || "") + expires + ";path=/" + domain + ";SameSite=Srict;secure";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


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


// Theme switcher
(() => {
  'use strict'

  //const getStoredTheme = () => localStorage.getItem('theme')
  //const setStoredTheme = theme => localStorage.setItem('theme', theme)
  // alternative with cookies
  const getStoredTheme = () => getCookie('theme')
  const setStoredTheme = theme => setCookie('theme', theme, 400);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }

    var x = document.getElementsByClassName("invert-light");
    for (var counter = 0; counter < x.length; counter++) {
      if (theme === 'auto') {
        x.item(counter).style = window.matchMedia('(prefers-color-scheme: dark)').matches ? '' : 'filter: invert(1)'
      }
      else {
        x.item(counter).style = theme === 'light' ? 'filter: invert(1)' : ''
      }
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const iOfActiveBtn = btnToActive.querySelector('i').getAttribute('class')

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('class', iOfActiveBtn + ' theme-icon-active')
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      const theme = getPreferredTheme()
      setTheme(theme)
      showActiveTheme(theme, false);
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})();


// Google Translate button
(() => {
  'use strict'

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
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

      setCookie('googtrans', '/' + document.documentElement.lang + '/' + urlParams.get("lang"), 1);

      var googleTranslateScript = document.createElement('script');
      googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(googleTranslateScript);
    }
  }
})();
