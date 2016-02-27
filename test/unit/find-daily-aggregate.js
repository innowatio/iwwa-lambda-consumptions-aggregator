import {expect} from "chai";
import {map} from "bluebird";

import mongodb from "services/mongodb";
import {DAILY_AGGREGATES_COLLECTION_NAME} from "config";

import findDailyAggregate from "steps/find-daily-aggregate";

describe("findDailyAggregate", () => {

    const aggregateMockActiveEnergySensor = {
        _id: "sensor1-2016-01-28-reading-activeEnergy",
        sensorId: "sensor1",
        day: "2016-01-28",
        source: "reading",
        measurementType: "activeEnergy",
        unitOfMeasurement: "kWh",
        measurementValues: "1,2,3,4,5,6,7,8,9,0"
    };

    var dailyAggregates;
    var db;

    before(async () => {
        db = await mongodb;
        dailyAggregates = db.collection(DAILY_AGGREGATES_COLLECTION_NAME);
    });
    after(async () => {
        await db.dropCollection(DAILY_AGGREGATES_COLLECTION_NAME);
        await db.close();
    });
    beforeEach(async () => {
        await dailyAggregates.remove({});
        await dailyAggregates.insert(aggregateMockActiveEnergySensor);
    });

    it("finds the correct aggregate on DB", async () => {
        const reading = [{
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValue: "1.1",
            unitOfMeasurement: "kWh"
        }];

        const result = await map(reading, findDailyAggregate);
        expect(result).to.deep.equal([aggregateMockActiveEnergySensor]);
    });
});
