<template>
  <div id="frame">
    <div class="content w-100">
      <div class="contact-profile p-5">
        <span class="h1 p-5">GUESSWATH</span>
      </div>
      <div class="draws w-100 float-left text-center pt-5 d-flex justify-content-center align-items-center">
        <div class="row">
          <div class="col-md-12 col-sm-12 col-lg-12">
            <span class="h1 mt-5">CHOOSE ROOM NAME</span>
          </div>
          <div class="col-md-12 col-sm-12 col-lg-12">
            <div class="username-input w-100 mt-5">
              <div class="wrap d-flex justify-content-center">
                <input type="text" placeholder="Choose your username ..." class="w-75 text-center" v-model="roomName"/>
                <button class="submit send-response" @click="setRoomName"><i class="far fa-smile"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src='//production-assets.codepen.io/asvuse sets/common/stopExecutionOnTimeout-b2a7b3fe212eaa732349046d8416e00a9dec26eb7fd347590fbced3ab38af52e.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>

<script>
import io from 'socket.io-client';
import { setInterval, setTimeout } from 'timers';

export default {
  name: 'CreateRoom',
  data: function(){
    return {
      roomName: '',
      newRoom: false,
      socketio: io('http://localhost:7000/', {transports: ['websocket']})
    }
  },
  methods: {
    setRoomName: function () {
        let roomName = this.$data.roomName;
        if(roomName && this.$data.newRoom == false){

            let that = this;
            this.$data.newRoom = true;
            setTimeout(function (){
              that.socketio.emit('create-room', {name: roomName}, function(response){
                  localStorage.setItem('guesswhat-creator-token', response.creator)
                  that.$router.push('/chat-room/' + response.ID);
              });
            }, 3000)

        }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


