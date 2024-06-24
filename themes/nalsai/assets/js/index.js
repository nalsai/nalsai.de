// Import the Bootstrap components we want to use.
// See https://github.com/twbs/bootstrap/blob/main/js/index.umd.js
import Carousel from 'js/bootstrap/src/carousel.js'
import Collapse from 'js/bootstrap/src/collapse.js'
import Dropdown from 'js/bootstrap/src/dropdown.js'
import Tooltip from "js/bootstrap/src/tooltip";
import Tab from 'js/bootstrap/src/tab.js'

(function () {
  'use strict'

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
  })
})()
