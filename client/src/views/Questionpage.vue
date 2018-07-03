<template>
  <div>
    <Navbar></Navbar>
    <div class="ask">
      <button class="btn btn-primary" @click="askQuestion">Ask Question</button>
    </div>
    <div id="mainbar">
        <h2 style="margin-left: 10px;">{{question.title}}</h2>
        <span style="margin-left: 650px; border: solid 1px black; border-radius: 20%;padding: 5px 5px;">ask by: {{authorQuestion}}</span>
        <div class="post-layout">
            <div class="votecell post-layout">
                <div class="vote">
                    <button data-toggle="modal" data-target="#myModal" @click="upVoteQ" class="btn btn-primary"><span class="glyphicon glyphicon-arrow-up"></span></button>
                    <h4>{{totalvote}}</h4>
                    <button data-toggle="modal" data-target="#myModal" @click="downVoteQ" class="btn btn-primary"><span class="glyphicon glyphicon-arrow-down"></span></button>
                </div>
            </div>
            <div class="postcell post-layout">
                <div class="post">
                    <p v-html="question.content"></p>
                </div>
            </div>
        </div>
        <div class="answer">
            <div class="answer-header">
                <div v-if="answers.length <=1" id="header-title">
                    <h4>{{answers.length}} Answer</h4>
                </div>
                <div v-if="answers.length > 1" id="header-title">
                    <h4>{{answers.length}} Answers</h4>
                </div>
                <div id="tabs">
                    <ul class="nav navbar-nav">
                        <li><a href="#">Active</a></li>
                        <li><a href="#">Oldest</a></li>
                        <li><a href="#">Votes</a></li>
                    </ul>
                </div>
            </div>
            <div v-if="answers.length !== 0">
                <div v-for="(answer, index) in answers" :key="index" class="answer post-layout">
                    <div class="ansName col-sm-3">
                        <span>by: {{authorAnswer[index]}}</span>
                    </div>
                    <div class="votecell post-layout">
                        <div class="vote">
                            <button data-toggle="modal" data-target="#myModal" @click="upVoteA(answer._id, index)" class="btn btn-primary"><span class="glyphicon glyphicon-arrow-up"></span></button>
                            <h4>{{answererTotalVote[index]}}</h4>
                            <button data-toggle="modal" data-target="#myModal" @click="downVoteA(answer._id, index)" class="btn btn-primary"><span class="glyphicon glyphicon-arrow-down"></span></button>
                        </div>
                    </div>
                    <div class="postcell post-layout">
                        <div class="post">
                            <p v-html="answer.answer"></p>
                        </div>
                    </div>
                    <div style="text-align: center; cursor: pointer;" v-if="answer.user === user">
                            <a class="glyphicon glyphicon-pencil"></a><a class="glyphicon glyphicon-trash" data-toggle="modal" data-target="#myModal" @click="deleteAnswer(answer._id, index)"></a>
                    </div>
                </div>
            </div>
            <div class="new-answer">
                <div id="post-editor">
                    <h2>Your Answer</h2>
                    <editor v-model="answer" api-key="909r3dp20vj7j0frdhgc1pkqe5n5rr5tz254q3p4k905xu6z" :init="{plugins: 'wordcount'}"></editor>
                </div>
                <div style="margin-top: 10px;" id="post">
                    <button class="btn btn-primary" @click="answerQuestion">Answer Question</button>
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
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import Alert from '../components/Alert.vue'
export default {
  name: 'questionpage',
  components: {
    Navbar,
    Editor,
    Alert
  },
  data: function () {
    return {
      question: null,
      authorQuestion: '',
      authorAnswer: [],
      answer:'',
      answerCount: 0,
      answers: [],
      totalvote: 0,
      answererTotalVote: [],
      msg: '',
      status: null,
      user: null
    }
  },
  created: function () {
      let token = localStorage.getItem('Htoken')
      if (token == null) {
        this.$router.push({name: 'home'})
      }
      localStorage.removeItem('editQuestion')
      this.user = localStorage.getItem('userId')
      let data = localStorage.getItem('choosenQuestion')
      this.question = JSON.parse(data)
      let id = this.question._id
      axios.get(`http://localhost:3000/questions/${id}`, 
        {
          headers: {
            token: localStorage.getItem('Htoken')
          }
        })
        .then(response => {
            console.log(response)
            this.totalvote = response.data.result.upVote.length - response.data.result.downVote.length
            let arr = response.data.result.answers
            this.answers = response.data.result.answers
            arr.forEach(value => {
                let id = value._id
                // console.log(value)
                axios.get(`http://localhost:3000/answers/${id}`)
                  .then(response => {
                    // console.log('---->',response.data.result)
                    this.authorAnswer.push(response.data.result.user.name)
                    // console.log('---->',response.data.result.likes.length)
                    this.answererTotalVote.push(response.data.result.likes.length - response.data.result.dislikes.length)
                  })
                  .catch(err => {
                      console.log(err)
                  })
            })
            console.log('--->', this.answererTotalVote)
            this.authorQuestion = response.data.result.user.name

        })
        .catch(err => {
            console.log(err)
        })
      this.answers = this.question.answers
    //   console.log('--->',this.question)
      this.totalvote = this.question.upVote.length - this.question.downVote.length
    //   this.answererTotalVote = this.question.answers
    //   console.log(this.question)
  },
  methods: {
    clear () {
      this.msg = ''
      this.status = null
    },
    askQuestion () {
    //   window.location = "http://localhost:8080/#/askpage"
      this.$router.push({name: 'askpage'})
    },
    answerQuestion () {
        let userData = {
          user: localStorage.getItem('userId'),
          answer: this.answer,
        }
        let questionId = this.question._id
        axios.post(`http://localhost:3000/answers/${questionId}/add`, userData)
          .then(response => {
            //   console.log(response.data.message)
            //   console.log(response)
              this.answers.push(response.data.resultAnswer)
              this.authorAnswer.push(response.data.resultUser.name)
          })
          .catch(err => {
              console.log(err.response.data.message)
          })
          this.answer = ''
        // window.location.reload()
    },
    upVoteQ () {
        let questionId = this.question._id
        axios.put(`http://localhost:3000/questions/${questionId}/up-vote`,
          {

          },
          {
              headers: {
                token: localStorage.getItem('Htoken')
              }
          })
          .then(response => {
              console.log(response)
              this.msg = response.data.message
              this.totalvote++
          })
          .catch(err => {
              console.log(err.response.data.message)
              this.msg = err.response.data.message
          })
    },
    downVoteQ () {
        let questionId = this.question._id
        axios.put(`http://localhost:3000/questions/${questionId}/down-vote`,
          {

          },
          {
              headers: {
                token: localStorage.getItem('Htoken')
              }
          })
          .then(response => {
              console.log(response)
              this.totalvote--
              this.msg = response.data.message
          })
          .catch(err => {
              console.log(err.response.data.message)
              this.msg = err.response.data.message
          })
    },
    upVoteA (id, index) {
        console.log(id)
        axios.put(`http://localhost:3000/answers/${id}/up-vote`,
          {

          },
          {
              headers: {
                token: localStorage.getItem('Htoken')
              }
          })
          .then(response => {
              console.log(response)
              this.msg = response.data.message
              this.answererTotalVote[index]++
          })
          .catch(err => {
              console.log(err.response.data.message)
              this.msg = err.response.data.message
          })
    },
    downVoteA (id, index) {
        axios.put(`http://localhost:3000/answers/${id}/down-vote`,
          {

          },
          {
              headers: {
                token: localStorage.getItem('Htoken')
              }
          })
          .then(response => {
              console.log(response)
              this.msg = response.data.message
              this.this.answererTotalVote[index]--
          })
          .catch(err => {
              console.log(err.response.data.message)
              this.msg = err.response.data.message
          })
    },
    deleteAnswer (id, index) {
        axios.delete(`http://localhost:3000/answers/${id}`,
        {
          headers: {
            token: localStorage.getItem('Htoken')
          }
        })
        .then(response => {
            console.log('----adawdawdw>',this.answers[index])
          this.msg = response.data.message
          this.answers.splice(index, 1)
        })
        .catch(err => {
            console.log('--->',err)
          this.msg = err.message
        })
    }
  }
}
</script>

<style scoped>
.ask {
  margin-right: 100px;
  float: right;
}
.post-layout {
    /* border-top: solid 1px green; */
    border: solid 1px green;
    margin: 10px 2px;
    padding: 10px 10px;
    display: flex;
}
.answer-header {
    border-top: solid 1px green;
    border-bottom: solid 1px green;
    margin: 10px 10px;
    padding: 10px 10px;
    display: flex;
}
#header-title {
    /* border: solid 1px red; */
    padding: 5px 5px;
}
#tabs {
    /* border: solid 1px red; */
    padding: 5px 5px;
    margin-left: 2px;
}
.nav {
    margin-left: 545px;
}
.votecell {
    width: 8%;
    text-align: center;
}
.postcell {
    width: 100%;
}
.new-answer {
    margin: 10px 10px;
    padding: 10px 10px;
}
#mainbar {
  margin: 0 auto;
  margin-top: 70px;
  margin-bottom: 100px;
  padding: 0;
  width: 70%;
}
.ansName {
    /* border: solid 2px grey; */
    margin-top: 50px;
    min-height: 30px;
    text-align: center;
}
</style>
