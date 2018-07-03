<template>
  <div>
    <Navbar></Navbar>
    <div class="register bounce-in-top">
        <div class="container">
        <form>
            <div class="form-group">
              <label style="text-align: left;">Email</label>
              <input v-model="email" type="text" class="form-control" placeholder="something@mail.com"><br>
              <label style="text-align: left;">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="*****"><br>
              <hr>
              <button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal" @click="login">Log in</button>
              or
              <fb-signin-button
              data-toggle="modal" data-target="#myModal"
              :params="fbSignInParams"
              @success="onSignInSuccess"
              @error="onSignInError">
              Sign in with Facebook
              </fb-signin-button><br><br>
            </div>
            <div id="register" class="form-group">
              <span>Don't have an account?<router-link to='/signup'> Sign up</router-link></span>
            </div>
        </form>
        </div>
    </div>
    <Alert
    :msg="msg"
    :status="status"
    @clear="clear">
    </Alert>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Alert from '../components/Alert.vue'
import FBSignInButton from 'vue-facebook-signin-button'
Vue.use(FBSignInButton)
export default {
  name: 'login',
  components: {
    Navbar,
    Alert,
    FBSignInButton
  },
  data: function () {
    return {
      email: '',
      password: '',
      msg: '',
      status: false,
      fbSignInParams: {
        scope: 'email',
        return_scopes: true
      }
    }
  },
  created: function () {
    localStorage.removeItem('editQuestion')
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1702523219806004',
        cookie     : true,  // enable cookies to allow the server to access the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },
  methods: {
    clear () {
      this.email = ''
      this.password = ''
      this.msg = ''
      this.status = false
    },
    onSignInSuccess (response) {
      console.log('masuk')
      FB.api('/me',{fields: ['name','email','id']}, data => {
        console.log(data)
        let userData = {
          name: data.name,
          email: data.email,
          password: data.id,
        }
        axios.post('https://localhost:3000/users/loginFB', userData)
        .then(response => {
          if (response.status === 200) {
            let token = response.data.token
            this.msg = response.data.message
            localStorage.setItem('Htoken', response.data.token)
            localStorage.setItem('name', response.data.payload.name)
            localStorage.setItem('email', response.data.payload.email)
            localStorage.setItem('userId', response.data.payload.id)
            this.status = true
          } else {
            this.registerMessageFiled = response.data.message
          }
        })
        .catch(err => {
          console.log(err)
          this.registerMessageFiled = 'You Put Something Wrong'
        })
      })
    },
    onSignInError (error) {
      console.log('OH NOES', error)
    },
    login () {
      if (this.email !== '' && this.password !== '') {
            let userData = {
              email: this.email,
              password: this.password
            }
            console.log(userData)
            axios.post('http://localhost:3000/users/sign-in', userData)
              .then(response => {
                console.log(response)
                this.msg = response.data.message
                localStorage.setItem('Htoken', response.data.token)
                localStorage.setItem('name', response.data.payload.name)
                localStorage.setItem('email', response.data.payload.email)
                localStorage.setItem('userId', response.data.payload.id)
                this.status = true
              })
              .catch(err => {
                console.log(err)
                this.status = false
              })
      } else {
        if (this.email === '') {
          this.msg = 'Email must be filled !!'
          this.status = false
        } else {
          this.msg = 'Password must be filled !!'
          this.status = false
        }
      }
    }
  }
}
</script>

<style scoped>
  .fb-signin-button {
    /* This is where you control how the button looks. Be creative! */
    display: inline-block;
    padding: 7px 8px;
    border-radius: 3px;
    background-color: #4267b2;
    color: #fff;
    cursor: pointer;
  }
  .register {
    margin: 0;
    padding: 0;
  }
  .container {
    margin-top: 150px;
  }
  .form-group {
    border: solid 1px rgb(34, 40, 41);
    width: 500px;
    margin: 0 auto;
    padding: 10px 10px;
    margin-bottom: 5px;
  }
  #wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #register {
    text-align: center;
  }
  .bounce-in-top {
	-webkit-animation: bounce-in-top 1.1s both;
	        animation: bounce-in-top 1.1s both;
  }
  /* ----------------------------------------------
 * Generated by Animista on 2018-5-21 23:13:50
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation bounce-in-top
 * ----------------------------------------
 */
@-webkit-keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
            transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
            transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
            transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
@keyframes bounce-in-top {
  0% {
    -webkit-transform: translateY(-500px);
            transform: translateY(-500px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateY(-65px);
            transform: translateY(-65px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateY(-28px);
            transform: translateY(-28px);
    -webkit-animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
}
</style>
