import {expect} from "chai";

import * as utils from "../utils";

import getReadingsConsumption from "steps/get-readings-consumption";

describe("getReadingsConsumption", () => {

    it("should return a sum value for each measurementType", () => {
        const readings = utils.defaultReadings;
        const expected = [{
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValue: "1.1",
            unitOfMeasurement: "kWh",
            sum: 7.2
        }, {
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "reactiveEnergy",
            measurementValue: "2.2",
            unitOfMeasurement: "kVArh",
            sum: 7.6
        }, {
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "maxPower",
            measurementValue: "3.3",
            unitOfMeasurement: "VAr",
            sum: 20.3
        }];

        const aggregates = [
            utils.aggregateReactiveEnergy,
            utils.aggregateMaxPower,
            utils.aggregateActiveEnergy
        ];

        expect(getReadingsConsumption(readings, aggregates)).to.deep.equals(expected);
    });

    it("should replace a value in the same position of the reading date", () => {
        const aggregates = [utils.aggregateActiveEnergy];
        const readings = [utils.defaultReadings[0]];
        const expected = [{
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValue: "1.1",
            unitOfMeasurement: "kWh",
            sum: 7.2
        }];

        expect(getReadingsConsumption(readings, aggregates)).to.deep.equals(expected);
    });

    it("should return the correct sum if there are no stored data", () => {
        const aggregates = [undefined];
        const readings = [utils.defaultReadings[0]];
        const expected = [{
            sensorId: "sensor1",
            date: "2016-01-28T00:16:36.389Z",
            source: "reading",
            measurementType: "activeEnergy",
            measurementValue: "1.1",
            unitOfMeasurement: "kWh",
            sum: 1.1
        }];

        expect(getReadingsConsumption(readings, aggregates)).to.deep.equals(expected);
    });
});
