import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Index("Admin_pk", ["idAdm"], { unique: true })
@Entity("Admin", { schema: "public" })
export class Admin {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("character varying", { name: "nom", length: 100 })
    nom: string;

    @Column("character varying", { name: "province", length: 100 })
    province: string;
}
