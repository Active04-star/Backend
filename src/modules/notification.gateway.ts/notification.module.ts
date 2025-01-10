import { Module } from "@nestjs/common";
import { notificationGateway } from "./websocket.gateway";


@Module({
    providers: [notificationGateway],
    exports: [notificationGateway]
})

export class notificationModule{}