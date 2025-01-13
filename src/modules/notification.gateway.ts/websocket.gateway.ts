import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";



@WebSocketGateway()
export class notificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    private clients = new Map<string, string>()

    private clientes = []

    handleConnection(client: Socket) {
        console.log(`testeando clientes conectados: ${client.id}`) //console log para testear
        this.clientes.push(client)
    }

    handleDisconnect(client: Socket) {
        console.log(`(test) clientes desconectados: ${client.id}`); //console log para testear
        this.clientes = this.clientes.filter(cli => cli.id !== client.id)
    }

    @SubscribeMessage('identify')
    handleIdentify(client: Socket, payload: {userId: string}) {
        this.clients.set(payload.userId, client.id)
    }

    sendNotification(userId: string, message: string){
        const clientId = this.clients.get(userId)
        if(clientId) {
            this.server.to(userId).emit('notification', message)
        }else {
            console.log(`usuario ${userId} no encontrado`) //console log para testear
        }
    }

}