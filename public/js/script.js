
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


window.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".blue");
  buttons.forEach((button) => {
    const dataType = button.getAttribute("data-type");
    if (dataType === currentType) button.classList.add("active");
  });
});


$(document).ready(function () {
  $(".dropdown-menu > li > a").click(function () {
    $(".dropdown-menu > li > a").removeClass("selected");
    $(this).addClass("selected");
  });
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

function upvoteRoadmap(roadmapId) {
  fetch(`/feedback/${roadmapId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`votes-${roadmapId}`);
      if (upvotesElement) upvotesElement.textContent = data.upvotes;
    })
    .catch(console.error);
}

document.querySelectorAll(".upvote-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const suggestionId = this.getAttribute("data-id");
    upvoteSuggestion(suggestionId);
  });
});

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


window.dropReply = toggleDisplay;
window.dropReplyReply = toggleDisplay;


function initSortMenu() {
  const linkmostup = document.getElementById("mostup");
  const linkleastup = document.getElementById("leastup");
  const linkmostcomm = document.getElementById("mostcomm");
  const linkleastcomm = document.getElementById("leastcomm");

  const checkmostup = document.getElementById("mostCheckUp");
  const checkleastup = document.getElementById("leastCheckUp");
  const checkmostcomm = document.getElementById("mostCheckComm");
  const checkleastcomm = document.getElementById("leastCheckComm");

  if (!linkmostup || !linkleastup || !linkmostcomm || !linkleastcomm) return;


  if (sessionStorage.getItem("mostupClicked") === "true") checkmostup.style.display = "inline" ;
  if (sessionStorage.getItem("leastupClicked") === "true") checkleastup.style.display = "inline";
  if (sessionStorage.getItem("mostcommClicked") === "true") checkmostcomm.style.display = "inline";
  if (sessionStorage.getItem("leastcommClicked") === "true") checkleastcomm.style.display = "inline";


  const setSort = (mostup, leastup, mostcomm, leastcomm, label) => {
    sessionStorage.setItem("mostupClicked", mostup);
    sessionStorage.setItem("leastupClicked", leastup);
    sessionStorage.setItem("mostcommClicked", mostcomm);
    sessionStorage.setItem("leastcommClicked", leastcomm);
    document.getElementById("menu-item").innerHTML = label;
  };

  linkmostup.addEventListener("click", () => setSort("true", "false", "false", "false", "Most Upvotes"));
  linkleastup.addEventListener("click", () => setSort("false", "true", "false", "false", "Least Upvotes"));
  linkmostcomm.addEventListener("click", () => setSort("false", "false", "true", "false", "Most Comments"));
  linkleastcomm.addEventListener("click", () => setSort("false", "false", "false", "true", "Least Comments"));
}
window.addEventListener("DOMContentLoaded", initSortMenu);


function checkWidth() {
  const boardDiv = safeQuerySelector(".board-text");
  if (boardDiv && window.innerWidth <= 600) boardDiv.style.display = "none";
}
window.addEventListener("DOMContentLoaded", checkWidth);


$(document).ready(function () {
  $(".down-arrow").on("click", function () {
    const src = $(this).attr("src") === "/assets/shared/icon-arrow-down.svg"
      ? "./assets/shared/icon-arrow-up.svg"
      : "/assets/shared/icon-arrow-down.svg";
    $(this).attr("src", src);
  });
});

window.onload = function () {
  plannedDisplay();
}

function plannedDisplay() {
  let columnPlanned = document.getElementById("column-planned");
  let columnProgress = document.getElementById("column-progress");
  let columnLive = document.getElementById("column-live");
  let tabPlanned = document.getElementById("plan-bar");
  let tabInProg = document.getElementById("inprog-bar");
  let tabLive = document.getElementById("lve-bar");
  columnPlanned.style.display = "block";
  columnProgress.style.display = "none";
  columnLive.style.display = "none";
  tabPlanned.style.display = "block";
  tabInProg.style.display = "none";
  tabLive.style.display = "none";
}

function progressDisplay() {
  let columnPlanned = document.getElementById("column-planned");
  let columnProgress = document.getElementById("column-progress");
  let columnLive = document.getElementById("column-live");
  let tabPlanned = document.getElementById("plan-bar");
  let tabInProg = document.getElementById("inprog-bar");
  let tabLive = document.getElementById("lve-bar");

  columnProgress.style.display = "block";
  columnPlanned.style.display = "none";
  columnLive.style.display = "none";
  tabInProg.style.display = "block";
  tabPlanned.style.display = "none";
  tabLive.style.display = "none";
}
function liveDisplay() {
  let columnPlanned = document.getElementById("column-planned");
  let columnProgress = document.getElementById("column-progress");
  let columnLive = document.getElementById("column-live");
  let tabPlanned = document.getElementById("plan-bar");
  let tabInProg = document.getElementById("inprog-bar");
  let tabLive = document.getElementById("lve-bar");
  columnLive.style.display = "block";
  columnPlanned.style.display = "none";
  columnProgress.style.display = "none";
  tabLive.style.display = "block";
  tabInProg.style.display = "none";
  tabPlanned.style.display = "none";
}

  document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
      const board = document.querySelector(".board");
      board.classList.add("navbar");
      board.classList.add("dropdown");
      const closeIcon = document.querySelector(".close-icon");
      board.appendChild(closeIcon);
    }
  });


  

