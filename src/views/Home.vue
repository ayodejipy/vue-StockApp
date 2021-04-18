<template>
  <div>
    <div v-if="!checkifAuth" class="col-6 mx-auto text-center">
      <h5 class="mb-3">Hi There, kindly Login or Register to purchase stocks...</h5>
      <router-link to="/signin" class="btn btn-outline-primary mx-2" tag="button" active-class="active">
          Login
      </router-link>
      <router-link to="/signup" class="btn btn-info mx-2" tag="button" active-class="active">
          Register
      </router-link>
    </div>
    <!-- <h3>Hello, {{ user.name }} </h3> -->
    <div v-else>
      <h1>Trade or View your Portfolio</h1>
      <p><b>You may Save or Load your Data</b></p>
      <p><b>Hello {{ getUserInfo }} - Click on "End day" to begin a New Day</b></p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Stocks from "@/components/Stocks/Stocks";

export default {
  name: "Home",
  data() {
    return {
      user: {
        name: 'Guest',
        email: '',
      }
    }
  },
  computed: {
    getUserInfo() {
      if( !Object.entries(this.user).length === 0 ) {
        return this.user
      } else {
        return this.user.name
      }
    },
    checkifAuth() {
      let check = this.$store.getters['auth/isAuthenticated'];
      console.log("isAuth? ", check);
      return check;
    }
  },
  methods: {
    getUser() {
      const userId = localStorage.getItem('user-id');
      const token = localStorage.getItem('token');

      let userInfo = this.$axios.get('users/' + userId + '.json' + '?auth=' + token)
        .then( response => {
        let data = response.data
        console.log(data)
          this.user.name = data.name,
          this.user.email = data.email
      })

      return userInfo
    }
  },
  created() {
    this.getUser()
  }
};
</script>
