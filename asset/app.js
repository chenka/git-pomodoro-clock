
const vm = new Vue({
  el: '#app',
  data: {
    percentage: 0,
    breakLength: 5,
    sessionLength: 25,
    state: 'stop',
    time: 25,
    totalSeconds: null,
    pause: true,
    countdown: false,
    percentage: 0,
    stateText: 'Session',
    selectedLength: 'session',
    background: 'darkolivegreen',
    options: {
      session: {
        key: 'sessionLength',
        text: 'Session',
        switchTo: 'break',
        background: 'darkolivegreen',
        getTotalSeconds() {
          return vm.sessionLength * 60 - 1
        }
      },
      break: {
        key: 'breakLength',
        text: 'Break !',
        switchTo: 'session',
        background: 'brown',
        getTotalSeconds() {
          return vm.breakLength * 60 - 1
        }
      }
      
    }
  },
  created() {
    setInterval(() => {
      if (this.pause) return
      if (this.totalSeconds == 0) {
        const switchTo = this.options[this.selectedLength].switchTo
        const options = this.options[switchTo]
        this.selectedLength = switchTo
        this.background = options.background
        this.stateText = options.text
        this.totalSeconds = options.getTotalSeconds()
        this.percentage = '0'
        this.time = this.getTime()
        return
      }
        this.totalSeconds -= 1
        this.time = this.getTime()
        this.percentage = 100 - (this.totalSeconds / (this[this.options[this.selectedLength].key] * 60)) * 100
    }, 1000)
  },
  methods: {
    setValue(key, val) {
      if (!this.pause || (this[key] + val) == 0) {
        return
      }
      this[key] += val

      if (key == 'sessionLength' && this.selectedLength == 'session') {
        this.time = this[key]
        this.countdown = false
      }
      if (key == 'breakLength' && this.selectedLength == 'break') {
        this.time = this[key]
        this.countdown = false
      }
    },
    getTime() {
      let time
      let minutes = Math.floor(this.totalSeconds / 60)
      minutes = minutes % 60
      let seconds = this.totalSeconds % 60
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      time = `${minutes}:${seconds}`
      if (this.totalSeconds > 3600) { // > 1 hours
        const hours = Math.floor(this.totalSeconds / 3600)
        time = hours + ':'+ time
      }
      return time
    },
    runClock() {
      switch(this.state) {
        case 'stop': {
          if (this.countdown) {
            this.pause = !this.pause
            return
          }
          if (!this.countdown) {
            this.totalSeconds = this.options[this.selectedLength].getTotalSeconds()
            this.time = this.getTime()
            this.percentage = 0
          }
          
          this.pause = false
          this.state = 'session'
          this.countdown = true
          break;
        }
        case 'session': {
          this.pause = true
          this.state = 'stop'
        }
      }
    }
  }
})