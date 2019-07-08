<template>
  <div id="frame">
    <div class="alert alert-primary position-absolute w-100 text-center word-container d-none" style="z-index: 5000" role="alert">
      <div class="mb-2">ENTRER LE MOT A DEVINER</div>
      <input class="form-control text-center" v-model="currentWord"/>
      <button class="btn btn-primary mt-1 draw-btn">DRAW!</button>
    </div>
    <div class="alert alert-primary position-absolute w-100 text-center get-winner d-none" style="z-index: 5000" role="alert">
    </div>
    <div id="sidepanel">
      <div id="profile">
        <div class="wrap">
          <p>ROOM_NAME</p>
          <i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
        </div>
      </div>
      <div id="contacts">
        <ul class="room-list">
        </ul>
      </div>
    </div>
    <div class="content">
      <div class="contact-profile">
        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
        <span class="actual-word"></span>
        <button type="button" class="btn btn-start btn-success float-right m-2 mr-5 d-none" @dblclick="this.startGame">START</button>
        <button type="button" class="btn btn-stop btn-danger float-right m-2 mr-5 d-none" @dblclick="this.deleteRoom">DELETE</button>
      </div>
      <div class="draws w-75 float-left text-center">
        <div class="draw-container d-none">
          <input type="color"  class="js-color-picker">
          <input type="range" class="js-line-range" min="1" max="72" value="1">
          <label class="js-range-value">1</label>Px
          <div class="d-flex justify-content-center canvas-container">
            <canvas class="js-paint paint-canvas" id="canvas" width="600" height="600"></canvas>
          </div>
        </div>
        <div class="draw-display-container">
        </div>
      </div>
      <div class="messages w-25 float-right">
        <ul>
        </ul>
      </div>
      <div class="message-input">
        <div class="wrap">
          <input type="text" class="response-input" placeholder="Write your message..." v-model="response"/>
          <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
          <button class="submit send-response" key="submitKey"  @dblclick="this.sendResponse"><i class="far fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src='//production-assets.codepen.io/assets/common/stopExecutionOnTimeout-b2a7b3fe212eaa732349046d8416e00a9dec26eb7fd347590fbced3ab38af52e.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>

<script>
import io from 'socket.io-client';
import { setInterval, setTimeout } from 'timers';


export default {
  name: 'ChatRoom',
  data: function () {
    return {
      roomId: window.location.pathname.split('/')[2],
      username: false,
      userColor: false,
      isCreator: false,
      drawTurn: false, 
      onDrawTurn: false,
      currentWord: '', 
      response: '',
      socketio: io('http://localhost:7000/', {transports: ['websocket']}),
      submitKey: 0
    }
  },
  methods: {
    getUserName: function(){
      this.$data.username = localStorage.getItem('guesswhat-name')
      this.$data.userColor = localStorage.getItem('guesswhat-color')
      this.$data.isCreator = localStorage.getItem('guesswhat-creator-token')
    },
    setRediction: function () {
      if(!this.$data.username || this.$data.username == '') {
        this.$router.push('/')
        return false
      }

      this.joinRoom()
    },
    startGame() {
      let roomId = this.$data.roomId;
      let isCreator = this.$data.isCreator;
      let that = this
      this.socketio.emit('whoami', {room:roomId}, function(response) {
        if(response.creator == isCreator){
          $('.btn-start').remove()
          that.socketio.emit('get-turn', {ID:Number(roomId)})
        }
      })
    },
    newTurn: function () {
      let roomId = this.$data.roomId;
      let isCreator = this.$data.isCreator;
      let that = this
      this.socketio.emit('whoami', {room:roomId}, function(response) {
        if(response.creator == isCreator){
          $('.btn-start').remove()
          that.socketio.emit('get-turn', {ID:Number(roomId)})
        }
      })
    },
    setTurn: function () {

      let roomId = this.$data.roomId;
      let isCreator = this.$data.isCreator;
      let that = this;
      this.socketio.on('set-turn', function(data){
        that.drawTurn = true;
        if(data[0].name == that.$data.username){
            $('.word-container').removeClass('d-none')
            $('.draw-btn').dblclick(function(){
                that.onDrawTurn = true
                if(that.drawTurn){
                  that.drawTurn = false;
                  that.socketio.emit('set-word', {room:roomId, message: that.currentWord});
                  $('.word-container').addClass('d-none');
                  $('.draw-container').removeClass('d-none');
                  that.sendDesign()
                }
            })
        }
      })

    },
    deleteRoom() {
      let roomId = this.$data.roomId;
      let isCreator = this.$data.isCreator;
      let that = this
      this.socketio.emit('whoami', {room:roomId}, function(response) {
        if(response.creator == isCreator){
          that.socketio.emit('delete-room', {ID:Number(roomId)})
        }
      })
    },
    currentDraw() {
      let that = this;
      this.socketio.on('emit-draw', function(data){
          if(!that.onDrawTurn){
            var image = new Image();
            image.src = data.message;
            $('.draw-display-container').html(image)
          }
      })
    },
    sendResponse () {

        let response = this.$data.response;
        let name  = this.$data.username;
        let roomId = this.$data.roomId;
        let userColor = this.$data.userColor;
        
        if($('.response-input').val().length != 0 && !this.onDrawTurn){
          this.socketio.emit('response', {room:roomId, message: response, name, color: userColor});
          this.submitKey += 1
        }
    },
    joinRoom: function () {

      let roomId = this.$data.roomId;
      let username = localStorage.getItem('guesswhat-name')
      let userColor = this.$data.userColor
      let that = this

      this.socketio.emit('join-room', {ID: Number(roomId),username: String(username) }, function(response){
        console.log(response);
      });

      this.socketio.emit('room-users', {ID: Number(roomId),username: String(username) }, function(response){
        for (let i = 0; i < response.length; i++) {

          let roomList = document.querySelector('.room-list');
          let roomContainer = document.createElement('li');
          let roomWrapper = document.createElement('div');
          let roomStatus = document.createElement('span');
          let roomData = document.createElement('div');
          let roomName = document.createElement('p');
          let roomHref = document.createElement('a');

          roomContainer.classList.add('contact');
          roomWrapper.classList.add('wrap');
          roomStatus.classList.add('contact-status');
          roomStatus.classList.add('online');
          roomData.classList.add('meta');
          roomHref.setAttribute('href', '/chat-room/'+ response[i].name)
          roomName.classList.add('name');
          roomName.classList.add('h4');
          roomName.classList.add('text-center');

          roomName.innerHTML = response[i].name
          roomList.append(roomContainer);
          roomContainer.append(roomWrapper);
          roomWrapper.append(roomStatus);
          roomWrapper.append(roomData);
          roomData.append(roomHref);
          roomHref.append(roomName);

        }
      });

      this.socketio.on('message', function(data){

        if(data.find){
          that.onDrawTurn = false;

          let drawContainer = $('.draw-container');
          $('.paint-canvas').remove();
          $('.canvas-container').html('<canvas class="js-paint paint-canvas" id="canvas" width="600" height="600"></canvas>');
          $('.draw-display-container').html(' ')
          $('.draw-container').addClass('d-none');
          that.setPaint();
          $('.get-winner').removeClass('d-none');
          $('.get-winner').html( '<strong>' + data.name+ '</strong>'+ ' FIND THE WORD')

          setTimeout(() => {
             $('.get-winner').addClass('d-none');
          }, 2000);

          that.newTurn()
        }

        if(data.message != '' ) {
          $('<li class="replies">'+data.name+'<p style="background-color:'+data.color+'">' + data.message + '</p></li>').appendTo($('.messages ul'));
          $('.response-input').val(null);
          $('.contact.active .preview').html('<span>'+ data.name +'</span>' + data.message);
          $(".messages").animate({ scrollTop: $(document).height() }, "fast");      
        }

      });
    },
    beginTurn: function () {
      this.socketio.on('begin-turn', function(data){
        let wordLength = data.word.length;
        let getHideWord = ''
        for (let i = 0; i < wordLength; i++) {
          getHideWord += '_ '
        }
        $('.actual-word').text(getHideWord)
      });
    },
    whoAmI: function () {
      
      let response = this.$data.response;
      let name  = this.$data.username;
      let roomId = this.$data.roomId;
      let userColor = this.$data.userColor;
      let isCreator = this.$data.isCreator;

      this.socketio.emit('whoami', {room:roomId}, function(response) {
        if(response.creator == isCreator){
          let btnStart = $('.btn-start').removeClass('d-none');
          let btnStop = $('.btn-stop').removeClass('d-none');
        }
      })
    },
    getDeletion: function () {
      let that = this
      this.socketio.on('quit-room', function(data){
        that.$router.push('/lobby')
      })
    },
    sendDesign: function () {
      let that = this
      setInterval(function(){
        
        let response = that.$data.response;
        let name  = that.$data.username;
        let roomId = that.$data.roomId;
        let userColor = that.$data.userColor;
        
        if(that.onDrawTurn){
          let canvasToBase64 = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');

          that.socketio.emit('send-image',  {room:roomId, message: canvasToBase64})

        }
      }, 1000)

    },
    setPaint: function (){
      const paintCanvas = document.querySelector( '.js-paint' );
      const context = paintCanvas.getContext( '2d' );
      context.lineCap = 'round';

      const colorPicker = document.querySelector( '.js-color-picker');

      colorPicker.addEventListener( 'change', event => {
          context.strokeStyle = event.target.value; 
      } );

      const lineWidthRange = document.querySelector( '.js-line-range' );
      const lineWidthLabel = document.querySelector( '.js-range-value' );

      lineWidthRange.addEventListener( 'input', event => {
          const width = event.target.value;
          lineWidthLabel.innerHTML = width;
          context.lineWidth = width;
      } );

      let x = 0, y = 0;
      let isMouseDown = false;

      const stopDrawing = () => { isMouseDown = false; }
      const startDrawing = event => {
          isMouseDown = true;   
        [x, y] = [event.offsetX, event.offsetY];  
      }
      const drawLine = event => {
          if ( isMouseDown ) {
              const newX = event.offsetX;
              const newY = event.offsetY;
              context.beginPath();
              context.moveTo( x, y );
              context.lineTo( newX, newY );
              context.stroke();
              [x, y] = [newX, newY];
          }
      }

      paintCanvas.addEventListener( 'mousedown', startDrawing );
      paintCanvas.addEventListener( 'mousemove', drawLine );
      paintCanvas.addEventListener( 'mouseup', stopDrawing );
      paintCanvas.addEventListener( 'mouseout', stopDrawing );
    },
    newUser: function () {
      let roomId = this.$data.roomId;
      let username = this.$data.username;
      this.socketio.on('new-user', function(response){
        
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = '';

        for (let i = 0; i < response.length; i++) {
        
          let roomContainer = document.createElement('li');
          let roomWrapper = document.createElement('div');
          let roomStatus = document.createElement('span');
          let roomData = document.createElement('div');
          let roomName = document.createElement('p');
          let roomHref = document.createElement('a');

          roomContainer.classList.add('contact');
          roomWrapper.classList.add('wrap');
          roomStatus.classList.add('contact-status');
          roomStatus.classList.add('online');
          roomData.classList.add('meta');
          roomHref.setAttribute('href', '/chat-room/'+ response[i].name)
          roomName.classList.add('name');
          roomName.classList.add('h4');
          roomName.classList.add('text-center');

          roomName.innerHTML = response[i].name
          roomList.append(roomContainer);
          roomContainer.append(roomWrapper);
          roomWrapper.append(roomStatus);
          roomWrapper.append(roomData);
          roomData.append(roomHref);
          roomHref.append(roomName);

        }
      });
    }
  },
  created() {
    this.getUserName()
    this.setRediction()
    this.whoAmI()
    this.getDeletion()
    this.setTurn()
    this.beginTurn()
    this.sendDesign()
    this.currentDraw()
  },
  mounted () {
    let that = this
    setTimeout(function (){
      that.newUser()      
    }, 3000)
    this.setPaint()
  }
}

</script>

<style scoped>
  .room-list {
    list-style: none;
  }
  .name{
    cursor: pointer;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->


