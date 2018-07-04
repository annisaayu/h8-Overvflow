<template>
  <div class="askpage bounce-in-bottom">
    <Navbar></Navbar>
    <div v-if="updateQuestion === null" id="question-form">
        <div class="ask-title">
            <table>
                <tbody>
                    <tr>
                        <td class="title">Title </td>
                        <td class="input"><input v-model="title" type="text" class="form-control" placeholder="Title"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="post-editor">
            <editor v-model="question" api-key="909r3dp20vj7j0frdhgc1pkqe5n5rr5tz254q3p4k905xu6z" :init="{plugins: 'wordcount'}"></editor>
        </div>
        <div id="post">
            <button class="btn btn-primary" @click="post" data-toggle="modal" data-target="#myModal">Post Question</button>
        </div>
    </div>
    <div v-if="updateQuestion !== null" id="question-form">
        <div class="ask-title">
            <table>
                <tbody>
                    <tr>
                        <td class="title">Title </td>
                        <td class="input"><input v-model="updateQuestion.title" type="text" class="form-control" placeholder="Title"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="post-editor">
            <editor v-model="updateQuestion.content" api-key="909r3dp20vj7j0frdhgc1pkqe5n5rr5tz254q3p4k905xu6z" :init="{plugins: 'wordcount'}"></editor>
        </div>
        <div id="post">
            <button class="btn btn-primary" @click="update" data-toggle="modal" data-target="#myModal">Update Question</button>
        </div>
        <div id="post">
            <button class="btn btn-danger" @click="discard">Discard</button>
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
import Alert from '../components/Alert.vue'
import jwt from "jsonwebtoken"
import axios from 'axios'
export default {
  name: 'askpage',
  components: {
    Navbar,
    Editor,
    Alert
  },
  data: function () {
    return {
      title: '',
      question: '',
      tags: '',
      msg: '',
      status: false,
      updateQuestion: null
    }
  },
  created: function () {
    let token = localStorage.getItem('Htoken')
    if (token == null) {
      this.$router.push({name: 'home'})
    }
    let question = localStorage.getItem('editQuestion')
    this.updateQuestion = JSON.parse(question)
  },
  methods: {
    discard () {
      this.$router.push({name: 'home'})
    },
    clear () {
      this.title = ''
      this.question = ''
      this.status = false
    },
    post () {
      if (this.title !== '' & this.question !== '') {
        this.status = true
        // this.msg = 'Question posted'
        let questionData = {
          title: this.title,
          content: this.question,
        }
        axios.post('https://h8overflow-server.annisaayu.tech/questions/add', questionData,
          {
            headers: {
              token: localStorage.getItem('Htoken')
            }
          })
          .then(response => {
            console.log(response.data.message)
            console.log(response.data.result)
            this.msg = response.data.message
            this.status = true
          })
          .catch(err => {
            console.log(err.response.data.message)
            this.msg = err.response.data.message
            this.status = false
          })
      } else {
        if (this.title === '') {
          this.msg = 'Title must filled'
          this.status = false
        } else if (this.question === '') {
          this.msg = 'You need specifict question'
          this.status = false
        }
      }
    },
    update () {
      let questionData = {
          title: this.title,
          content: this.question,
        }
      if (this.updateQuestion.title !== '' & this.updateQuestion.content !== '') {
        this.status = true
        // this.msg = 'Question posted'
        let questionData = {
          title: this.updateQuestion.title,
          content: this.updateQuestion.content,
        }
        axios.put(`https://h8overflow-server.annisaayu.tech/questions/${this.updateQuestion._id}`, questionData,
          {
            headers: {
              token: localStorage.getItem('Htoken')
            }
          })
          .then(response => {
            console.log(response.data.message)
            console.log(response.data.result)
            this.msg = response.data.message
            this.status = true
          })
          .catch(err => {
            console.log(err.response.data.message)
            this.msg = err.response.data.message
            this.status = false
          })
      } else {
        if (this.updateQuestion.title === '') {
          this.msg = 'Title must filled'
          this.status = false
        } else if (this.updateQuestion.content === '') {
          this.msg = 'You need specifict question'
          this.status = false
        }
      }
    }
  }
}
</script>

<style scoped>
#question-form {
  /* border: solid 2px black; */
  margin: 0 auto;
  margin-top: 60px;
  padding: 0;
  width: 50%;
}
#post-editor {
  margin: 10px 10px;
}
.ask-title {
    margin: 10px 10px;
}
.title {
    padding: 20px 20px;
}
.input {
    width: 100%;
}
#post {
   float: right;
   margin: 10px 10px;
}
</style>
