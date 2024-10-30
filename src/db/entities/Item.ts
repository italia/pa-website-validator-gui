import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Status } from '../../types/types';



@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable:true})
  url!: string;

  @Column({ enum: Status, default: Status.PENDING , nullable:true})
  status?: Status;

  @CreateDateColumn()
  date!: Date;

  @Column({ type: 'integer' , nullable:true})
  executionTime?: number;

  @Column({ type: 'simple-array' , nullable:true})
  auditsExecuted?: string[];

  @Column({ type: 'json' , nullable:true} )
  args?: Record<string, unknown>;
}
