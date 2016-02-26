import {expect} from "chai";

import mongodb from "services/mongodb";
import {YEARLY_AGGREGATES_COLLECTION_NAME} from "config";
import {yearAggregateActiveEnergy, defaultReadings} from "../utils";

import upsertConsumptions from "steps/upsert-consumptions";

describe("upsertConsumptions", () => {

    var db;
    var yearlyAggregates;

    before(async () => {
        db = await mongodb;
        yearlyAggregates = db.collection(YEARLY_AGGREGATES_COLLECTION_NAME);
    });

    after(async () => {
        await db.dropCollection(YEARLY_AGGREGATES_COLLECTION_NAME);
        await db.close();
    });

    beforeEach(async () => {
        await yearlyAggregates.remove({});
    });

    it("inserts single new aggregate", async () => {
        var consumption = defaultReadings[0];
        consumption.sum = 7.2;
        await upsertConsumptions([consumption]);

        const expectedAggregate = [{
            _id: "sensor1-2016-reading-activeEnergy",
            year: "2016",
            sensorId: "sensor1",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValues: ",,,7.2",
            unitOfMeasurement: "kWh"
        }];

        const aggregates = await yearlyAggregates.find({}).toArray();
        expect(aggregates).to.deep.equals(expectedAggregate);
    });

    it("updates single new aggregate", async () => {

        await yearlyAggregates.insert(yearAggregateActiveEnergy);

        var consumption = defaultReadings[0];
        consumption.sum = 7.2;
        await upsertConsumptions([consumption]);

        const expectedAggregate = [{
            _id: "sensor1-2016-reading-activeEnergy",
            year: "2016",
            sensorId: "sensor1",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValues: "1,2,,7.2",
            unitOfMeasurement: "kWh"
        }];

        const aggregates = await yearlyAggregates.find({}).toArray();
        expect(aggregates).to.deep.equals(expectedAggregate);
    });

    it("inserts and updates multiple new aggregate", async () => {

        await yearlyAggregates.insert(yearAggregateActiveEnergy);

        var consumption1 = defaultReadings[0];
        consumption1.sum = 7.2;

        var consumption2 = defaultReadings[2];
        consumption2.sum = 9.9;

        await upsertConsumptions([consumption1, consumption2]);

        const expectedAggregate = [{
            _id: "sensor1-2016-reading-activeEnergy",
            year: "2016",
            sensorId: "sensor1",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValues: "1,2,,7.2",
            unitOfMeasurement: "kWh"
        }, {
            _id: "sensor1-2016-reading-maxPower",
            year: "2016",
            sensorId: "sensor1",
            source: "reading",
            measurementType: "maxPower",
            measurementValues: ",,,9.9",
            unitOfMeasurement: "VAr"
        }];

        const aggregates = await yearlyAggregates.find({}).toArray();
        expect(aggregates).to.deep.equals(expectedAggregate);
    });
});
