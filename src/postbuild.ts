import { createConnection } from 'typeorm';
import { ormconfig } from './config';
import { Fokontany } from '../src/entities/Fokontany'

async function pushData() {
    try {
        let connection = await createConnection(ormconfig)
        let fokontanyRepository = connection.getRepository(Fokontany)
        if (await fokontanyRepository.count() == 0) {
            let path = require("path")
            var AdmZip = require('adm-zip');
            var zip = new AdmZip(path.join(__dirname, `insert.zip`));
            var zipEntries = zip.getEntries();
            zipEntries.forEach(async function (zipEntry) {
                if (zipEntry.entryName == "insert.sql") {
                    await connection.createEntityManager().query(zipEntry.getData().toString('utf8'))
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}
pushData()
