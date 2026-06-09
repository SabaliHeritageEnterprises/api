import { OrderSide, OrderType } from '@prisma/client';
export declare class PlaceOrderDto {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price?: number;
    stopPrice?: number;
    takeProfit?: number;
    stopLoss?: number;
}
