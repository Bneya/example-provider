require('dotenv').config();
const { Verifier } = require('@pact-foundation/pact');
const {
  baseOpts,
  setupServer,
  stateHandlers,
  requestFilter
} = require('./pact.setup');

describe('Pact Verification', () => {
  let server;
  beforeAll(() => {
    server = setupServer();
  });
  afterAll(() => {
    if (server) {
      server.close();
    }
  });
  it('validates the expectations of any consumers, by specified consumerVersionSelectors', () => {
    // if (process.env.PACT_URL) {
    //   console.log('pact url specified, so this test should not run');
    //   return;
    // }
    console.log({
      PACT_BROKER_BASE_URL: process.env.PACT_BROKER_BASE_URL
    })
    // For 'normal' provider builds, fetch the the latest version from the main branch of each consumer, as specified by
    // the consumer's mainBranch property and all the currently deployed and currently released and supported versions of each consumer.
    // https://docs.pact.io/pact_broker/advanced_topics/consumer_version_selectors

    // Intento antiguo
    // const fetchPactsDynamicallyOpts = {
    //   provider: 'pactflow-example-provider',
    //   // consumerVersionSelectors: [
    //   //   // { mainBranch: true },
    //   //   // { deployed: true },
    //   //   // { matchingBranch: true }
    //   //   process.env.CONSUMER_TARGET_BRANCH
    //   //     ? { branch: process.env.CONSUMER_TARGET_BRANCH }
    //   //     : { environment: process.env.ENVIRONMENT, deployed: true }
    //   // ],
    //   // pactUrls: [process.env.PACT_URL],
    //   pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    //   // https://docs.pact.io/pact_broker/advanced_topics/pending_pacts
    //   enablePending: true,
    //   // https://docs.pact.io/pact_broker/advanced_topics/wip_pacts
    //   includeWipPactsSince: '2024-04-01'
    // };

    // if (process.env.PACT_URL) {
    //   fetchPactsDynamicallyOpts['pactUrls'] = [process.env.PACT_URL]
    // } else {
    //   fetchPactsDynamicallyOpts['consumerVersionSelectors'] = [
    //     process.env.CONSUMER_TARGET_BRANCH
    //       ? { branch: process.env.CONSUMER_TARGET_BRANCH }
    //       : { environment: process.env.ENVIRONMENT, deployed: true }
    //   ]
    // }

    // Intento 2024-04-19
    const fetchPactsDynamicallyOpts = {
      // branch: process.env.CONSUMER_TARGET_BRANCH
      branch: 'master',  // hardcodeado para probar
      enablePending: true,
      includeWipPactsSince: '2024-04-01',
      provider: 'pactflow-example-provider',
    }

    const opts = {
      ...baseOpts,
      ...fetchPactsDynamicallyOpts,
      stateHandlers: stateHandlers,
      requestFilter: requestFilter
    };
    return new Verifier(opts).verifyProvider().then((output) => {
      console.log('Pact Verification Complete!');
    });
  });
});
