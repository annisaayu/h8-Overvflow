<template>
    <div>
        <!-- Modal -->
    <div class="modal fade" id="myModal2" role="dialog">
        <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Modal Header</h4>
            </div>
            <div class="modal-body">
            <div id="post-editor">
                <h2>Your Answer</h2>
                <editor api-key="909r3dp20vj7j0frdhgc1pkqe5n5rr5tz254q3p4k905xu6z" :init="{plugins: 'wordcount'}"></editor>
            </div>
            <div style="margin-top: 10px;" id="post">
                <button class="btn btn-primary">Update Question</button>
            </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
export default {
  name: 'edit',
  components: {
      Editor
  }
}
</script>

<style>

</style>
