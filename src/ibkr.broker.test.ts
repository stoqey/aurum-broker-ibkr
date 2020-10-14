import "mocha";
import { IbkrBroker } from ".";

// before((done) => {
//   ibkrBroker.when("onReady", async () => {
//     console.log("on IBKR ready");
//     done();
//   });
//   ibkrBroker.init();
// });

describe("IBKR broker", () => {
  const ibkrBroker = new IbkrBroker();

  it(`Price updates`, () => {
    ibkrBroker.when("onReady", async () => {
      console.log("on IBKR ready");
      ibkrBroker.getPriceUpdate({
        symbol: "AAPL",
        contract: "AAPL",
        startDate: null,
      });
    });

    ibkrBroker.when("onPriceUpdate", async (data: any) => {
      console.log("on price updates data is", data);
      //   done();
    });

    ibkrBroker.init();
  });

  //   it(`MarketData`, (done) => {
  //     const startDate = new Date("2020-03-10 09:30:00");
  //     const endDate = new Date("2020-03-13 09:30:00");

  //     ibkrBroker.when("onReady", async () => {
  //       console.log("on IBKR ready");
  //       ibkrBroker.getMarketData({ symbol: "AAPL", startDate, endDate });
  //     });

  //     ibkrBroker.when("onMarketData", async ({ marketData }) => {
  //       console.log("got market data", marketData && marketData.length);
  //       done();
  //     });

  //     ibkrBroker.init();
  //   });
});
