import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity("Fokontany", { schema: "public" })
export class Fokontany {
    @Column({ type: "character varying", name: "id", primary: true, length: 100 })
    id: string;

    @Index({})
    @Column("character varying", { name: "nom", length: 100 })
    nom: string;

    @Column("character varying", { name: "province", length: 100 })
    province: string;

    @Column("integer", {
        name: "cas_suspect",
        default: () => 0,
        nullable: false
    })
    casSuspect: number;

    @Column("integer", {
        name: "cas_confirme",
        default: () => 0,
        nullable: false
    })
    casConfirme: number;

    @Column({
        type: 'geography',
        nullable: false,
        spatialFeatureType: 'Geometry',
        srid: 4326,
        name: "trace"
    })
    trace: string;
}
