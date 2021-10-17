// modules
const express = require('express');
const app = express();
const cors = require('cors');
const {
  getAllAppConfig,
  getAppConfig,
  getAppConfigValue,
  saveAppConfig,
  deleteAppConfig,
} = require('./services/appConfigService');

// dotenv config
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost/your_db_name';
const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const ETH_ADDRESS = process.env.ETH_ADDRESS;

// middleware
app.use(cors());
app.use(express.json());

// startup
require('./startup/db')(DB_URI);

// main

const initAccount = require('./services/initAccount');

(async () => {
  const { client: clientA, positionId } = await initAccount(
    ETH_ADDRESS,
    ETH_PRIVATE_KEY
  );

  const orderParams = {
    market: 'BTC-USD',
    side: 'BUY',
    type: 'LIMIT',
    timeInForce: 'GTT',
    postOnly: true,
    size: '0.001',
    price: '60000',
    limitFee: '0.0015',
    expiration: '2022-12-21T21:30:20.200Z',
  };

  const orderResponse = await clientA.private.createOrder(
    orderParams,
    positionId
  );

  console.log(orderResponse);
})();

// listen to server
app.listen(PORT, () => {
  console.log(`Server connected. Listening Port ${PORT}...`);
});
``;
