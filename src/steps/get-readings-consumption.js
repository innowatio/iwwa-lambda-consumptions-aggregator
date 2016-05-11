import moment from "moment";
import {path} from "ramda";
import sum from "lodash.sum";

function getMeasurementObject (aggregate) {
    const measurementTimes = (path(["measurementTimes"], aggregate) || "").split(",");
    return (acc, value, index) => acc.concat({
        value,
        time: measurementTimes[index]
    });
}

function getSum (reading, aggregate) {
    const time = moment.utc(reading.date).valueOf();
    const readingMeasurementValue = parseFloat(reading.measurementValue);
    const measurements = aggregate ? (
        aggregate.measurementValues
            .split(",")
            // find if there is already the value passed from the reading at a time, and in case replace that.
            .reduce(getMeasurementObject(aggregate), [])
            .filter(x => x.time != time)
            .map(x => parseFloat(x.value))
            .concat(readingMeasurementValue)
    ) : [readingMeasurementValue];
    return parseFloat(sum(measurements).toFixed(3));
}

function mergeReadingAndAggregate (reading, aggregate) {
    return {
        ...reading,
        sum: getSum(reading, aggregate)
    };
}

// find the aggregate for each reading and merge them
export default function getReadingsConsumption (readings, aggregates) {
    return readings.map(reading => {
        const aggregate = aggregates.find(agg => {
            return path(["measurementType"], agg) === reading.measurementType;
        });
        return mergeReadingAndAggregate(reading, aggregate);
    });
}
