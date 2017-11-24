<template>
  <div class="media-view-toolbar">
    <md-toolbar md-theme="grey topbar">
      <md-button class="md-primary" @click.native="$emit('back')">Back to list</md-button>
      <div class="flex"></div>
      <div v-if="showNavigation">
        <md-button :disabled="!allowPrevious" @click.native="$emit('previous')">Previous</md-button>
        <md-button :disabled="!allowNext" @click.native="$emit('next')">Next</md-button>
      </div>
      <div class="flex"></div>
      <md-button @click.native="sendEmail" :disabled="sendingEmail || !ready">
        <span v-show="!sendingEmail">Send Email</span>
        <dots-spinner v-if="sendingEmail"></dots-spinner>
      </md-button>
    </md-toolbar>
  </div>
</template>
<script>
  import DotsSpinner from '../DotsSpinner.vue'

  export default {
    components: {DotsSpinner},
    name: 'media-view-toolbar',
    props: {
      allowPrevious: {
        type: Boolean,
        default: false
      },
      allowNext: {
        type: Boolean,
        default: false
      },
      ready: {
        type: Boolean,
        required: true
      },
      showNavigation: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      sendEmail () {
        let vm = this
        vm.sendingEmail = true
        this.$emit('email')

        setTimeout(() => {
          vm.sendingEmail = false
        }, 2500)
      }
    },
    data () {
      return {
        sendingEmail: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-view-toolbar {
    .flex {
      flex: 1;
    }
  }
</style>
