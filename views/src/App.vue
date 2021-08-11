<template>
  <div id="app">
    <h1>Hello Node</h1>
    <button @click="getData">GET DATA</button>
  </div>
</template>

<script>
import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

Vue.use(VueToast);
export default {
  name: "App",
  components: {},
  methods: {
    async getData() {
      const res = await fetch("/", {
        method: "POST",
        body: JSON.stringify({
          date: "2019-06-24,2019-09-01",
          // status: 1,
          teacherIds: "2, 3",
          studentsCount: "5, 4",
          page: 1,
          lessonsPerPage: 5,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      if (data.errors) {
        const { errors } = data.errors;
        errors.forEach((er) => {
          Vue.$toast.open({
            message: er.msg,
            type: "error",
            position: "top-right",
            duration: 7000,
          });
        });
        throw data.message;
      }
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
