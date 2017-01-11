import {expect} from "chai";

import {getReadingWithMultipleMeasurements} from "../utils";

import spreadReadingByMeasurementType from "steps/spread-readings";

describe("spreadReadingByMeasurementType", () => {

    it("should spread the measurements", () => {
        const reading = getReadingWithMultipleMeasurements();
        const expected = [{
            "sensorId": "sensor1",
            "date": "2016-01-28T00:16:36.389Z",
            "source": "reading",
            "measurementType": "activeEnergy",
            "measurementValue": "1.1",
            "unitOfMeasurement": "kWh"
        }, {
            "sensorId": "sensor1",
            "date": "2016-01-28T00:16:36.389Z",
            "source": "reading",
            "measurementType": "temperature",
            "measurementValue": "2.2",
            "unitOfMeasurement": "°C"
        }, {
            "sensorId": "sensor1",
            "date": "2016-01-28T00:16:36.389Z",
            "source": "reading",
            "measurementType": "maxPower",
            "measurementValue": "3.3",
            "unitOfMeasurement": "VAr"
        }, {
            "sensorId": "sensor1",
            "date": "2016-01-28T00:16:36.389Z",
            "source": "reading",
            "measurementType": "comfortLevel",
            "measurementValue": "2",
            "unitOfMeasurement": "status"
        }];

        const spreadResult = spreadReadingByMeasurementType(reading);
        expect(spreadResult.length).to.be.equals(4);
        expect(spreadResult).to.deep.equals(expected);
    });

});
