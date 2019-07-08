<template>
  <div id="frame">
    <div class="content w-100">
      <div class="contact-profile p-5">
        <span class="h1 p-5">GUESSWATH</span>
      </div>
      <div class="draws w-100 float-left text-center pt-5 d-flex justify-content-center align-items-center">
        <div class="row">
          <div class="col-md-12 col-sm-12 col-lg-12">
            <span class="h1 mt-5">CHOOSE YOUR USERNAME</span>
          </div>
          <div class="col-md-12 col-sm-12 col-lg-12">
            <div class="username-input w-100 mt-5">
              <div class="wrap d-flex justify-content-center">
                <input type="text" placeholder="Choose your username ..." class="w-75 text-center" v-model="username"/>
                <button class="submit send-response" @click="setUserName"><i class="far fa-smile"></i></button>
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
import { setInterval } from 'timers';

export default {
  name: 'ChatRoom',
  data: function(){
    return {
      username: '',
      allColor: ['#3FEF12', '#BE786D', '#740170', '#EEECF3', '#36B124', '#963765', '#A231AA', '#F2E036', '#014FE4', '#21AE2D', '#2B363A', '#BDCEF7', '#9F98FC', '#E0E3FC', '#72D100', '#F3C29F', '#D5D94C', '#0DB95B', '#64B47A', '#0FCE1D', '#E01B3A', '#B00894', '#4A2048', '#CAC7E4', '#2E3FD4',
                '#DC4E78', '#9289A2', '#EFD101', '#9CB649', '#B78E66', '#332819', '#0BC946', '#B36857', '#AE3558', '#F0F8F5', '#E290AB', '#AB664B', '#DFF484', '#B23F89', '#7796F9', '#CEC6E7', '#1928F6', '#4D631F', '#8C1BBA', '#421E91', '#7603CF', '#AE8D68', '#3B5AF6', '#973B2E', '#67175B',
                '#6621BF', '#0DBB8A', '#5106B5', '#39C60E', '#10FAE5', '#24C567', '#47502D', '#B8FBEB', '#114D85', '#BA5B43', '#078CCF', '#416929', '#6D1690', '#1A257A', '#A34FF8', '#3F0CCC', '#B0E290', '#B0DD66', '#D70FC8', '#97CE7B', '#7AB767', '#427241', '#2F10C7', '#69F79C', '#F33C1A']

    }
  },
  methods: {
    setUserName: function () {
      let username = this.$data.username;
      if(username){

        let randomLimit = this.allColor.length
        let randomInt = this.getRandomInt(randomLimit)
        let randomColor = this.$data.allColor[randomInt]

        localStorage.setItem('guesswhat-name', username)
        localStorage.setItem('guesswhat-color', randomColor)
        this.$router.push('lobby')
      }

    },
    getRandomInt: function (max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
  },
}



var socket = io('http://localhost:7000/', {transports: ['websocket']});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


