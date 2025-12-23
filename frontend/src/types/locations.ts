export interface NetworkDevice {
  deviceId: number;
  deviceType: string | null;
  vendor: string | null;
  statusPing: string | null;
}

export interface Location {
  locationId: number;
  regionProvince: string | null;
  regionCity: string | null;
  streamName: string | null;
  addressText: string | null;
  latitude: number;
  longitude: number;
  statusCode: string;
  monitoringStatus: string;
  devices: NetworkDevice[];
}
