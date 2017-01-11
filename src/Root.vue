<template>
  <div class="root">
    <h2>File Moderation</h2>
    <mylist></mylist>
  </div>
</template>

<script>
import Counter from './components/Counter'
import Mylist from './components/Mylist'
export default {
  components: {
    Counter,
    Mylist
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
  color: #42b983;
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

</style>
