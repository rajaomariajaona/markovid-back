
import { Controller } from "./Controller";
import { Fokontany } from '../entities/Fokontany';
import { Repository, createConnection, Connection, FindManyOptions, getConnection, MoreThan, Like } from 'typeorm';
import { ormconfig } from '../config';
import { Router } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
import { print } from "util";
import { CustomServer } from './Server';

export default class FokontanyController extends Controller {

    fokontanyRepository: Repository<Fokontany>
    constructor() {
        super()
        this.createConnectionAndAssignRepository().then(async (_) => {
            await this.addAllRoutes(this.mainRouter);
        })
    }
    async createConnectionAndAssignRepository(): Promise<void> {
        try {
            var connection: Connection = await createConnection(ormconfig)
            this.fokontanyRepository = connection.getRepository(Fokontany)
        } catch (error) {
            console.log(error)
        }

    }

    async addPost(router: Router): Promise<void> {
    }

    async addDelete(router: Router): Promise<void> {
    }

    async addGet(router: Router): Promise<void> {
        await this.getZoneFokontany(router)
        await this.getSingleFokontany(router)
    }


    async addPut(router: Router): Promise<void> {
        router.patch("/:id/cas", async (req, res, next) => {
            try {
                let fk = await this.fokontanyRepository.findOneOrFail(req.params.id)
                fk.casSuspect = req.body.casSuspect
                fk.casConfirme = req.body.casConfirme
                await this.fokontanyRepository.save(fk)
                CustomServer.io.emit("changes")
                this.sendResponse(res, 200, { message: "Fokontany updated" })
            } catch (error) {
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }

    private async getZoneFokontany(router: Router) {
        router.get("/zone", async (req, res, next) => {
            try {
                let data = ""
                let cas: Fokontany[] = await this.fokontanyRepository.find({
                    where: {
                        casConfirme: MoreThan(0)
                    }
                })
                for (const fk of cas) {
                    data += `cas_confirme(${fk.casConfirme}, ${fk.id.toLowerCase()}). `
                }
                let cas2: Fokontany[] = await this.fokontanyRepository.find({
                    where: {
                        casSuspect: MoreThan(0)
                    }
                })
                for (const fk of cas2) {
                    data += `cas_suspect(${fk.casSuspect}, ${fk.id.toLowerCase()}). `
                }
                const fs = require("fs-extra")
                const pl = require("tau-prolog")
                const path = require("path")
                data += await fs.readFile(path.join(__dirname, "../rules.pl"))
                const session = pl.create(1000)
                session.consult(data)

                session.query("zone_rouge(Lieu).")
                function getAnswer(tracker): Promise<Array<String>> {
                    return new Promise((resolve, reject) => {
                        let res = []
                        session.answers((x: any) => {
                            if (pl.type.is_substitution(x)) {
                                res.push(`'${x.lookup(tracker).toString().toUpperCase()}'`)
                            } else {
                                resolve(res)
                            }
                        }, 1000);
                    })
                }
                let zone_rouge = await getAnswer("Lieu")
                session.query("zone_jaune(Lieu).")
                let zone_jaune = await getAnswer("Lieu")

                var fokontany_rouge: Fokontany[] = []
                if (zone_rouge.length != 0)
                    fokontany_rouge = await this.fokontanyRepository
                        .createQueryBuilder("fokontany")
                        .select("fokontany.trace", "trace")
                        .addSelect("fokontany.id", "id")
                        .addSelect("st_asgeojson(st_centroid(fokontany.trace))::json", "centre")
                        .where(`fokontany.id IN (${zone_rouge.join(",")})`)
                        .getRawMany()

                var fokontany_jaune: Fokontany[] = []
                if (zone_jaune.length != 0)
                    fokontany_jaune = await this.fokontanyRepository
                        .createQueryBuilder("fokontany")
                        .select("fokontany.trace", "trace")
                        .addSelect("fokontany.id", "id")
                        .addSelect("st_asgeojson(st_centroid(fokontany.trace))::json", "centre")
                        .where(`fokontany.id IN (${zone_jaune.join(",")})`)
                        .getRawMany()

                await this.sendResponse(res, 200, { zone_rouge: fokontany_rouge, zone_jaune: fokontany_jaune })
            } catch (err) {
                console.log(err)
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }

    private async getSingleFokontany(router: Router) {
        router.get("/", async (req, res, next) => {
            try {
                let fokontany =
                    await this.fokontanyRepository
                        .createQueryBuilder("fokontany")
                        .select("fokontany.id", "id")
                        .addSelect("fokontany.nom", "nom")
                        .addSelect("fokontany.province", "province")
                        .addSelect("st_asgeojson(st_centroid(fokontany.trace))::json", "centre")
                        .where(`lower(fokontany.nom) like '%${req.query.nom.toLowerCase()}%'`)
                        .limit(15)
                        .getRawMany()
                await this.sendResponse(res, 200, fokontany)
            } catch (err) {
                console.log(err)
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }
}