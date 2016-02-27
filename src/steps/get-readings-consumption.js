import moment from "moment";
import {path} from "ramda";

import {MEASUREMENTS_DELTA_IN_MS} from "../config";

function convertReadingDate (dateString) {
    const dateInMs = moment.utc(dateString, moment.ISO_8601, true).valueOf();
    return dateInMs - (dateInMs % MEASUREMENTS_DELTA_IN_MS);
}

function getOffset (readingDate) {
    const date = convertReadingDate(readingDate);
    const startOfDay = moment.utc(date).startOf("day").valueOf();
    return (date - startOfDay) / MEASUREMENTS_DELTA_IN_MS;
}

function getSum (reading, measurementsString) {
    var measurements = measurementsString.split(",");
    measurements[getOffset(reading.date)] = reading.measurementValue;
    return parseFloat(measurements.reduce((prev, value) => {
        return prev + (parseFloat(value || 0));
    }, 0).toFixed(3));
}

function mergeReadingAndAggregate (reading, aggregate) {
    return {
        ...reading,
        sum: getSum(reading, path(["measurementValue"], aggregate) || "")
    };
}

// find the aggregate for each reading and merge them
export default function getReadingsConsumption (readings, aggregates) {

    return readings.map(reading => {
        return mergeReadingAndAggregate(reading, aggregates.find((agg) => {
            return path(["measurementType"], agg) === reading.measurementType;
        }));
    });
}
