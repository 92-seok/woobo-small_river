import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { NetworkDevice } from './network-device.entity';

@Entity('tbl_locations')
export class Location {
  @PrimaryGeneratedColumn({ name: 'location_id' })
  locationId: number;

  @Column({ name: 'region_province', length: 50, nullable: true })
  regionProvince: string;

  @Column({ name: 'region_city', length: 50, nullable: true })
  regionCity: string;

  @Column({ name: 'stream_name', length: 100, nullable: true })
  streamName: string;

  @Column({ name: 'address_text', length: 255, nullable: true })
  addressText: string;

  @Column({ name: 'latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  longitude: number;

  @Column({ name: 'status_code', length: 20, default: 'Unknown' })
  statusCode: string;

  @Column({ name: 'installation_date', type: 'date', nullable: true })
  installationDate: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'monitoring_status', length: 20, default: 'normal' })
  monitoringStatus: string;

  @Column({ name: 'last_offline_time', type: 'timestamp', nullable: true })
  lastOfflineTime: Date;

  @Column({ name: 'last_check_time', type: 'timestamp', nullable: true })
  lastCheckTime: Date;

  @OneToMany(() => NetworkDevice, (device) => device.location)
  devices: NetworkDevice[];
}