import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export interface Ticker {
    symbol: string;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    ts: number;
}
export declare class MarketGateway implements OnGatewayConnection {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    onSubscribe(symbols: string[], client: Socket): {
        ok: boolean;
        subscribed: string[];
    };
    onUnsubscribe(symbols: string[], client: Socket): {
        ok: boolean;
    };
    emitTicker(ticker: Ticker): void;
    emitSnapshot(tickers: Ticker[]): void;
}
