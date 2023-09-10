import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 50,
  })
  name: string;

  @Column('varchar', {
    length: 320,
    unique: true,
  })
  email: string;

  @Column('varchar', {
    length: 60,
  })
  password: string;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  token?: string;

  @Column('tinyint', {
    width: 1,
    default: 0,
  })
  confirm: boolean;

  @Column('timestamp', {
    name: 'token_expiration',
    nullable: true,
  })
  tokenExpiration?: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  @BeforeInsert()
  tokenExpirationDate() {
    this.tokenExpiration = new Date();
  }
}
