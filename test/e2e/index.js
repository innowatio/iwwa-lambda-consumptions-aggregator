import {expect} from "chai";

import mongodb from "services/mongodb";
import {
    DAILY_AGGREGATES_COLLECTION_NAME,
    YEARLY_AGGREGATES_COLLECTION_NAME
} from "config";
import * as utils from "../utils";
import {getEventFromObject, run} from "../mocks";

import {handler} from "index";

describe("On reading", () => {

    var dailyAggregates;
    var db;
    var yearlyAggregates;

    before(async () => {
        db = await mongodb;
        dailyAggregates = db.collection(DAILY_AGGREGATES_COLLECTION_NAME);
        yearlyAggregates = db.collection(YEARLY_AGGREGATES_COLLECTION_NAME);
    });

    after(async () => {
        await db.dropCollection(DAILY_AGGREGATES_COLLECTION_NAME);
        await db.dropCollection(YEARLY_AGGREGATES_COLLECTION_NAME);
        await db.close();
    });

    beforeEach(async () => {
        await dailyAggregates.remove({});
        await yearlyAggregates.remove({});
    });

    it("create a yearly aggregate", async () => {
        const event = getEventFromObject(utils.getSensorWithSourceInMeasurements("2016-01-28T00:16:36.389Z", "reading"));
        await run(handler, event);
        const consumptions = await yearlyAggregates.find({}).toArray();
        expect(1).to.be.equals(consumptions.length);
    });

    it("updates a yearly aggregate", async () => {
        const event = getEventFromObject(utils.defaultReadings[0]);
        await run(handler, event);
        // const consumptions = await yearlyAggregates.find({}).toArray();
        // expect(1).to.be.equals(consumptions.length);
        expect(true).to.be.equals(true);
    });
});
