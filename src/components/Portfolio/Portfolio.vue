<template>
    <div>
        <!-- <div class="row" v-if="isEmpty">
            <div class="col-md-12 text-center my-3">
                <h3>Oops! You've got no stocks yet...</h3>
            </div>
        </div> -->
        <div class="row">
            <single-portfolio v-for="stock in portfolios" :key="stock.id" :portfolio="stock"></single-portfolio>
        </div>
    </div>
</template>

<script>
import StockInPortfolio from "./StockInPortfolio";
// import { mapActions } from "vuex";

export default {
    // Registering component
    components: {
        SinglePortfolio: StockInPortfolio,
    },
    computed: {
        // Getting our portfolio stocks and using it in our component
        portfolios() {
            return this.$store.getters.getPortfolioStocks;
        },
    },
    methods: {
        isEmpty() {
            return Object.keys(this.portfolio).length === 0;
        },
    }
}
</script>
