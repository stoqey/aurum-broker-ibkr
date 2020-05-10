/* eslint-disable @typescript-eslint/no-unused-vars */
import { isTest } from "./config";
import ibkr, { AccountSummary, Portfolios, IbkrEvents, IBKREVENTS, HistoryData, AccountHistoryData, PriceUpdates } from '@stoqey/ibkr';
import { Broker, BrokerAccountSummary, Portfolio, SymbolInfo, GetSymbolData } from "@stoqey/aurum-broker-spec";

export class IbkrBroker extends Broker {
    ibkrEvents: IbkrEvents;
    constructor(args?: any) {
        super();

        this.ibkrEvents = IbkrEvents.Instance;
        // init all listeners
        this.init();

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        /**
         * Start IBKR from here
         */
        (async () => {
            // TODO set ibkr env
            const startedApp = await ibkr();
            const onReady = self.events["onReady"];

            // Init modules

            if (onReady && startedApp) {
                onReady(true);

                // If test
                if (isTest) {
                    // fake trade
                    setInterval(() => {
                        const onOrders = self.events["onOrders"];
                        onOrders && onOrders({ done: new Date });
                    }, 1000)
                }

            }
        })();

    }

    /**
 * init
 */
    public init() {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        const ibkrEvents = this.ibkrEvents;


        /**
         * Register all events here
         */
        ibkrEvents.on(IBKREVENTS.ON_PRICE_UPDATES, (data) => {

            const onPriceUpdates = self.events["onPriceUpdate"];

            if (onPriceUpdates) {
                onPriceUpdates(data);
            }

        });


        ibkrEvents.on(IBKREVENTS.ON_MARKET_DATA, (data) => {

            const { symbol, marketData = [] } = data;

            console.log(`Get marketdata ${symbol}`, marketData.length);

            const onMarketData = self.events["onMarketData"];

            if (onMarketData) {
                onMarketData({ symbol, marketData });
            }

        });
    }

    getAllPositions<T>(): Promise<Portfolio & T[]> {
        throw new Error("Method not implemented.");
    }
    enterPosition<T>(portfolio: Portfolio & T): Promise<Portfolio & T> {
        throw new Error("Method not implemented.");
    }
    exitPosition<T>(portfolio: Portfolio & T): Promise<Portfolio & T> {
        throw new Error("Method not implemented.");
    }
    searchSymbol<T>(args: SymbolInfo & T): Promise<SymbolInfo & T[]> {
        throw new Error("Method not implemented.");
    }
    quoteSymbol<T>(args: SymbolInfo & T): Promise<SymbolInfo & T> {
        throw new Error("Method not implemented.");
    }

    public async getAccountSummary(): Promise<BrokerAccountSummary> {

        const accountId = AccountSummary.Instance.accountSummary.AccountId;
        const totalCashValue = AccountSummary.Instance.accountSummary.TotalCashValue;

        return {
            totalCashValue, accountId
        }
    };

    getAllOrders: () => Promise<any>;
    getOpenOrders: () => Promise<any>;

    // public async getAllPositions(): Promise<any[]> {
    //     const portfolioInstance = Portfolios.Instance;
    //     const portfolios = await portfolioInstance.getPortfolios();
    //     return portfolios;
    // }


    public async getMarketData(args: GetSymbolData): Promise<any> {
        const { symbol, startDate, endDate } = args;
        AccountHistoryData.Instance.getHistoricalData(symbol);
        // this.ibkrEvents.emit(IBKREVENTS.GET_MARKET_DATA, { symbol, startDate, endDate });
        // Can use finnhub
        return null;
    }

    // Complete
    public async getPriceUpdate(args: GetSymbolData): Promise<any> {
        const { symbol, startDate, endDate } = args;
        this.ibkrEvents.emit(IBKREVENTS.SUBSCRIBE_PRICE_UPDATES, [symbol]);
        return null;
    };

}

export default IbkrBroker;