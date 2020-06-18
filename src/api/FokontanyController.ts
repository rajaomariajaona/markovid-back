
import { Controller } from "./Controller";
import { Fokontany } from '../entities/Fokontany';
import { Repository, createConnection, Connection } from 'typeorm';
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
        await this.postFokontany(router)
    }

    async addDelete(router: Router): Promise<void> {
        await this.deleteById(router);
    }

    async addGet(router: Router): Promise<void> {
        await this.getAllFokontany(router)
        await this.getSingleFokontany(router)
    }


    async addPut(router: Router): Promise<void> {
        await this.editFokontany(router);
    }

    private async getAllFokontany(router: Router): Promise<void> {
        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
            try {
                var fokontanys: Fokontany[] = await this.fetchFokontanysFromDatabase()
                await this.sendResponse(res, 200, { data: fokontanys })
                next()
            } catch (err) {
                await this.passErrorToExpress(err, next)
            }
        })
    }

    private async fetchFokontanysFromDatabase(): Promise<Fokontany[]> {
        return await this.fokontanyRepository.find()
    }

    private async getSingleFokontany(router: Router) {
        router.get("/:id", async (req, res, next) => {
            try {
                var fokontany: Fokontany = await this.fokontanyRepository.findOneOrFail()
                await this.sendResponse(res, 200, fokontany)
            } catch (err) {
                await this.sendResponse(res, 404, { message: "Fokontany Not Found" })
            }
        })
    }
    async postFokontany(router: Router) {
    }

}