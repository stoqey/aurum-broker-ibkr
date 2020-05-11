import 'mocha';
import { IbkrBroker } from '.';

const ibkrBroker = new IbkrBroker();

before((done) => {
    ibkrBroker.when('onReady', async () => {
        console.log('on IBKR ready');
        done();
    });
    ibkrBroker.init();
});

describe('IBKR broker', () => {

    it(`Price updates`, (done) => {

        ibkrBroker.when("onPriceUpdate", async (data: any) => {
            console.log('on price updates data is', data);
            done();
        });

        ibkrBroker.getPriceUpdate({ symbol: "TESTSYMBOL", startDate: null });
    })

    it(`MarketData`, (done) => {

        const startDate = new Date("2020-03-10 09:30:00");
        const endDate = new Date("2020-03-13 09:30:00");

        ibkrBroker.when("onMarketData", async ({ marketData }) => {
            console.log('got market data', marketData && marketData.length);
            done();
        });

        ibkrBroker.getMarketData({ symbol: "AAPL", startDate, endDate });
    })

})