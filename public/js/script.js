const fs = require('fs');

// Read the JSON file
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Find the comment to add a reply to
  const commentId = 4; // ID of the comment you want to reply to
  const comment = jsonData.find((post) => post.comments.some((comment) => comment.id === commentId));

  if (!comment) {
    console.error('Comment not found');
    return;
  }

  // Add the reply to the comment
  const replyData = {
    content: 'This is a new reply!',
    user: {
      image: './assets/user-images/image-john.jpg',
      name: 'John Doe',
      username: 'johndoe'
    }
  };
  comment.comments.push(replyData);

  // Write the updated JSON data back to the file
  fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return;
    }
    console.log('Reply added successfully');
  });
});


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

window.onload = function checkMark() {
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
    }

if (sessionStorage.getItem('leastupClicked') === 'true'){
  checkleastup.style.display = 'inline'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'none'
  checkleastcomm.style.display = 'none'
// } else {
//   checkleastup.style.display = 'none'
}

if(sessionStorage.getItem('mostcommClicked') === 'true'){
  checkleastup.style.display = 'none'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'inline'
  checkleastcomm.style.display = 'none'
}

if(sessionStorage.getItem('leastcommClicked') === 'true'){
  checkleastup.style.display = 'none'
  checkmostup.style.display = 'none'
  checkmostcomm.style.display = 'none'
  checkleastcomm.style.display = 'inline'
}


  linkmostup.addEventListener('click', (e) => {
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


function dropReply(replyBoxId){
var rep = document.getElementById(replyBoxId)
    if(rep.style.display == 'block'){
       rep.style.display = 'none';
    } else {
        rep.style.display = 'block';
    }
}


function upvoteSuggestion(suggestionId) {
  fetch(`/feedback/suggestions/${suggestionId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of req.upvotes in the DOM
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


function dropReply(replyBoxId){
var rep = document.getElementById(replyBoxId)
    if(rep.style.display == 'block'){
       rep.style.display = 'none';
    } else {
        rep.style.display = 'block';
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



