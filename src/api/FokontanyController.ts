
import { Controller } from "./Controller";
import { Fokontany } from '../entities/Fokontany';
import { Repository, createConnection, Connection, FindManyOptions } from 'typeorm';
import { ormconfig } from '../config';
import { Router } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';

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
        await this.getSingleFokontany(router)
    }


    async addPut(router: Router): Promise<void> {
        router.patch("/:id/cas-suspect", async (req, res, next) => {
            try {
                let fk = await this.fokontanyRepository.findOneOrFail(req.params.id)
                fk.casSuspect = req.body.cas
                await this.fokontanyRepository.save(fk)
            } catch (error) {
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
        router.patch("/:id/cas-confirme", async (req, res, next) => {
            try {
                let fk = await this.fokontanyRepository.findOneOrFail(req.params.id)
                fk.casConfirme = req.body.cas
                await this.fokontanyRepository.save(fk)
            } catch (error) {
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }

    private async getSingleFokontany(router: Router) {
        router.get("/:nom", async (req, res, next) => {
            try {
                var fokontany: Fokontany[] = await this.fokontanyRepository.createQueryBuilder("fokontany").select().where(`lower(fokontany.nom) like '%${req.params.nom.toLowerCase()}%'`).limit(10).getMany()
                await this.sendResponse(res, 200, fokontany)
            } catch (err) {
                console.log(err)
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }
}