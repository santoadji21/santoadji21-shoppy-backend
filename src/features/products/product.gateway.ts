import { AuthService } from '@/features/auth/auth.service';
import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  private readonly server: Server;

  handleProductUpdated() {
    this.server.emit('product-updated');
  }

  handleConnection(client: Socket) {
    try {
      this.authService.verifyToken(
        client.handshake.auth.Authentication.token.value,
      );
    } catch (error) {
      throw new WsException('Invalid token');
    }
  }
}
