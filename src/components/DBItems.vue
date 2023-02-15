<template>
  <div>
    <h2>DB Items</h2>

    <!-- Mutation examples -->
    <button @click="db.items.add({ name: `Another item` })">Add item</button>
    <button @click="db.items.clear()">Clear items</button>

    <!-- Render the result of the query -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.id }}, {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { liveQuery } from "dexie";
import { db } from "../js/db";
import { useObservable } from "@vueuse/rxjs";

export default {
  name: "DBItems",
  setup() {
    return {
      db,
      items: useObservable(
        liveQuery(() => db.items.where("name").startsWith("A").toArray())
      ),
    };
  },
};
</script>
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0 10px;
}
p.error {
  color: red;
  font-weight: bold;
}
</style>
