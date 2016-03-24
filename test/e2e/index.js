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
        db.dropCollection(DAILY_AGGREGATES_COLLECTION_NAME);
        db.dropCollection(YEARLY_AGGREGATES_COLLECTION_NAME);
        await db.close();
    });

    afterEach(async () => {
        dailyAggregates.remove({});
        yearlyAggregates.remove({});
    });

    describe("without readings on DB (no SUM)", () => {

        it("create a yearly aggregate", async () => {

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reading"));
            const expected = {
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: ",,,0.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };
            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate", async () => {

            await yearlyAggregates.insert(utils.yearAggregateActiveEnergy);
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-01T00:00:36.389Z", "reading"));
            await run(handler, event);
            const expected = {
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "0.808,2,,",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("does nothing if measurements source is not `reading`", async () => {

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:00:36.389Z", "forecast"));
            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(0).to.equal(consumptions.length);
        });
    });

    describe("with readings on DB (SUM)", () => {

        it("creates a yearly aggregate", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reading-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reading"));
            const expected = {
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: ",,,3.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reading-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });
            await yearlyAggregates.insert({
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,4",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reading"));
            const expected = {
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,3.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate (replace the old daily aggregate value before sum)", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reading-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: ",,,4,5,6,7,8",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });
            await yearlyAggregates.insert({
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,4",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reading"));
            const expected = {
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,26.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });
    });
});
