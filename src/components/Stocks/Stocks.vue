<template>
    <div class="row">
        <single-stock v-for="(stock, key) in stocks" :key="key" :stock="stock"></single-stock>
    </div>
</template>

<script>
import Stock from "../Stocks/SingleStock";

export default {
    components: {
        SingleStock: Stock,
    },
    computed: {
        stocks() {
            return this.$store.getters.getStocks;
        }
    }
}
</script>