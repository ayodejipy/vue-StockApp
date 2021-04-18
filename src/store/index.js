/* eslint-disable prettier/prettier */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Stocks from "../data/data";
import auth from "./modules/auth";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    // Stock
    stocks: [],
    
    // Portfolio
    funds: 8000,
    portfolioStocks: [],
  },

  getters: {
    // Getters take a 'state' argument
    getFunds: state => {
      return state.funds;
    },
    getStocks: state => {
      return state.stocks;
    },
    getPortfolioStocks: (state, getters) => {
      /**
       *  To get our portfolio's stock, we have to map the current stock in our portfolio 
       *  and return the necessary data (name, price...etc) BUT there's a set back
       *  we only passed the 'stockId' when we buy our stocks. So, we have to connect with our 'getStocks' getters 
       *  then pull our data from there.  
       * **/
      // console.log(getters.getStocks)
      return state.portfolioStocks.map( stock => {
        const record = getters.getStocks.find( element => element.id == stock.id);
        return {
          id: stock.id,
          quantity: stock.quantity,
          name: record.name,
          price: record.price,
        }
      })
    },
  },

  mutations: {
    /* Stocks Mutation:
    * 1. We need to set our stocks, retrieve it from either a data source or a server
    * 2. When we 'End Day', we need to randomize the stock's price.
    **/
    'SET_STOCKS': (state, stocks) => {
      state.stocks = stocks;
    },
    'SET_PORTFOLIOS': (state, portfolios) => {
      state.funds = portfolios.funds;
      state.portfolioStocks = portfolios.portfolioStock ? portfolios.portfolioStock : [];
    },
    'RND_STOCKS' (state) {
      /**
       *  Immitate stock's price change like in real market after we click on 
       * 'End Day'.  
       */
      state.stocks.forEach( stock => {
        stock.price = Math.round(stock.price * ( 1 + Math.random() - 0.3));
      });
    },
    // Portfolio's Mutations
    /**
     * @param {Obj}
     * {stockId...} 
     * is 'cos we're expecting an ORDER obj when we buy a stock
     * this will be useful in our 'action'
     * */ 
    'BUY_STOCK'( state, { stockId, stockPrice, stockQuantity }) {
      // First check the if the user 
      const userId = auth.state.userId;
      // checks our portfolioStocks if we have an existing stock with the one we want to buy 
      const record = state.portfolioStocks.find( existingStock => existingStock.id == stockId);
      // if true, update the existing stock, else create a new stock
      if(record) {
        record.quantity += stockQuantity;
      } else {
        state.portfolioStocks.push({
          userId: userId,
          id: stockId,
          quantity: stockQuantity
        });
      }
      // console.log("BUY_STOCK " + stockPrice * stockQuantity)
      state.funds -= stockQuantity * stockPrice;
    },
    'SELL_STOCK' ( state, { stockId, stockPrice, stockQuantity }) {
      // checks our portfolioStocks if we have an existing stock with the one we want to buy 
      const record = state.portfolioStocks.find( existingStock => existingStock.id == stockId);

      if(record && record.quantity > stockQuantity) {
        // If true, we want to remove the Quantity we're buying from the original quantity
        record.quantity -= stockQuantity;
      } else {
        // Remove just that stock since it's sold out. 
        state.portfolioStocks.splice(state.portfolioStocks.indexOf(record), 1);
      }
      // console.log("SELL_STOCK "  + stockPrice * stockQuantity)
      state.funds += stockQuantity * stockPrice;
    }
  },

  actions: {
    /**
     * ACTIONS 
     * 'buyStock' action requires a PAYLOAD (order) to fulfil but needs it's mutation from PORTFOLIO
     * 'createStocks': First preloaded stocks on our stocks page
     */
    createStocks: ({ commit }) => {
      commit('SET_STOCKS', Stocks);
    },
    buyStocks: ({ commit }, order) => {
      commit('BUY_STOCK', order); // commits a mutation that relates to PORTFOLIO because that's where we buy
    },
    sellStocks: ({commit}, order) => {
      commit('SELL_STOCK', order);
    },
    randomizeStocks: ({ commit }) => {
      commit('RND_STOCKS');
    },
    loadData: ({ commit }) => {
      // Get user ID and token for authentication
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user-id');
      // Configure api url to get user's portfolio whose id is the node key 
      axios.get('portfolios/' + userId + '.json' + '?auth='+ token)
        .then( response => {
          const data = response.data; 
          // if (userId in data) {
          //   console.log("Data from store: ", data)
          // } else {
          //   console.log("Data from store: ")
          // }
          
          try {
            if(data) {
              console.log(data)
              // Retrieve necessary data from our data object
              const funds = data.funds;
              const portfolioStock = data.portfolioStocks;
              const stocks = data.stocks;
              
              // Create our portfolio's object that our mutation will recieve
              const portfolio = {
                funds,
                portfolioStock
              };
              commit('SET_STOCKS', stocks);
              commit('SET_PORTFOLIOS', portfolio);
            }
          } catch (error) {
            console.log(error);
          }
          
          
        })
    },
  },
  modules: {
    auth,
  },
});
