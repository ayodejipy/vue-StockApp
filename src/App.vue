/* jeggsatony@gmail.com */
<template>
    <div id="app">
      <div class="wrapper container">
        <Header></Header>
        <transition name="slide" mode="out-in">
          <router-view />
        </transition>
        <div class="push"></div>
        <Footer></Footer>
      </div>
    </div>
</template>

<script>
import allHeader from "./components/common/Header";
import allFooter from "./components/common/Footer";

export default {
  components: {
    Header: allHeader,
    Footer: allFooter,
  },
  created() {
    // init our stocks when the component is loaded
    this.$store.dispatch('createStocks')

    this.$store.dispatch('auth/autoLogin', { root: true })
  }
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}
.wrapper {
  min-height: 100%;

  /* Equal to height of footer  */
  /* But also accounting for potential margin-bottom of last child */
  margin-bottom: -50px;
}
.footer,
.push {
  height: 50px;
}

.slide-enter-active {
  animation: slide-in 500ms ease-out forwards;
}
.slide-leave-active {
  animation: slide-out 500ms ease-out forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-60px);
    opacity: 0;
  }
}
</style>