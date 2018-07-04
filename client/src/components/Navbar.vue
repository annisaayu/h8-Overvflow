<template>
  <div>
    <nav class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header">
							<a href="/" class="navbar-brand">H8overflow</a>
            </div>
            <ul class="nav navbar-nav">
							<li><router-link to="/">Questions</router-link></li>
            </ul>
            <form class="navbar-form navbar-left" action="/action_page.php">
							<div class="input-group">
								<!-- <input type="text" class="form-control" placeholder="Search" name="search">
								<div class="input-group-btn">
									<button style="height: 34px;" class="btn btn-default" type="submit">
										<i class="glyphicon glyphicon-search"></i>
									</button>
								</div> -->
							</div>
            </form>
            <ul v-if="getToken === null" class="nav navbar-nav navbar-right">
							<li><router-link to="/signup"><span class="glyphicon glyphicon-edit"></span> Sign up</router-link></li>
							<li><router-link to="/login"><span class="glyphicon glyphicon-log-in"></span> Log in</router-link></li>
            </ul>
            <ul v-if="getToken !== null" class="nav navbar-nav navbar-right">
                <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" id="user" href="#"><span class="glyphicon glyphicon-user"></span> {{getUser}}</a>
									<ul class="dropdown-menu">
										<li><a href="#" @click="logout"><span class="glyphicon glyphicon-log-out"></span> Log out</a></li>
									</ul>
                </li>
            </ul>
        </div>
    </nav>
  </div>
</template>

<script>
/* eslint-disable */
import jwt from "jsonwebtoken"
export default {
  name: 'navbar',
  computed: {
    getToken () {
      return localStorage.getItem('Htoken')
    },
    getUser () {
      return localStorage.getItem('name')
    }
  },
  methods: {
    logout () {
      this.$router.push({name: 'home'})
      localStorage.removeItem('Htoken')
      localStorage.removeItem('email')
      localStorage.removeItem('name')
      localStorage.removeItem('userId')
      window.location.reload()
    }
  }
}
</script>

<style scoped>
#user {
    cursor: pointer;
}
</style>
