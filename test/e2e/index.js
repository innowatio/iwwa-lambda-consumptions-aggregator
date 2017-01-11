import "babel-polyfill";
import {expect} from "chai";

import {getMongoClient} from "services/mongodb";
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
        db = await getMongoClient();
        dailyAggregates = db.collection(DAILY_AGGREGATES_COLLECTION_NAME);
        yearlyAggregates = db.collection(YEARLY_AGGREGATES_COLLECTION_NAME);
    });

    after(async () => {
        await db.dropCollection(DAILY_AGGREGATES_COLLECTION_NAME);
        await db.dropCollection(YEARLY_AGGREGATES_COLLECTION_NAME);
        await db.close();
    });

    afterEach(async () => {
        await dailyAggregates.remove({});
        await yearlyAggregates.remove({});
    });

    describe("without readings on DB (no SUM)", () => {

        it("create a yearly aggregate for `reading`", async () => {
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

        it("updates a yearly aggregate for `reading`", async () => {
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

        it("create a yearly aggregate for `reference`", async () => {
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reference"));
            const expected = {
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: ",,,0.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };
            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate for `reference`", async () => {
            await yearlyAggregates.insert(utils.yearAggregateActiveEnergy);
            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-01T00:00:36.389Z", "reference"));
            await run(handler, event);
            const expected = [{
                _id: "sensor1-2016-reading-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "1,2,,",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            }, {
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "0.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            }];
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal(expected);
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

        it("creates a yearly aggregate for `reading`", async () => {

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

        it("updates a yearly aggregate for `reading`", async () => {

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

        it("updates a yearly aggregate (replace the old daily aggregate value before sum) for `reading`", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reading-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reading",
                measurementType: "activeEnergy",
                measurementValues: "4,5,6,7,8,4",
                measurementTimes: "1451862180000,1451862600000,1451862960000,1451863200000,1451866596389,1451869200000",
                unitOfMeasurement: "kWh"
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

        it("creates a yearly aggregate for `reference`", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reference-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "2",
                unitOfMeasurement: "kWh",
                measurementTimes: "1393628400000"
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reference"));
            const expected = {
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: ",,,2.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate for `reference`", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reference-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "2",
                unitOfMeasurement: "kWh",
                measurementTimes: "1393628400000"
            });
            await yearlyAggregates.insert({
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,4",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reference"));
            const expected = {
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,2.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });

        it("updates a yearly aggregate (replace the old daily aggregate value before sum) for `reference`", async () => {

            await dailyAggregates.insert({
                _id: "sensor1-2016-01-04-reference-activeEnergy",
                day: "2016-01-04",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "4",
                unitOfMeasurement: "kWh",
                measurementTimes: "1393628400000"

            });
            await yearlyAggregates.insert({
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,4",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            });

            const event = getEventFromObject(
                utils.getSensorWithSourceInMeasurements("2016-01-04T00:16:36.389Z", "reference"));
            const expected = {
                _id: "sensor1-2016-reference-activeEnergy",
                year: "2016",
                sensorId: "sensor1",
                source: "reference",
                measurementType: "activeEnergy",
                measurementValues: "1,2,3,4.808",
                unitOfMeasurement: "kWh",
                measurementsDeltaInMs: 86400000
            };

            await run(handler, event);
            const consumptions = await yearlyAggregates.find({}).toArray();
            expect(consumptions).to.deep.equal([expected]);
        });
    });
});
