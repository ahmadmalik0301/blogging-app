import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token?: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    
    this.socket = io(socketUrl, {
      auth: {
        token: token || localStorage.getItem('accessToken'),
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Listen for user signup notifications (for admin)
  onUserSignup(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userSignup', callback);
    }
  }

  offUserSignup(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('userSignup', callback);
      } else {
        this.socket.off('userSignup');
      }
    }
  }

  // Listen for new post notifications
  onNewPost(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('newPost', callback);
    }
  }

  offNewPost(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('newPost', callback);
      } else {
        this.socket.off('newPost');
      }
    }
  }

  // Listen for post updates
  onPostUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('postUpdated', callback);
    }
  }

  offPostUpdated(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('postUpdated', callback);
      } else {
        this.socket.off('postUpdated');
      }
    }
  }

  // Listen for post deletions
  onPostDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('postDeleted', callback);
    }
  }

  offPostDeleted(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('postDeleted', callback);
      } else {
        this.socket.off('postDeleted');
      }
    }
  }

  // Send events (if needed)
  emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;