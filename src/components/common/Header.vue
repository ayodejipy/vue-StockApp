<template>
    <div class="py-4">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <router-link to="/" class="navbar-brand"> Stock Trader </router-link>

                <div class="collapse navbar-collapse">
                    <ul v-if="checkifAuth" class="navbar-nav mr-auto">
                        <router-link to="/stocks" class="nav-item" tag="li" active-class="active">
                            <a class="nav-link">Stocks</a>
                        </router-link>
                        <router-link to="/portfolio" class="nav-item" tag="li" active-class="active">
                            <a class="nav-link">Portfolio</a>
                        </router-link>
                        <li class="nav-item">
                            <a  href="" class="nav-link" @click="logout">Logout</a>
                        </li>
                    </ul>
                    <ul v-else class="navbar-nav mr-auto">
                        <router-link to="/signin" class="nav-item" tag="li" active-class="active">
                            <a class="nav-link">Login</a>
                        </router-link>
                        <router-link to="/signup" class="nav-item" tag="li" active-class="active">
                            <a class="nav-link">Register</a>
                        </router-link>
                    </ul>
                    {{ checkifAuth }}
                    
                </div>
                <div>
                    <ul v-if="checkifAuth" class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click="endDay">End Day</a>
                        </li>
                        <li class="nav-item dropdown ">
                            <a class="nav-link dropdown-toggle"
                                :class="{show: idDropdownOpen}"
                                @click="isDropdownOpen = !isDropdownOpen"
                                href="#" id="navbarDropdown" role="button" data-toggle="dropdown" 
                                aria-haspopup="true" aria-expanded="true">
                                Load & Save
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#" @click="saveData">Save Data</a>
                                <a class="dropdown-item" href="#" @click="loadData">Load Data</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <p class="text-lead funds">Funds: <b>{{ fundsBal | formatCurrency }}</b></p>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            idDropdownOpen: false,
        };
    },
    computed: {
        ...mapGetters({
            userId: 'auth/getUserID',
        }),
        fundsBal() {
            return this.$store.getters.getFunds;
        },
        checkifAuth() {
            let check = this.$store.getters['auth/isAuthenticated'];
            console.log(check);
            return check;
        }
    },
    methods: {
        ...mapActions([
            'randomizeStocks'
        ]),
        endDay() {
            return this.randomizeStocks();
        },
        saveData() {
            /**
             *  We could add this in our mutation and action but that's not
             * necessary since we're not changing the state.
             * 
             * 1. We need to get the data we'd be saving to our DB
             */
            const data = {
                funds: this.$store.getters.getFunds,
                portfolioStocks: this.$store.getters.getPortfolioStocks,
                stocks: this.$store.getters.getStocks,                
            }
            const token = localStorage.getItem('token');
            return this.$axios.put('/portfolios/' + this.userId + '.json' + '?auth='+ token, data);
            
            
            // let submit = this.$axios.put('data.json', data);
            // console.log(submit)
        },
        loadData() {
            // Executes a load data action in our store
            // console.log(this.$axios); 
            return this.$store.dispatch('loadData');
        },
        logout() {
            this.$store.dispatch['auth/signout'];
            localStorage.removeItem('email')
            localStorage.removeItem('token')
            localStorage.removeItem('user-id')
            return
        }
    },
    // beforeDestroy() {
    //     const token = localStorage.getItem('token');
    //     if(token) {
    //         localStorage.removeItem('token')
    //         localStorage.removeItem('user-id')
    //         localStorage.removeItem('email')
    //     }
    // }
};
</script>

<style>
.funds {
    padding: .5rem 1rem;
    margin-bottom: 0;
}
</style>
