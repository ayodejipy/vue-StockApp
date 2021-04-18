<template>
    <div class="col-sm-6 col-md-4 my-3">
        <div class="card">
            <div class="card-body">
                <div class="text-left">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title stock-name"> {{ portfolio.name }} </h5>
                        <h4 class="stock-price"> {{ portfolio.price | formatCurrency  }} </h4>
                    </div>
                    <h5> {{ portfolio.quantity }} Units </h5>
                </div>
                <div class="d-flex flex-column justify-content-between">
                    <input type="number" class="form-control" 
                    v-model="quantity">

                    <div class="d-flex justify-content-between my-3">
                        <button class="text-uppercase btn btn-md btn-primary px-4"
                        @click="sellStock"
                        :disabled="insufficientUnits || quantity <= 0 ">
                        {{ insufficientUnits ? 'Insufficient Unit' : 'Sell' }} </button>
                        <!-- <h5>Funds:  <span class="text-lead font-weight-bold">{{ totalFunds | formatCurrency }}</span></h5> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from 'vuex';

export default {
    // Getting props sent from the Stocks component
    props: ['portfolio'],
    data() {
        return {
            quantity: 0,
        }
    },
    computed: {
        totalFunds() {
            return this.$store.getters.getFunds;
        },
        insufficientUnits() {
            return this.quantity > this.portfolio.quantity;
        },
    },
    methods: {
        sellStock() {
            const order = {
                stockId: this.portfolio.id,
                stockPrice: this.portfolio.price,
                stockQuantity: this.quantity
            }
            this.$store.dispatch('sellStocks', order);
            this.quantity = 0;
        },
    }
}
</script>

<style scoped>
.card {
    border: none;
    background: rgb(204, 220, 255, 0.58);
}

input.form-control {
    border: none;
}

.stock-name {
    font-weight: 300;
    font-size: 1.64rem;
}

.stock-price {
    font-size: 30px;
    font-weight: 700;
}
.stock-price::first-letter {
    font-size: 22px;
}

button:disabled {
    background: #dadada;
    border: 1px solid #dadada;
    color: #333;
    cursor: not-allowed;
}
</style>
