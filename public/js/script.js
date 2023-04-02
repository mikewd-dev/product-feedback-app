
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
    mode: 'no-cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${suggestionId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function upvoteFeature(featureId) {

  fetch(`/feedback/feature/${featureId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'no-cors',
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

  fetch(`/feedback/enhancement/${enhancementId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'no-cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${enhancementId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function upvoteBug(enhancementId) {

  fetch(`/feedback/bug/${bugId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
    mode: 'no-cors',
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
    mode: 'no-cors',
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
    mode: 'no-cors',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${uxId}}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}

function selectUpvotes(){
if(onselect){
    document.querySelector(".checked");
    display: inline
}

}


