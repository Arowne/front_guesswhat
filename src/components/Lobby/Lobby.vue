<template>
  <div id="frame">
    <div class="w-100 room-panel">
      <div id="profile">
        <div class="wrap">
          <span class="h1">GUESSWHAT</span>
        </div>
      </div>
      <div id="contacts">
        <h1 class="text-center mb-5">SELECT YOUR ROOM</h1>
        <ul class="room-list">
        <h1 class="text-white">
          <li class="contact">
            <div class="wrap">
              <div class="meta">
                <a href="/create-room">
                  <p class="name h1 text-center"> Ajouté <i class="fa fa-plus"></i></p>
                </a>
              </div>
            </div>
          </li>
        </h1>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src='//production-assets.codepen.io/assets/common/stopExecutionOnTimeout-b2a7b3fe212eaa732349046d8416e00a9dec26eb7fd347590fbced3ab38af52e.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<script src='https://code.jquery.com/jquery-2.2.4.min.js'></script>

<script>
import io from 'socket.io-client';
import { setInterval } from 'timers';
import { Certificate } from 'crypto';
import { NPN_ENABLED } from 'constants';

export default {
  name: 'Lobby',
  data: function () {
    return {
      username: false,
      socketio: io('http://localhost:7000/', {transports: ['websocket']})
    }
  },
  methods: {
    getUserName: function(){
      this.$data.username = localStorage.getItem('guesswhat-name')
    },
    setRediction: function () {
      if(!this.$data.username || this.$data.username == '') {
        this.$router.push('/')
      }
    },
    getRoom: function() {
      this.socketio.emit('get-room', function(response){
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
          roomHref.setAttribute('href', '/chat-room/'+ response[i].ID)
          roomName.classList.add('name');
          roomName.classList.add('h1');
          roomName.classList.add('text-center');

          roomName.innerHTML = response[i].name + '<i> (Nombre de personne connecté) </i>'
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
  mounted() {
    this.getUserName()
    this.setRediction()
    this.getRoom()
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


