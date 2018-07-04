<template>
  <div class="home">
    <Navbar></Navbar>
    <div class="ask">
      <button class="btn btn-primary" @click="askQuestion">Ask Question</button>
    </div>
    <div id="mainbar">
      <div class="header">All Questions</div>
      <div id="qlist">
        <div v-for="(question, index) in allQuestions" :key="index" class="question">
          <div class="cp">
            <div class="vote">
              <div class="count">{{question.upVote.length}}</div>
              <div>voteUp</div>
            </div>
          </div>
          <div class="cp">
            <div class="vote">
              <div class="count">{{question.downVote.length}}</div>
              <div>voteDown</div>
            </div>
          </div>
          <div class="cp">
            <div class="answers">
              <div class="count">{{question.answers.length}}</div>
              <div>answers</div>
            </div>
          </div>
          <div class="summary" @click="readQuestion(question)">
            <h4>{{question.title}}</h4>
            <div class="qstatus">by: {{question.user.name}}</div>
          </div>
          <div v-if="question.user._id === user">
            <a class="glyphicon glyphicon-pencil" @click="edit(question, index)"></a><a class="glyphicon glyphicon-trash" data-toggle="modal" data-target="#myModal" @click="deleteQuestion(question._id, index)"></a>
          </div>
        </div>
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
import Navbar from '../components/Navbar.vue'
import axios from 'axios'
import Alert from '../components/Alert.vue'
export default {
  name: 'home',
  data: function () {
    return {
      questions: null,
      tags: [],
      user: null,
      msg: '',
      status: false
    }
  },
  components: {
    Navbar,
    Alert
  },
  created: function () {
    localStorage.removeItem('editQuestion')
    this.$store.dispatch('allQuestions')
    this.user = localStorage.getItem('userId')
  },
  computed: {
    allQuestions () {
      this.questions = this.$store.state.questions
      return this.questions
    }
  },
  methods: {
    clear () {
      this.msg = ''
      this.status = false
    },
    askQuestion () {
      this.$router.push({name: 'askpage'})
    },
    readQuestion (question) {
      localStorage.setItem('choosenQuestion', JSON.stringify(question))
      this.$router.push({name: 'questionpage'})
    },
    deleteQuestion (id, index) {
      axios.delete(`https://h8overflow-server.annisaayu.tech/questions/${id}`,
        {
          headers: {
            token: localStorage.getItem('Htoken')
          }
        })
        .then(response => {
          this.msg = response.data.message
          this.status = true
          this.allQuestions.splice(index, 1)
        })
        .catch(err => {
          this.msg = err.response.data.message
          this.status = false
        })
    },
    edit (question, index) {
      localStorage.setItem('editQuestion', JSON.stringify(question))
      this.$router.push({name: 'askpage'})
    }
  }
}
</script>

<style scoped>
.ask {
  margin-right: 100px;
  float: right;
}
#mainbar {
  /* border: solid 1px black;
  background-color: aliceblue; */
  margin: 0 auto;
  margin-top: 60px;
  padding: 0;
  width: 50%;
}
.header {
  /* border: solid 1px red; */
  margin: 10px 10px;
  padding: 10px 10px;
  text-align: center;
}
#qlist {
  /* border: solid 1px grey; */
  margin: 10px 10px;
  padding: 5px 5px;
}
.question {
  border-top: solid 1px grey;
  border-bottom: solid 1px grey;
  /* margin: 1px 1px; */
  padding: 5px 5px;
  display: flex;
}
.cp {
  /* border: solid 1px gray; */
  margin: 1px 1px;
  margin-top: 20px;
  padding: 10px 10px;
  height: 50px;
  width: 70px;
  text-align: center;
}
.summary {
  /* border: solid 1px gray; */
  margin: 1px 1px;
  padding: 5px 5px;
  padding-left: 50px;
  min-height: 50px;
  width: 100%;
  cursor: pointer;
}
.tags {
  margin: 1px 1px;
  padding: 5px 5px;
}
.tag {
  margin-left: 5px;
  margin-right: 5px;
}
.qstatus {
  float: right;
}
a {
  cursor: pointer;
}
</style>
