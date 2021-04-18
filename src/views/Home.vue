<template>
  <div>
    <!-- <h3>Hello, {{ user.name }} </h3> -->
    <h1>Trade or View your Portfolio</h1>
    <p><b>You may Save or Load your Data</b></p>
    <p><b>Hello {{ getUserInfo }} - Click on "End day" to begin a New Day</b></p>

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
