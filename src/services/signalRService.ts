import connection from './signalRClient';

export const startConnection = async () => {
  if (connection.state === 'Disconnected') {
    await connection.start();
    console.log('SignalR Connected');
  }
};

export const invokeMethod = async (method: string, ...args: any[]) => {
  try {
    await connection.invoke(method, ...args);
  } catch (error) {
    console.error(`Invoke ${method} failed:`, error);
  }
};

export const onEvent = <T>(eventName: string, callback: (data: T) => void) => {
  connection.on(eventName, callback);
};

export const offEvent = (eventName: string) => {
  connection.off(eventName);
};

export const stopConnection = async () => {
  await connection.stop();
};
