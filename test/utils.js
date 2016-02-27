export function getSensorWithSourceInMeasurements (date, source) {
    return {
        "id": "eventId",
        "data": {
            "element": {
                "sensorId": "sensor1",
                "date": date,
                "measurements": [
                    {
                        "type": "activeEnergy",
                        "source": source,
                        "value": "0.808",
                        "unitOfMeasurement": "kWh"
                    },
                    {
                        "type": "reactiveEnergy",
                        "source": source,
                        "value": "-0.085",
                        "unitOfMeasurement": "kVArh"
                    },
                    {
                        "type": "maxPower",
                        "source": source,
                        "value": "0.000",
                        "unitOfMeasurement": "VAr"
                    }
                ]
            },
            "id": "electricalReadingId"
        },
        "timestamp": 1420070400000,
        "type": "element inserted in collection readings"
    };
}

export function getReading ({source="forecast", type="temperature"}) {
    return {
        "sensorId": "sensor1",
        "date": "2016-01-28T00:16:36.389Z",
        "source": source,
        "measurements": [
            {
                "type": type,
                "value": "0.808",
                "unitOfMeasurement": "kWh"
            }
        ]
    };
}

export function getReadingWithMultipleMeasurements () {
    return {
        "sensorId": "sensor1",
        "date": "2016-01-28T00:16:36.389Z",
        "source": "reading",
        "measurements": [
            {
                "type": "activeEnergy",
                "value": "1.1",
                "unitOfMeasurement": "kWh"
            }, {
                "type": "temperature",
                "value": "2.2",
                "unitOfMeasurement": "°C"
            }, {
                "type": "maxPower",
                "value": "3.3",
                "unitOfMeasurement": "VAr"
            }
        ]
    };
}

export const dayAggregateActiveEnergy = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "activeEnergy",
    measurementValue: "1.1,,5,6",
    unitOfMeasurement: "kWh"
};

export const dayAggregateReactiveEnergy = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "reactiveEnergy",
    measurementValue: "2.2,1,2.2,3.3",
    unitOfMeasurement: "°C"
};

export const dayAggregateMaxPower = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "maxPower",
    measurementValue: "0,9,8",
    unitOfMeasurement: "VAr"
};


export const yearAggregateActiveEnergy = {
    _id: "sensor1-2016-reading-activeEnergy",
    year: "2016",
    sensorId: "sensor1",
    source: "reading",
    measurementType: "activeEnergy",
    measurementValues: "1,2,,",
    unitOfMeasurement: "kWh"
};

export const defaultReadings = [{
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reading",
    measurementType: "activeEnergy",
    measurementValue: "1.1",
    unitOfMeasurement: "kWh"
}, {
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reading",
    measurementType: "reactiveEnergy",
    measurementValue: "2.2",
    unitOfMeasurement: "kVArh"
}, {
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reading",
    measurementType: "maxPower",
    measurementValue: "3.3",
    unitOfMeasurement: "VAr"
}];
