function safeQuerySelector(selector) {
  const el = document.querySelector(selector);
  return el || null;
}

const path = window.location.pathname;
const match = path.match(/\/feedback\/([^\/\?]+)/);
const currentType = match ? match[1] : "suggestions";

function navButton() {
  const navbarToggler = safeQuerySelector(".navbar-toggler-icon");
  const overlay = safeQuerySelector(".overlay");
  const navbarNav = safeQuerySelector(".navbar-nav");

  if (!navbarToggler || !overlay || !navbarNav) return;

  navbarToggler.classList.toggle("icon-close");

  if (navbarNav.classList.contains("show")) {
    navbarNav.classList.remove("show");
    navbarNav.style.display = "none";
    overlay.style.display = "none";
  } else {
    navbarNav.classList.add("show");
    navbarNav.style.display = "block";
    overlay.style.display = "block";
  }
}

function updateRoadmapDisplay(state) {
  const elements = {
    'planned': { col: 'column-planned', tab: 'plan-bar' },
    'progress': { col: 'column-progress', tab: 'inprog-bar' },
    'live': { col: 'column-live', tab: 'lve-bar' }
  };

  if (!document.getElementById('column-planned')) return;

  Object.keys(elements).forEach(key => {
    const isCurrent = (key === state);
    const colEl = document.getElementById(elements[key].col);
    const tabEl = document.getElementById(elements[key].tab);

    if (colEl) colEl.style.display = isCurrent ? "block" : "none";
    if (tabEl) tabEl.style.display = isCurrent ? "block" : "none";
  });
}

window.plannedDisplay = () => updateRoadmapDisplay('planned');
window.progressDisplay = () => updateRoadmapDisplay('progress');
window.liveDisplay = () => updateRoadmapDisplay('live');
window.dropReply = toggleDisplay;
window.dropReplyReply = toggleDisplay;

window.addEventListener("DOMContentLoaded", () => {

  updateRoadmapDisplay('planned');

  
  const buttons = document.querySelectorAll(".blue");
  buttons.forEach((button) => {
    const dataType = button.getAttribute("data-type");
    if (dataType === currentType) button.classList.add("active");
  });

  
  document.querySelectorAll(".upvote-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const suggestionId = this.getAttribute("data-id");
      upvoteSuggestion(suggestionId);
    });
  });

  
  initSortMenu();
  
  
  checkWidth();

  
  if (window.innerWidth <= 768) {
    const board = document.querySelector(".board");
    const closeIcon = document.querySelector(".close-icon");
    if (board && closeIcon) {
      board.classList.add("navbar", "dropdown");
      board.appendChild(closeIcon);
    }
  }
});

function upvoteSuggestion(suggestionId) {
  fetch(`/feedback/${suggestionId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`votes-${suggestionId}`);
      if (upvotesElement) upvotesElement.textContent = data.upvotes;
    })
    .catch(console.error);
}

function toggleDisplay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.style.display === "block") {
    el.style.display = "none";
  } else {
    el.style.display = "block";
    const textarea = el.querySelector(".reply-box");
    if (textarea) textarea.focus();
  }
}

function initSortMenu() {
  const linkmostup = document.getElementById("mostup");
  if (!linkmostup) return;

  const checkmostup = document.getElementById("mostCheckUp");
  const checkleastup = document.getElementById("leastCheckUp");
  const checkmostcomm = document.getElementById("mostCheckComm");
  const checkleastcomm = document.getElementById("leastCheckComm");

  if (sessionStorage.getItem("mostupClicked") === "true" && checkmostup) checkmostup.style.display = "inline";
  if (sessionStorage.getItem("leastupClicked") === "true" && checkleastup) checkleastup.style.display = "inline";
  if (sessionStorage.getItem("mostcommClicked") === "true" && checkmostcomm) checkmostcomm.style.display = "inline";
  if (sessionStorage.getItem("leastcommClicked") === "true" && checkleastcomm) checkleastcomm.style.display = "inline";
}

function checkWidth() {
  const boardDiv = safeQuerySelector(".board-text");
  if (boardDiv && window.innerWidth <= 600) boardDiv.style.display = "none";
}

$(document).ready(function () {
  $(".dropdown-menu > li > a").click(function () {
    $(".dropdown-menu > li > a").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".down-arrow").on("click", function () {
    const src = $(this).attr("src").includes("down")
      ? "./assets/shared/icon-arrow-up.svg"
      : "/assets/shared/icon-arrow-down.svg";
    $(this).attr("src", src);
  });
});