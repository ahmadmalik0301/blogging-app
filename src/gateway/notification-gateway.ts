import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(3001, { cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers['authorization'];

    if (!authHeader) {
      console.log('No Authorization header, disconnecting...');
      client.disconnect(true);
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const secret = this.config.get<string>('JWT_SECRET')!;
      const payload: any = await this.jwt.verifyAsync(token, { secret });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user || user.role !== 'ADMIN') {
        console.log('Unauthorized, disconnecting...');
        client.disconnect(true);
        return;
      }

      console.log(`Admin connected: ${user.email}`);
      client.data.user = user;
    } catch (err) {
      console.log('Token verification failed:', err.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      console.log(`Admin disconnected: ${user.email}`);
    } else {
      console.log(`A client disconnected (unauthenticated)`);
    }
  }

  sendUserSignupNotification(name: string, email: string) {
    this.server.emit('new-user-signup', {
      message: `New user signed up: ${name} (${email})`,
    });
  }
}
