// const upvotes = require("../../models/upvotes");



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


// function upvote(suggestionId) {
//   fetch(`/feedback/suggestions/${suggestionId}/upvote`, {
//     method: 'POST',
//   })
//     .then(response => response.json())
//     .then(data => {
//       // Update the value of <%=req.upvotes%> in the DOM
//       const upvotesElement = document.getElementById(`upvotes-${suggestionId}`);
//       upvotesElement.textContent = data.upvotes;
//     })
//     .catch(error => console.error(error));
// }

// const contentButton = document.querySelector('#content');

// contentButton.addEventListener('click', () => {
//   fetch(`/feedback/suggestions/${suggestionId}/upvote`, { method: 'POST' })
//     .then(response => response.json())
//     .then(data => {
//       const upvotesElement = document.querySelector('votes');
//       upvotesElement.textContent = data.upvotes;
//     })
//     .catch(error => console.error(error));
// });

// axios.post('/feedback/suggestions/:id')

// $(window).ready(function() {
// $("#content").click (function(e){

//     var obj = {
//         requests: upvotes
//     };
//     $.ajax({
//         url:"/feedback/:id/suggestions",
//         type: "POST",
//         data: JSON.stringify(obj),
//         contentType: "application/json; charset=utf-8",
//         success:function(data){
//             data
//         },

//     })

// })

// })

// function buttonClick() {
//     // const requestId = event.getAttribute();
// const xhr = new XMLHttpRequest();
// xhr.onload = function(){
//     // var data = upvotes
//    document.getElementById('votes').innerHTML;

// xhr.open("POST")
// xhr.setRequestHeader("Content-type", "application/json");
// xhr.send()
// }
// };

//     const handleUpvoteClick = (event) => {
//   event.preventDefault();
//   const requestId = event.target.getAttribute('data-request-id');
//   fetch(`/feedback/suggestions/${requestId}/upvote`, { method: 'POST' })
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error('Failed to upvote suggestion.');
//       }
//     })
//     .then((data) => {
//       const upvoteCount = document.querySelector("#votes");
//       upvoteCount.textContent = data.upvotes;
//     })
//     .catch((error) => {
//       console.error(error);
//       alert('An error occurred while upvoting the suggestion.');
//     });
// }

// $(document).ready(function() {
//     $('#content').on("click", function(event){
//         event.preventDefault();
//         // let value = $('#votes').val();
//         // value++
//         // console.log(value)
//         $.ajax({
//             url: "feedback/suggestions",
//             method: "PUT",
//             contentType: "application/json",
//             data: JSON.stringify({upvotes}),
//             success: function(res){
//                 $('div').html(`${res.response}`)
//             }
//         })
//     })
// })

// function buttonClick() {
//     var element = document.getElementById('votes');
//     var value = element.innerHTML;
//     ++value;
//     console.log(value);
// }

function upvote(suggestionId) {
  fetch(`/feedback/suggestions/${suggestionId}/upvote?_=${new Date().getTime()}`, {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      // Update the value of <%=req.upvotes%> in the DOM
      const upvotesElement = document.getElementById(`upvotes-${suggestionId}`);
      upvotesElement.textContent = data.upvotes;
    })
    .catch(error => console.error(error));
}



function dropReply(id){
let rep = document.querySelector('.row-reply')
    if(rep.style.display == 'block'){
       rep.style.display = 'none';
    //    rep.style.visibility = 'hidden';

    } else {
        rep.style.display = 'block';

    }
}



function selectUpvotes(){
if(onselect){
    document.querySelector(".checked");
    display: inline
}

}


