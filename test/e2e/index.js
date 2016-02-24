import mongodb from "services/mongodb";
import {AGGREGATES_COLLECTION_NAME} from "config";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mocks";

import {handler} from "index";

describe("On reading", async () => {

    var aggregates;
    var db;
    before(async () => {
        db = await mongodb;
        aggregates = db.collection(AGGREGATES_COLLECTION_NAME);
    });
    after(async () => {
        await db.close();
    });
    beforeEach(async () => {
        await aggregates.remove({});
    });

    describe("creates and insert a yearly aggregate", async () => {
        const event = getEventFromObject(utils.defaultReadings()[0]);
        // await run(handler, event);
    });
});
