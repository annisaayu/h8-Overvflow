<template>
  <div>
    <Navbar></Navbar>
    <div class="register">
        <div class="container">
        <form>
            <div class="form-group">
              <label style="text-align: left;">Name</label>
              <input v-model="name" type="text" class="form-control" placeholder="Jhon Doe"><br>
              <label style="text-align: left;">Email</label>
              <input v-model="email" type="text" class="form-control" placeholder="something@mail.com"><br>
              <label style="text-align: left;">Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="*****"><br>
              <!-- <span id="alert" v-if="msg !== ''">{{msg}} <a class="btn btn-secondary" @click="clear">x</a></span> -->
              <hr>
              <button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal" @click="signup">Sign up</button>
              or
              <button type="button" class="btn btn-primary">Log in with Facebook</button>
            </div>
            <div id="register" class="form-group">
              <span>Already have an account?<router-link to='/login'> Log in</router-link></span>
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
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import Alert from '../components/Alert.vue'
const bcryptjs = require("bcryptjs")
export default {
  name: 'signup',
  components: {
    Navbar,
    Alert
  },
  data () {
    return {
      name: '',
      email: '',
      password: '',
      msg: '',
      status: false
    }
  },
  created: function () {
    localStorage.removeItem('editQuestion')
    let token = localStorage.getItem('Htoken')
    if (token !== null) {
        this.$router.push({name: 'home'})
    }
  },
  computed: {
    checker () {
      return this.msg
    }
  },
  methods: {
    clear () {
      this.name = '',
      this.email = '',
      this.password = '',
      this.msg = '',
      this.status = false
    },
    signup () {
      if ( this.name !== '' && this.email !== '' && this.password !== '') {
        let userData = {
          name: this.name,
          email: this.email,
          password: this.password
        }
        console.log(userData);
        
        axios
          .post('https://h8overflow-server.annisaayu.tech/users/sign-up', userData)
          .then(response => {
            
            console.log(response)
            this.msg = response.data.message
            this.status = true
          })
          .catch(err => {
            console.log(err)
            this.msg = 'Data is not valid'
            this.status = false
          })
      } else {
        if (this.name === '') {
          this.msg = 'Name must be filled !!'
          this.status = false
        } else if (this.email === '') {
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
  #alert {
    color: red;
    margin: auto;
    text-align: center;
  }
  a {
    cursor: pointer;
  }
  .register {
    margin: 0;
    padding: 0;
  }
  .container {
    margin: auto;
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
</style>
