/* eslint-disable @typescript-eslint/no-unused-vars */
import { isTest } from "./config";
import ibkr, { AccountSummary, Portfolios, IbkrEvents, IBKREVENTS, HistoryData, AccountHistoryData, PriceUpdates, OrderTrade, OrderStock, OrderWithContract, CreateSale, PortFolioUpdate, OpenOrders } from '@stoqey/ibkr';
import { Broker, BrokerAccountSummary, Portfolio, SymbolInfo, GetSymbolData } from "@stoqey/aurum-broker-spec";

export class IbkrBroker extends Broker {

    ibkrEvents: IbkrEvents;

    constructor(args?: any) {
        super();
        this.ibkrEvents = IbkrEvents.Instance;
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

            console.log(`IBKREVENTS.ON_MARKET_DATA ${symbol}`, marketData.length);

            const onMarketData = self.events["onMarketData"];

            if (onMarketData) {
                onMarketData({ symbol, marketData });
            }

        });

        ibkrEvents.on(IBKREVENTS.OPEN_ORDERS, (orders: OrderWithContract[]) => {

            console.log(`IBKREVENTS.OPEN_ORDERS`, orders.length);

            const onOrders = self.events["onOrders"];

            if (onOrders) {
                onOrders(orders);
            }

        });

        ibkrEvents.on(IBKREVENTS.ORDER_FILLED, (data: { order: OrderWithContract, sale: CreateSale }) => {

            const { order, sale } = data;
            console.log(`IBKREVENTS.ORDER_FILLED`, order.symbol);

            const onOrders = self.events["onOrders"];

            if (onOrders) {
                onOrders([order]);
            }

        });

        ibkrEvents.on(IBKREVENTS.PORTFOLIOS, (portfolios: PortFolioUpdate[]) => {

            const onPortfolios = self.events["onPortfolios"];

            if (onPortfolios) {
                onPortfolios(portfolios);
            }

        });



        /**
         * Start IBKR from here
         */
        (async () => {
            // TODO set ibkr env
            const onReady = self.events["onReady"];

            try {
                const startedApp = await ibkr();
                // Init modules
                if (onReady) {

                    if (startedApp) {

                        // If test
                        if (isTest) {
                            // fake trade
                            setInterval(() => {
                                const onOrders = self.events["onOrders"];
                                onOrders && onOrders({ done: new Date });
                            }, 1000)
                        }
                        return onReady(true);
                    }
                    else {
                        return onReady(false);
                    }
                }

            }
            catch (error) {
                console.log('error starting broker ibkr', error)
                onReady && onReady(false);
                process.exit(1);
            }

        })();

    }

    public async getAccountSummary(): Promise<BrokerAccountSummary> {

        const accountId = AccountSummary.Instance.accountSummary.AccountId;
        const totalCashValue = AccountSummary.Instance.accountSummary.TotalCashValue;

        return {
            totalCashValue, accountId
        }
    };

    async getOpenOrders(): Promise<any> {
        const orders = OpenOrders.Instance;
        return await orders.getOpenOrders();
    }


    async getAllPositions<T>(): Promise<any & T[]> {
        const port = Portfolios.Instance;
        return await port.getPortfolios();
    }

    async enterPosition<T>(order: OrderStock & T): Promise<any> {
        const trade = OrderTrade.Instance;
        return await trade.placeOrder(order);
    }

    async exitPosition<T>(order: OrderStock & T): Promise<any> {
        const trade = OrderTrade.Instance;
        return await trade.placeOrder(order);
    }

    searchSymbol<T>(args: SymbolInfo & T): Promise<SymbolInfo & T[]> {
        throw new Error("Method not implemented.");
    }
    quoteSymbol<T>(args: SymbolInfo & T): Promise<SymbolInfo & T> {
        throw new Error("Method not implemented.");
    }


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
        PriceUpdates.Instance;
        this.ibkrEvents.emit(IBKREVENTS.SUBSCRIBE_PRICE_UPDATES, { symbol });
        return null;
    };

}

export default IbkrBroker;