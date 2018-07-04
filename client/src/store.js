/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import './firebase'
import firebase from 'firebase'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: []
  },
  mutations: {
    allQuestions (state, payload) {
      console.log('ini payload', payload)
      state.questions = payload
    }
  },
  actions: {
    allQuestions (context, payload) {
      axios.get('https://h8overflow-server.annisaayu.tech/questions')
        .then(response => {
          console.log(response.data.result)
          context.commit('allQuestions', response.data.result)
        })
        .catch(err => {

        })
    }
  }
})
