<template>
  <div class="mylist">
    <button v-on:click="goToPreviousPage">Prev</button>
    <button v-on:click="goToNextPage">Next</button> Items per page <input type="number" min="0" v-model="nbItemsToDisplay"
      v-on:keyup="checkCurrentPageValidity()">
    <table align="center" class="mylist-table">
      <tr class="mylist-line">
        <th></th>
        <th class="filename-field">Filename</th>
        <th class="path-field">Path</th>
        <th class="state-field">State</th>
      </tr>
      <tr v-for="(item, index) in items" v-if="index >= (nbItemsToDisplay * currentListPage) && index < ((nbItemsToDisplay * currentListPage) + nbItemsToDisplay)"
        v-bind:class="[ 'mylist-line', index % 2 == 0 ? 'mylist-line-alt' : '' ]">
        <td class="delete-field"><button v-on:click="deleteItem(item._id)">Delete</button></td>
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
    <button v-on:click="goToPreviousPage">Prev</button>
    <button v-on:click="goToNextPage">Next</button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import request from 'superagent/superagent'
  import config from '../../settings/default.json'

  let data = {
    items: [],
    nbItemsToDisplay: 2,
    currentListPage: 0,
    states: config.states,
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
      },

      deleteItem(id) {
        request.delete(`http://${config.moderatorServer}/api/v1/medias/${id}`)
          .end((err, res) => {
            if (!err) {
              let itemToDelete = this.items.find((item) => { return item._id === id })
              let index = this.items.indexOf(itemToDelete)
              this.items.splice(index, 1)
            }
            return err
          })
      },

      goToPreviousPage() {
        this.currentListPage = this.currentListPage > 0 ? this.currentListPage - 1 : 0
      },

      goToNextPage() {
        this.currentListPage =
          this.currentListPage < ((this.items.length / this.nbItemsToDisplay) - 1) ?
            this.currentListPage + 1 :
            ((this.items.length / this.nbItemsToDisplay) - 1)
      },

      checkCurrentPageValidity() {
        if ((this.currentListPage * this.nbItemsToDisplay) >= this.items.length) {
          console.log('item length ' + this.items.length + '  displat ' + this.nbItemsToDisplay)
          this.currentListPage = Math.max(Math.floor(this.items.length / this.nbItemsToDisplay) - 1, 0)
        }
      }
    }
  }

  getMediaList()
  function getMediaList() {
    request.get(`http://${config.moderatorServer}/api/v1/medias/`)
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

.delete-field {
  width: 10%;
}
.filename-field {
  width: 30%;
}

.path-field {
  width: 40%;
}

.state-field {
  width: 20%;
}

.state-input {
  width: 60%;
}
</style>