import connection from './signalRClient';

export const startConnection = async () => {
  if (connection.state === 'Disconnected') {
    await connection.start();
  }
};

export const invokeMethod = async (method: string, ...args: any[]) => {
  try {
    await connection.invoke(method, ...args);
  } catch (error) {
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
