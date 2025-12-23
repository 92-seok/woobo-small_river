import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity('tbl_network_devices')
export class NetworkDevice {
  @PrimaryGeneratedColumn({ name: 'device_id' })
  deviceId: number;

  @Column({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'public_ip', length: 45, nullable: true })
  publicIp: string;

  @Column({ name: 'gateway_ip', length: 45, nullable: true })
  gatewayIp: string;

  @Column({ name: 'vpn_gateway', length: 45, nullable: true })
  vpnGateway: string;

  @Column({ name: 'device_type', length: 50, nullable: true })
  deviceType: string;

  @Column({ name: 'vendor', length: 50, nullable: true })
  vendor: string;

  @Column({ name: 'status_ping', length: 50, nullable: true })
  statusPing: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Location, (location) => location.devices)
  @JoinColumn({ name: 'location_id' })
  location: Location;
}