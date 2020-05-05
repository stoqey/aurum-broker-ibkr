import 'mocha';
import { IbkrBroker } from '.';

const ibkrBroker = new IbkrBroker();

before((done) => {
    ibkrBroker.when('onReady', async () => {
        console.log('on IBKR ready');
        done();
    });
});

describe('IBKR broker', () => {

    it(`Price updates`, (done) => {

        ibkrBroker.when("onPriceUpdate", async (data: any) => {
            console.log('on price updates data is', data);
            done();
        });

        ibkrBroker.getPriceUpdate("AAPL");
    })

})