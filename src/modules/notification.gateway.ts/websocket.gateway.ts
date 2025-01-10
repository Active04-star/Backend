import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";



@WebSocketGateway()
export class notificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    private clientes = []

    handleConnection(client: Socket) {
        console.log(`testeando clientes conectados: ${client.id}`)
        this.clientes.push(client)
    }

    handleDisconnect(client: Socket) {
        console.log(`(test) clientes desconectados: ${client.id}`);
        this.clientes = this.clientes.filter(cli => cli.id !== client.id)
    }

    sendNotification(userId: string, message: string){
        this.server.to(userId).emit('notification', message)
    }
}