$(document).ready(function(){
    $('.down-arrow').on({
        'click': function() {
             var src = ($(this).attr('src') === '../assets/shared/icon-arrow-down.svg')
                ? '../assets/shared/icon-arrow-up.svg'
                : '../assets/shared/icon-arrow-down.svg';
             $(this).attr('src', src);
        }
    });
})



function navButton() {
  const navbarToggler = document.querySelector('.navbar-toggler-icon');
  const overlay = document.querySelector('.overlay');
  const navbarNav = document.querySelector('.navbar-nav');

  // Toggle the "icon-close" class on navbarToggler
  navbarToggler.classList.toggle('icon-close');

  // Toggle the display of the navbar
  if (navbarNav.classList.contains('show')) {
    navbarNav.classList.remove('show');
    navbarNav.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    navbarNav.classList.add('show');
    navbarNav.style.display = 'block';
    overlay.style.display = 'block';
  }
}

function columnLoad(){
  if(window.onload){
    columnProgress.style.display = 'none';
    columnLive.style.display = 'none';
    tabInProg.style.display = 'none';
    tabLive.style.display = 'none';
  }
}

function plannedDisplay() {
  let columnPlanned = document.getElementById('column-planned');
  let columnProgress = document.getElementById('column-progress');
  let columnLive = document.getElementById('column-live');
  let tabPlanned = document.getElementById('plan-bar');
  let tabInProg = document.getElementById('inprog-bar');
  let tabLive = document.getElementById('lve-bar');
  columnPlanned.style.display = 'block';
  columnProgress.style.display = 'none';
  columnLive.style.display = 'none';
  tabPlanned.style.display = 'block';
  tabInProg.style.display = 'none';
  tabLive.style.display = 'none';
}

function progressDisplay() {
  let columnPlanned = document.getElementById('column-planned');
  let columnProgress = document.getElementById('column-progress');
  let columnLive = document.getElementById('column-live');
  let tabPlanned = document.getElementById('plan-bar')
  let tabInProg = document.getElementById('inprog-bar')
  let tabLive = document.getElementById('lve-bar')

  columnProgress.style.display = 'block';
  columnPlanned.style.display = 'none';
  columnLive.style.display = 'none';
  tabInProg.style.display = 'block';
  tabPlanned.style.display = 'none'
  tabLive.style.display = 'none'
}

function liveDisplay() {
  let columnPlanned = document.getElementById('column-planned');
  let columnProgress = document.getElementById('column-progress');
  let columnLive = document.getElementById('column-live');
    let tabPlanned = document.getElementById('plan-bar')
  let tabInProg = document.getElementById('inprog-bar')
  let tabLive = document.getElementById('lve-bar')

  columnLive.style.display = 'block';
  columnPlanned.style.display = 'none';
  columnProgress.style.display = 'none';
  tabLive.style.display = 'block'
  tabInProg.style.display = 'none';
  tabPlanned.style.display = 'none';
}

// tabLive.style.display="none";

  document.addEventListener("DOMContentLoaded", function() {
   if (window.innerWidth <= 768) {
        // Change the `div` element with the class `board` to a navbar with dropdown
        const board = document.querySelector('.board');
        board.classList.add('navbar');
        board.classList.add('dropdown');

        // Add the `close-icon` element to the navbar
        const closeIcon = document.querySelector('.close-icon');
        board.appendChild(closeIcon);
   }
    })




window.onload = function checkMark() {
  console.log('Window loaded')
  let linkmostup = document.getElementById('mostup');

  let linkleastup = document.getElementById('leastup')

  let linkmostcomm = document.getElementById('mostcomm')

  let linkleastcomm = document.getElementById('leastcomm')

  let checkmostup = document.getElementById('mostCheckUp');
  let checkleastup = document.getElementById('leastCheckUp')
  let checkmostcomm = document.getElementById('mostCheckComm')
  let checkleastcomm = document.getElementById('leastCheckComm')



  // Check which link was clicked before and set the display of the checkmark accordingly
 if (sessionStorage.getItem('mostupClicked') === 'true'){
      checkmostup.style.display = 'inline'
      checkleastup.style.display = 'none'
      checkmostcomm.style.display = 'none'
      checkleastcomm.style.display = 'none'
      document.getElementById('menu-item').innerHTML = "Most Upvotes";
    }

if (sessionStorage.getItem('leastupClicked') === 'true'){
  checkleastup.style.display = 'inline'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'none'
  checkleastcomm.style.display = 'none'
  document.getElementById('menu-item').innerHTML = "Least Upvotes";
}

if(sessionStorage.getItem('mostcommClicked') === 'true'){
  checkleastup.style.display = 'none'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'inline'
  checkleastcomm.style.display = 'none'
  document.getElementById('menu-item').innerHTML = "Most Comments";
}

if(sessionStorage.getItem('leastcommClicked') === 'true'){
  checkleastup.style.display = 'none'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'none'
  checkleastcomm.style.display = 'inline'
  document.getElementById('menu-item').innerHTML = "Least Comments";
}


  linkmostup.addEventListener('click', (e) => {
    console.log('Most up clicked')
    // e.preventDefault();
    e.stopPropagation();

    // Set a flag in localStorage to indicate that the link was clicked
    sessionStorage.setItem('mostupClicked', 'true');
    sessionStorage.setItem('leastupClicked', 'false')
    sessionStorage.setItem('mostcommClicked', 'false')
    sessionStorage.setItem('leastcommClicked', 'false')

    checkmostup.style.display = 'inline';
    checkleastup.style.display ="none"
    checkmostcomm.style.display = 'none'
    checkleastcomm.style.display = 'none'



  });

  linkleastup.addEventListener('click', (e) =>{
    e.stopPropagation()

    sessionStorage.setItem('leastupClicked', 'true');
    sessionStorage.setItem('mostupClicked', 'false')
    sessionStorage.setItem('mostcommClicked', 'false')
    sessionStorage.setItem('leastcommClicked', 'false')

    checkleastup.style.display = 'inline';
    checkmostup.style.display = 'none';
    checkmostcomm.style.display = 'none'
    checkleastcomm.style.display = 'none'

    //document.getElementById('menu-item').innerText = "Least Upvotes";

  })

  linkmostcomm.addEventListener('click', (e) => {
  e.stopPropagation();

  sessionStorage.setItem('leastupClicked', 'false');
  sessionStorage.setItem('mostupClicked', 'false');
  sessionStorage.setItem('mostcommClicked', 'true');
  sessionStorage.setItem('leastcommClicked', 'false');

  checkleastup.style.display = 'none';
  checkmostup.style.display = 'none';
  checkmostcomm.style.display = 'inline';
  checkleastcomm.style.display = 'none';

    //document.getElementById('menu-item').innerText = "Most Comments";

});

linkleastcomm.addEventListener('click', (e) => {
  e.stopPropagation();

  sessionStorage.setItem('leastupClicked', 'false');
  sessionStorage.setItem('mostupClicked', 'false');
  sessionStorage.setItem('mostcommClicked', 'false');
  sessionStorage.setItem('leastcommClicked', 'true');

  checkleastup.style.display = 'none';
  checkmostup.style.display = 'none';
  checkmostcomm.style.display = 'none';
  checkleastcomm.style.display = 'inline';
});

};

// checkMark();

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/feedback/login");
}
function dropReply(id) {
  const textarea = document.getElementById(id);
  textarea.focus();
}

document.querySelectorAll(".reply-link").forEach(button => {
  button.addEventListener("click", function(event) {
    const replyBoxId = event.target.dataset.id;
    dropReply(replyBoxId);
  });
});

function upvoteSuggestion(suggestionId) {
  fetch(`/feedback/suggestions/${suggestionId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      const upvotesElement = document.getElementById(`votes-${suggestionId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}



function upvoteFeature(featureId) {

  fetch(`/feedback/feature/${featureId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${featureId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}



function upvoteEnhancement(enhancementId) {
  fetch(`/feedback/suggestions/${enhancementId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of req.upvotes in the DOM
      const upvotesElement = document.getElementById(`votes-${enhancementId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function upvoteBug(bugId) {

  fetch(`/feedback/bug/${bugId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${bugId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function upvoteUI(uiId) {

  fetch(`/feedback/ui/${uiId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${uiId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function upvoteUX(uxId) {

  fetch(`/feedback/ux/${uxId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${uxId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}



function dropReply(replyBoxId) {
  var rep = document.getElementById(replyBoxId);
  if (rep.style.display === 'block') {
    rep.style.display = 'none';
  } else {
    rep.style.display = 'block';
    rep.querySelector(".reply-box").focus(); // Focus on the textarea
  }
}




$(document).ready(function(){
  $('.dropdown-menu > li > a').click(function(){
    $('.dropdown-menu > li > a').removeClass('selected');
    $(this).addClass('selected')
  })
})

$(document).ready(function(){
  $('#mostup').click(function(){
    $('#menu-item').html('Most Upvotes')
    })
  })


 function checkWidth() {
       var boardDiv = document.querySelector('.board-text')

    if(window.innerWidth > 768){
      boardDiv.style.display = "none";
    }
    }
    checkWidth()


