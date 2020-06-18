let fs = require("fs-extra")
let path = require("path")
async function parse() {
    try {
        let obj = await fs.readJson(path.join(__dirname, "data.json"))
        let res = []
        for (const fokotany of obj["features"]) {
            const prop = fokotany["properties"]
            res.push(`INSERT INTO public."Fokontany"(id, nom, province, trace) VALUES ('${prop["ADM4_PCODE"]}', '${prop["ADM4_EN"].replace("'", "''")}', '${prop["OLD_PROVIN"]}', st_geomfromgeojson('${JSON.stringify(fokotany["geometry"])}'));`)
        }
        await fs.outputFile(path.join(__dirname, `insert.sql`), res.join(""))
        res = null
        obj = null
    } catch (error) {
        console.log(error)
    }
}
parse()