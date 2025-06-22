import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_CODE_SIGNALR_URL, {
    withCredentials: true,
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export default connection;
