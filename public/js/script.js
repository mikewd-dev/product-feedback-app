


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


// axios.post('/feedback/suggestions/:id')

// function buttonClick() {
// $("#content").click (function(){

//     $('#votes').html(function(i, val){
//         return val * 1 + 1
//     })
//     $.ajax({
//          method: "POST",
//         url:"/feedback/suggestions",
//         contentType: "application/json; charset=utf-8",
//         data: requests.upvotes,
//         success:function(data){
//             $("#votes").html(data)

//         },

//     })

// })

// }

function buttonClick() {
    // const requestId = event.getAttribute();
const xhr = new XMLHttpRequest();
xhr.onload = function(){
    // var data = upvotes
   document.getElementById('votes').innerHTML;

xhr.open("POST")
xhr.setRequestHeader("Content-type", "application/json");
xhr.send()
}
};

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

function selectUpvotes(){
if(onselect){
    document.querySelector(".checked");
    display: inline
}

}


