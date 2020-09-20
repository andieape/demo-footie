var scoreState = {
    leftGoal: new Array(),
    rightGoal: new Array()
};

function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  var field = document.getElementById('field_rect').getBoundingClientRect(); 
  var leftGoalElem = document.getElementById('left_goal');
  var rightGoalElem = document.getElementById('right_goal');


  if (document.getElementById(elmnt.id + "header")) {

    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
  
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    elmnt.classList.add('active');
 
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.onmouseup = closeDragElement;
   
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
   
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
   
    
    if (elmnt.offsetTop - pos2 < field.top || 
        elmnt.offsetTop - pos2 > field.bottom - elmnt.offsetHeight ||
        elmnt.offsetLeft - pos1 < field.left ||
        elmnt.offsetLeft - pos1 > field.right - elmnt.offsetWidth 
        ) { return; }

    pos3 = e.clientX;
    pos4 = e.clientY;  

   
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {
    elmnt.classList.remove('active');

    checkGoal(leftGoalElem);
    checkGoal(rightGoalElem);
   
    document.onmouseup = null;
    document.onmousemove = null;

  }

  function checkGoal(goal) {

    let goalBounds = goal.getBoundingClientRect();

    if (elmnt.offsetTop - pos2 > goalBounds.top && 
        elmnt.offsetTop - pos2 < goalBounds.bottom &&
        elmnt.offsetLeft - pos1 > goalBounds.left &&
        elmnt.offsetLeft - pos1 < goalBounds.right - elmnt.offsetWidth        
        ) 
        {            
            
            console.log('GOAL!');
            if (goal.id == "right_goal") {

              if ( !scoreState.rightGoal.includes(elmnt)) { 
                scoreState.rightGoal.push(elmnt); 
                cloneBall(elmnt, 'right')
              }

            } else {

              if (!scoreState.leftGoal.includes(elmnt)) {  
                scoreState.leftGoal.push(elmnt); 
                cloneBall(elmnt, 'left')
              }
            }             
            
        } else {
          if (goal.id == "right_goal") {
            if (scoreState.rightGoal.includes(elmnt)) { 
              let index = scoreState.rightGoal.indexOf(elmnt);
              scoreState.rightGoal.splice(index, 1)              
              removeBall(elmnt);            
            }
            
          } else {
            if (scoreState.leftGoal.includes(elmnt)) { 
              let index = scoreState.leftGoal.indexOf(elmnt);
              scoreState.leftGoal.splice(index, 1)              
              removeBall(elmnt);   
            }
          }
            console.log('noGOAL')
            
        }
        checkScore(goal);
      
  }
  function checkScore(goal) {
      let leftScore = document.querySelector('#left_score');
      let rightScore = document.querySelector('#right_score');

      leftScore.innerHTML = scoreState.leftGoal.length;
      rightScore.innerHTML = scoreState.rightGoal.length;

  }


  function cloneBall(elem, side) {
    let goal = "";
    if (side === "left") {
        goal = document.querySelector("#balls_left");
    } else {
        goal = document.querySelector("#balls_right");
    } 

    let newBall = elem.cloneNode(true);
    newBall.classList.add('ball_in_goal');
    newBall.classList.remove('player_circle');
    newBall.id = newBall.id + "clone";
    newBall.style = '';

    goal.appendChild(newBall);


     
    
  }

  function removeBall(elem) {
      let destrBall = document.querySelector("#"+elem.id+"clone");
       destrBall.remove();
  }

}

window.onload = function (e) {
    var circles = document.querySelectorAll('.player_circle');
    circles.forEach((x)=>{        
        dragElement(x);
    });
 
}
