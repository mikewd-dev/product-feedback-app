console.log("script.js loaded");

const path = window.location.pathname;

$(document).ready(function () {
  $(".down-arrow").on({
    click: function () {
      var src =
        $(this).attr("src") === "/assets/shared/icon-arrow-down.svg"
          ? "./assets/shared/icon-arrow-up.svg"
          : "/assets/shared/icon-arrow-down.svg";
      $(this).attr("src", src);
    },
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const match = window.location.pathname.match(/\/feedback\/([^\/\?]+)/);
  const currentType = match ? match[1] : "suggestions";
  const buttons = document.querySelectorAll(".blue");
  buttons.forEach((button) => {
    const dataType = button.getAttribute("data-type");
    if (dataType === currentType) {
      button.classList.add("active");
    }
  });
});

function navButton() {
  const navbarToggler = document.querySelector(".navbar-toggler-icon");
  const overlay = document.querySelector(".overlay");
  const navbarNav = document.querySelector(".navbar-nav");

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

function columnLoad() {
  if (window.onload) {
    columnProgress.style.display = "none";
    columnLive.style.display = "none";
    tabInProg.style.display = "none";
    tabLive.style.display = "none";
  }
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
  document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth <= 768) {
      const board = document.querySelector(".board");
      board.classList.add("navbar");
      board.classList.add("dropdown");
      const closeIcon = document.querySelector(".close-icon");
      board.appendChild(closeIcon);
    }
  });
}

window.onload = function checkMark() {
  console.log("Window loaded");
  let linkmostup = document.getElementById("mostup");

  let linkleastup = document.getElementById("leastup");

  let linkmostcomm = document.getElementById("mostcomm");

  let linkleastcomm = document.getElementById("leastcomm");

  let checkmostup = document.getElementById("mostCheckUp");
  let checkleastup = document.getElementById("leastCheckUp");
  let checkmostcomm = document.getElementById("mostCheckComm");
  let checkleastcomm = document.getElementById("leastCheckComm");

  if (sessionStorage.getItem("mostupClicked") === "true") {
    checkmostup.style.display = "inline";
    checkleastup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "none";
    document.getElementById("menu-item").innerHTML = "Most Upvotes";
  }

  if (sessionStorage.getItem("leastupClicked") === "true") {
    checkleastup.style.display = "inline";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "none";
    document.getElementById("menu-item").innerHTML = "Least Upvotes";
  }

  if (sessionStorage.getItem("mostcommClicked") === "true") {
    checkleastup.style.display = "none";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "inline";
    checkleastcomm.style.display = "none";
    document.getElementById("menu-item").innerHTML = "Most Comments";
  }

  if (sessionStorage.getItem("leastcommClicked") === "true") {
    checkleastup.style.display = "none";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "inline";
    document.getElementById("menu-item").innerHTML = "Least Comments";
  }

  linkmostup.addEventListener("click", (e) => {
    console.log("Most up clicked");
    e.stopPropagation();

    sessionStorage.setItem("mostupClicked", "true");
    sessionStorage.setItem("leastupClicked", "false");
    sessionStorage.setItem("mostcommClicked", "false");
    sessionStorage.setItem("leastcommClicked", "false");

    checkmostup.style.display = "inline";
    checkleastup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "none";
  });

  linkleastup.addEventListener("click", (e) => {
    e.stopPropagation();

    sessionStorage.setItem("leastupClicked", "true");
    sessionStorage.setItem("mostupClicked", "false");
    sessionStorage.setItem("mostcommClicked", "false");
    sessionStorage.setItem("leastcommClicked", "false");

    checkleastup.style.display = "inline";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "none";
  });

  linkmostcomm.addEventListener("click", (e) => {
    e.stopPropagation();

    sessionStorage.setItem("leastupClicked", "false");
    sessionStorage.setItem("mostupClicked", "false");
    sessionStorage.setItem("mostcommClicked", "true");
    sessionStorage.setItem("leastcommClicked", "false");

    checkleastup.style.display = "none";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "inline";
    checkleastcomm.style.display = "none";
  });

  linkleastcomm.addEventListener("click", (e) => {
    e.stopPropagation();

    sessionStorage.setItem("leastupClicked", "false");
    sessionStorage.setItem("mostupClicked", "false");
    sessionStorage.setItem("mostcommClicked", "false");
    sessionStorage.setItem("leastcommClicked", "true");

    checkleastup.style.display = "none";
    checkmostup.style.display = "none";
    checkmostcomm.style.display = "none";
    checkleastcomm.style.display = "inline";
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/feedback/login");
}
function dropReply(id) {
  const textarea = document.getElementById(id);
  textarea.focus();
}

document.querySelectorAll(".reply-link").forEach((button) => {
  button.addEventListener("click", function (event) {
    const replyBoxId = event.target.dataset.id;
    dropReply(replyBoxId);
  });
});

function dropReplyReply(id) {
  const replytextarea = document.getElementById(id);
  replytextarea.focus();
}

document.querySelectorAll(".reply-reply-link").forEach((button) => {
  button.addEventListener("click", function (event) {
    const replyReplyBoxId = event.target.dataset.id;
    dropReplyReply(replyReplyBoxId);
  });
});

function upvoteSuggestion(suggestionId) {
  fetch(
    `/feedback/suggestions/${suggestionId}/upvote?_=${new Date().getTime()}`,
    {
      method: "POST",
      mode: "cors",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`votes-${suggestionId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function upvoteFeature(featureId) {
  fetch(`/feedback/feature/${featureId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`upvotes-${featureId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function upvoteEnhancement(enhancementId) {
  fetch(
    `/feedback/suggestions/${enhancementId}/upvote?_=${new Date().getTime()}`,
    {
      method: "POST",
      mode: "cors",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`votes-${enhancementId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function upvoteBug(bugId) {
  fetch(`/feedback/bug/${bugId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`upvotes-${bugId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function upvoteUI(uiId) {
  fetch(`/feedback/ui/${uiId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`upvotes-${uiId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function upvoteUX(uxId) {
  fetch(`/feedback/ux/${uxId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`upvotes-${uxId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch((error) => console.error(error));
}

function dropReply(replyBoxId) {
  var rep = document.getElementById(replyBoxId);
  if (rep.style.display === "block") {
    rep.style.display = "none";
  } else {
    rep.style.display = "block";
    rep.querySelector(".reply-box").focus();
  }
}

function dropReplyReply(replyReplyBoxId) {
  var rep = document.getElementById(replyReplyBoxId);
  if (rep.style.display === "block") {
    rep.style.display = "none";
  } else {
    rep.style.display = "block";
    rep.querySelector(".reply-box").focus();
  }
}

$(document).ready(function () {
  $(".dropdown-menu > li > a").click(function () {
    $(".dropdown-menu > li > a").removeClass("selected");
    $(this).addClass("selected");
  });
});

$(document).ready(function () {
  $("#mostup").click(function () {
    $("#menu-item").html("Most Upvotes");
  });
});

function checkWidth() {
  var boardDiv = document.querySelector(".board-text");

  if (boardDiv && window.innerWidth <= 600) {
    boardDiv.style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", checkWidth);
