<template>
  <div>
    <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" @click="clear">&times;</button>
            </div>
            <div class="modal-body">
            <p v-if="status === null" style="text-align: center; color: black"><span>{{msg}}</span></p>
            <p v-if="status === true" style="text-align: center; color: green"><span>{{msg}}</span></p>
            <p v-if="status === false" style="text-align: center; color: red"><span>{{msg}}</span></p>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: ['msg', 'status'],
  methods: {
    clear () {
      if (this.status === true) {
        this.$emit('clear')
        this.$router.push({name: 'home'})
      } else {
        this.$emit('clear')
      }
    }
  }
}
</script>

<style>

</style>
