<template>
  <div class="mylist">
    <table align="center" class="mylist-table">
      <tr class="mylist-line">
        <th class="filename-field">Filename</th>
        <th class="path-field">Path</th>
        <th class="state-field">State</th>
      </tr>
      <tr class="mylist-line" v-for="item in items">
        <td class="filename-field">{{ item.filename }}</td>
        <td class="path-field">{{ item.path }}</td>
        <td class="state-field">
          <input class="state-input" type="text" v-model="item.state"><button v-on:click="updateState(item._id, item.state)">Ok</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import request from 'superagent/superagent'
  var medias = []

  var data = {
    items: medias
  }

  module.exports = {
    data: function () {
      return data
    },
    methods: {
      updateState: updateState
    }
  }

  request.get('http://localhost:8080/api/v1/medias/all')
    .end(function (err, res) {
      medias = JSON.parse(res.text)
      data.items = medias
    })

  function updateState(id, state) {
    request.put(`http://localhost:8080/api/v1/medias/${id}`)
    .send({ state: state })
    .end(function (err, res) {
      console.log(res)
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
}

.mylist-line {
  border-style: solid;
  border-width: 1px 0px 1px 0px;
}

.filename-field {
  width: 30%;
  border-style: solid;
  border-width: 0px 0px 0px 4px;
}

.path-field {
  width: 50%;
}

.state-field {
  width: 20%;
  border-style: solid;
  border-width: 0px 4px 0px 0px;
}

.state-input {
  width: 60%;
}
</style>