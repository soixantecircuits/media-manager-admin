<template>
  <div class="mylist">
    <table align="center" class="mylist-table">
      <tr class="mylist-line">
        <th class="filename-field">Filename</th>
        <th class="path-field">Path</th>
        <th class="state-field">State</th>
      </tr>
      <tr v-for="(item, index) in items" v-bind:class="[ 'mylist-line', index % 2 == 0 ? 'mylist-line-alt' : '' ]">
        <td class="filename-field">{{ item.filename }}</td>
        <td class="path-field">{{ item.path }}</td>
        <td class="state-field">
          <input v-if="!states || states.length === 0" v-model="item.state" class="state-input" type="text" v-bind:disabled="!item.editing">
          <select v-else v-model="item.state" class="state-input">
            <option v-for="state in states" v-bind:value="state">{{ state }}</option>
          </select>
          <button v-if="(!states || states.length === 0) && item.editing === false" v-on:click="item.editing = true">Edit</button>
          <button v-else v-on:click="updateState(item._id, item.state)">Ok</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import Vue from 'vue'
  import request from 'superagent/superagent'
  import config from '../../settings/default.json'

  let data = {
    items: [],
    states: config.states
  }

  export default {
    data() {
      return data
    },
    methods: {
      getMediaList: getMediaList,
      
      updateState(id, state) {
        request.put(`http://${config.moderatorServer}/api/v1/medias/${id}`)
          .send({ state: state })
          .end((err, res) => { return err })

        let item = this.items.find(function (elem) {
          return elem._id === id
        })
        item.editing = false
      }
    }
  }

  getMediaList()
  function getMediaList() {
    request.get(`http://${config.moderatorServer}/api/v1/medias/all`)
      .end(function (err, res) {
        let list = JSON.parse(res.text)
        list.forEach((item) => {
          item.editing = false
        })
        list.forEach((item) => {
          data.items.push(item)
        })
      })
  }

</script>

<style>
.mylist {
  margin: 100px auto;
  text-align: left;
  line-height: 40px;
  user-select: none;
}

.mylist-table {
  width: 80%;
  background-color: #f0f0f0;
  border-style: solid;
  border-width: 0px 4px 0px 4px;
}

.mylist-line {
  border-style: solid;
  border-width: 1px 0px 1px 0px;
}

.mylist-line-alt {
  background-color: #d0d0d0;
}

.filename-field {
  width: 30%;
}

.path-field {
  width: 50%;
}

.state-field {
  width: 20%;
}

.state-input {
  width: 60%;
}
</style>