
const path = window.location.pathname;

$(document).ready(function () {
  $(".down-arrow").on("click", function () {
    var src =
      $(this).attr("src") === "/assets/shared/icon-arrow-down.svg"
        ? "./assets/shared/icon-arrow-up.svg"
        : "/assets/shared/icon-arrow-down.svg";
    $(this).attr("src", src);
  });
});

const match = window.location.pathname.match(/\/feedback\/([^\/\?]+)/);
const currentType = match ? match[1] : "suggestions";

window.addEventListener("DOMContentLoaded", () => {
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




window.addEventListener("DOMContentLoaded", () => {
  console.log("Script Running...");
  
  const urlParams = new URLSearchParams(window.location.search);
  const currentSort = urlParams.get('sort') || 'mostup'; 
  const menuItem = document.getElementById("menu-item");

  const sortMap = {
    'mostup': { id: 'mostCheckUp', text: 'Most Upvotes' },
    'leastup': { id: 'leastCheckUp', text: 'Least Upvotes' },
    'mostcomm': { id: 'mostCheckComm', text: 'Most Comments' },
    'leastcomm': { id: 'leastCheckComm', text: 'Least Comments' }
  };


  const allChecks = document.querySelectorAll('.checked');
  allChecks.forEach(img => {
    img.setAttribute('style', 'display: none !important');
  });


  const active = sortMap[currentSort];
  if (active) {
    const checkImg = document.getElementById(active.id);
    console.log("Looking for element:", active.id);
    
    if (checkImg) {
     
      checkImg.setAttribute('style', 'display: inline !important');
      console.log("Checkmark set to inline for:", active.id);
    } else {
      console.error("Could not find element with ID:", active.id);
    }

    if (menuItem) menuItem.innerHTML = active.text;
  }
});
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

function upvoteRoadmap(roadmapId) {
  fetch(`/feedback/roadmap/${roadmapId}/upvote?_=${new Date().getTime()}`, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => response.json())
    .then((data) => {
      const upvotesElement = document.getElementById(`votes-${roadmapId}`);
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


  document.addEventListener('click', async (e) => {
    // Check if we clicked the upvote button or something inside it (like the SVG)
    const btn = e.target.closest('.upvote-btn');
    
    if (btn) {
      // Prevent the link (<a>) behind it from being triggered
      e.preventDefault();
      e.stopPropagation();

      const suggestionId = btn.getAttribute('data-id');
      const voteCountDisplay = document.getElementById(`votes-${suggestionId}`);

      try {
        const response = await fetch(`/feedback/${suggestionId}/upvote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        // If the user isn't logged in, redirect them to login page
        if (response.redirected) {
          window.location.href = response.url;
          return;
        }

        const data = await response.json();
        if (data.upvotes !== undefined) {
          // Update the UI immediately without refreshing the page
          voteCountDisplay.innerText = data.upvotes;
        }
      } catch (err) {
        console.error("Upvote request failed:", err);
      }
    }
  });
