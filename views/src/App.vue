<template>
  <div id="app">
    <h1>Hello Node</h1>
    <button @click="getData">GET DATA</button>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {
    async getData() {
      const res = await fetch("/", {
        method: "POST",
        body: JSON.stringify({
          date: "2001-08-15, 2016-02-05",
          status: 1,
          teacherIds: "2,3, 4",
          studentsCount: "3,      23",
          page: "2",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
