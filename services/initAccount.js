// dotenv
require('dotenv').config();
const ETH_PROVIDER = process.env.ETH_PROVIDER;
const HTTP_HOST = process.env.HTTP_HOST;
const WS_HOST = process.env.WS_HOST;

// load dydx modules
const { DydxClient } = require('@dydxprotocol/v3-client');
const Web3 = require('web3');
const web3 = new Web3(ETH_PROVIDER);

// init dydx account by passing eth address+key, set both stark+api key
async function initAccount(ETH_ADDRESS, ETH_KEY) {
  web3.eth.accounts.wallet.add(ETH_KEY);

  let client = new DydxClient(HTTP_HOST, { web3 });

  const keyPairWithYCoordinate = await client.onboarding.deriveStarkKey(
    ETH_ADDRESS
  );
  const apiCredentials = await client.onboarding.recoverDefaultApiCredentials(
    ETH_ADDRESS
  );

  client.starkPrivateKey = keyPairWithYCoordinate;
  client.apiKeyCredentials = apiCredentials;

  const accountResponse = await client.private.getAccount(ETH_ADDRESS);
  const positionId = accountResponse.account.positionId;

  return { client, positionId };
}

module.exports = initAccount;
