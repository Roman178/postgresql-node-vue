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
        body: JSON.stringify({ date: "dasdasd" }),
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
