<template>
  <div class="media">
    <mediaview></mediaview>
  </div>
</template>

<script>
  import MediaView from './components/MediaView'
  export default {
    components: {
      mediaview: MediaView
    }
  }
</script>

<style>

html {
  height: 100%;
}

#app {
  color: #2c3e50;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #ff5858;
  text-decoration: none;
}
#app p {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}

#app > div {
  position: absolute;
  width: 100%;
}
.media {
  background-color: #000;
  width: 100%;
  min-height: 100vh;
}
</style>