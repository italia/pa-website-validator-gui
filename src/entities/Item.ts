import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Status } from "../types/types.js";

@Entity()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  type!: string;

  @Column({ type: "varchar", nullable: true })
  accuracy!: string;

  @Column({ type: "varchar", nullable: true })
  scope!: string;

  @Column({ type: "integer", nullable: true })
  timeout!: number;

  @Column({ type: "varchar", nullable: true })
  url!: string;

  @Column({ type: "integer", nullable: true })
  concurrentPages!: number;

  @Column({ enum: Status, default: Status.PENDING, nullable: true })
  status?: Status;

  @CreateDateColumn()
  date!: Date;

  @Column({ type: "integer", nullable: true })
  executionTime?: number;

  @Column({ type: "simple-array", nullable: true })
  auditsExecuted?: string[];

  @Column({ type: "simple-array", nullable: true })
  failedAudits?: string[];

  @Column({ type: "integer", nullable: true })
  failedCount?: number;

  @Column({ type: "integer", nullable: true })
  successCount?: number;

  @Column({ type: "integer", nullable: true })
  errorCount?: number;

  @Column({ type: "json", nullable: true })
  args?: Record<string, unknown>;
}
