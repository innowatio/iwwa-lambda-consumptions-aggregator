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

export function getMeasure ({source="forecast", type="temperature"}) {
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
            }, {
                "type": "comfortLevel",
                "value": "2",
                "unitOfMeasurement": "status"
            }
        ]
    };
}

export const dayAggregateActiveEnergy = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "activeEnergy",
    measurementValues: "1.1,1,5,6",
    measurementTimes: "1453935600000,1453935900000,1453936600000,1453938600000",
    unitOfMeasurement: "kWh"
};

export const dayAggregateReferenceActiveEnergy = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reference",
    measurementType: "activeEnergy",
    measurementValues: "1.1",
    unitOfMeasurement: "kWh",
    measurementTimes: 1393628400000
};


export const dayAggregateReactiveEnergy = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "reactiveEnergy",
    measurementValues: "2.2,1,2.2,3.3",
    measurementTimes: "1453935600000,1453935900000,1453936600000,1453940196389",
    unitOfMeasurement: "kVArh"
};

export const dayAggregateComfortLevel = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "comfortLevel",
    measurementValues: "0,1,2,1",
    measurementTimes: "1453935600000,1453935900000,1453936600000,1453940196389",
    unitOfMeasurement: "status"
};

export const dayAggregateReactiveEnergyWithDifferentDay = {
    sensorId: "sensor1",
    day: "2016-01-29",
    source: "reading",
    measurementType: "reactiveEnergy",
    measurementValues: "2.5,3,1.2,5.3",
    measurementTimes: "1454025600000,1454026600000,1454027600000,1454035600000",
    unitOfMeasurement: "kVArh"
};

export const dayAggregateMaxPower = {
    sensorId: "sensor1",
    day: "2016-01-28",
    source: "reading",
    measurementType: "maxPower",
    measurementValues: "0,9,8",
    measurementTimes: "1453935900000,1453936600000,1453937600000",
    unitOfMeasurement: "VAr"
};


export const yearAggregateActiveEnergy = {
    _id: "sensor1-2016-reading-activeEnergy",
    year: "2016",
    sensorId: "sensor1",
    source: "reading",
    measurementType: "activeEnergy",
    measurementValues: "1,2,,",
    unitOfMeasurement: "kWh",
    measurementsDeltaInMs: 86400000
};

export const readingsReactiveEnergy = [{
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reading",
    measurementType: "reactiveEnergy",
    measurementValue: "2.2",
    unitOfMeasurement: "kVArh"
}];

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
    source: "reference",
    measurementType: "activeEnergy",
    measurementValue: "1.1",
    unitOfMeasurement: "kWh"
}, {
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reading",
    measurementType: "comfortLevel",
    measurementValue: "1.1",
    unitOfMeasurement: "status"
}, {
    sensorId: "sensor1",
    date: "2016-01-29T00:16:36.389Z",
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

export const defaultReference = [{
    sensorId: "sensor1",
    date: "2016-01-28T00:16:36.389Z",
    source: "reference",
    measurementType: "activeEnergy",
    measurementValue: "1.1",
    unitOfMeasurement: "kWh"
}];
