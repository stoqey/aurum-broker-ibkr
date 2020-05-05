/* eslint-disable @typescript-eslint/no-unused-vars */
import { isTest } from "./config";
import ibkr, { IBKREVENTS, IbkrEvents } from '@stoqey/ibkr';
import { Broker, BrokerMethods } from "@stoqey/aurum-broker-spec";

export class IbkrBroker extends Broker implements BrokerMethods {
    // events = {} as any;

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
            if (onReady && startedApp) {
                onReady({});

                // If test
                if (isTest) {
                    // fake trade
                    setInterval(() => {
                        const onTrade = self.events["onOrder"];
                        onTrade && onTrade({ done: new Date });
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
    }
    getAccountSummary: () => Promise<any>;
    getAllOrders: () => Promise<any>;
    getOpenOrders: () => Promise<any>;

    public async getAllPositions(): Promise<any> {
        return {}
    }

    public async enterPosition(portfolio: any[]): Promise<any> {
        // use finnhub
        return null;
    }

    public async exitPosition(portfolio: any[]): Promise<any> {
        // use finnhub
        return null;
    }

    public async searchSymbol(symbol: string, symbolType: string): Promise<any> {
        // use finnhub
        return null;

    }
    public async quoteSymbol(symbol: string, symbolType: string): Promise<any> {
        // use finnhub
        return null;
    }

    public async getMarketData(symbol: string, symbolType: string): Promise<any> {
        // Can use finnhub
        return null;
    }

    // Complete
    public async getPriceUpdate(symbol: string, symbolType?: string): Promise<any> {
        this.ibkrEvents.emit(IBKREVENTS.SUBSCRIBE_PRICE_UPDATES, [symbol]);
        return symbol;
    };

}

export default IbkrBroker;