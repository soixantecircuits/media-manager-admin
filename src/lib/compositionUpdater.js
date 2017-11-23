export default {
  methods: {
    compositionWasUpdated() {
      this.progressValue = 0
      this.initFragmentIn = this.fragmentIn
      this.initFragmentOut = this.fragmentOut
      this.$emit('update', this.fragmentIn, this.fragmentOut)
      this.updatingComposition = false
    },
    updateComposition () {
      if(!this.$spacebro || !this.$spacebro.connected) {
        alert('Not connected to spacebro!')
        return
      }

      let vm = this
      let promise = new Promise((resolve) => {
        vm.updatingComposition = true
        vm.spacebroUpdated = false

        let interval = setInterval(() => {
          vm.progressValue += 10

          if (vm.progressValue >= 100) {
            vm.progressValue = 0
          }

          if (vm.spacebroUpdated) {
            clearInterval(interval)
            vm.compositionWasUpdated()

            if (resolve) {
              resolve()
            }
          }
        }, 100)
      })

      return promise
    },
  },
  data () {
    return {
      progressValue: 0,
      updatingComposition: false,
      spacebroUpdated: false
    }
  }
}