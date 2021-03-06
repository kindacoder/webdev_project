const socket = io();

socket.on('connected', (data) => {
    console.log("Connected " + socket.id)
    
})

$(function () {
    const msglist = $('#msglist')
    const sendbtn = $('#sendmsg')
    const msgbox = $('#msgbox')
    const loginbox = $('#loginbox')
    const loginbtn = $('#loginbtn')
    const loginDiv = $('#login-div')
    const chatDiv = $('#chat-div')

    const user = ''
    
    
    sendbtn.click(function () {
        socket.emit('send_msg', {
            user: localStorage.getItem("username"),
            message: msgbox.val()
        })
    })

    socket.on('recv_msg', function (data) {
        msglist.append($('<li>' + data.user + ': ' + data.message + '</li>'))
    })
})
$(document).ready(function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
  
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
  
    socket.on('draw', drawFromServer);
  
    let current = {};
    let drawing = false;
  
    function drawLine(x1, y1, x2, y2, emit = true) {
      if (!drawing) {
        return;
      }
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = 'red';
      context.stroke();
      context.closePath();
  
      if (!emit) {
        return;
      }
  
      const emitToServer = {
        x1, y1, x2, y2
      }
  
      socket.emit('draw', emitToServer);
    }
  
  
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseout', onMouseUp);

    function onMouseDown(e) {
      current.x1 = e.clientX;
      current.y1 = e.clientY;
      drawing = true;
    }
  
    function onMouseUp(e) {
      drawLine(current.x1, current.y1, e.clientX, e.clientY);
      drawing = false;
    }
  
    function onMouseMove(e) {
      drawLine(current.x1, current.y1, e.clientX, e.clientY);
      current.x1 = e.clientX;
      current.y1 = e.clientY;
    }
  
    function drawFromServer(data) {
      if (drawing) {
        drawLine(data.x1, data.y1, data.x2, data.y2, false);
      } else {
        drawing = true;
        drawLine(data.x1, data.y1, data.x2, data.y2, false);
        drawing = false;
      }
    }
  
    function onMouseOut(e) {
      console.log("Mouse Out")
    }
  })