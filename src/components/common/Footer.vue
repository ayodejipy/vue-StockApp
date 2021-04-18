<template>
  <div class="footer py-3 mt-5 bg-dark">
      <footer class="d-flex justify-content-center text-white">
          <p class="mb-0">&copy; Copyright - {{ year }}. All Rights Reserved </p>
      </footer>
  </div>
</template>

<script>
export default {
    data() {
        return {
            year: 2021,
        }
    },
    // methods: {
    //     getYear() {
    //         return Date.now.toString();
    //     },
    // }
}
</script>

<style>
.footer {
    position: fixed;
    left: 0;
    right: 0; 
    bottom: 0;
}
</style>