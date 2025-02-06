import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("user_settings")
export class UserSettings {

    @PrimaryColumn("uuid")
    user_id: string;

    @OneToOne(() => User, (user) => user.settings, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column({ default: 60 })
    session_limit: number;

    @Column({ default: true })
    reservation_notification: boolean;

    @Column({ default: true })
    reservation_cancelled: boolean;

    @Column({ default: true })
    reservation_reminder: boolean;

    @Column({ default: false })
    reservation_sync: boolean;

}