import moment from "moment";
import {map} from "bluebird";

import mongodb from "services/mongodb";

import {
    MEASUREMENTS_DELTA_IN_MS,
    YEARLY_AGGREGATES_COLLECTION_NAME
} from "../config";

function getYearFromDate (dateString) {
    return moment.utc(dateString, moment.ISO_8601, true).format("YYYY");
}

function convertReadingDate (dateString) {
    const dateInMs = moment.utc(dateString, moment.ISO_8601, true).valueOf();
    return dateInMs - (dateInMs % MEASUREMENTS_DELTA_IN_MS);
}

function getOffset (readingDate) {
    const date = convertReadingDate(readingDate);
    const startOfDay = moment.utc(date).startOf("day").valueOf();
    return (date - startOfDay) / MEASUREMENTS_DELTA_IN_MS;
}

function getAggregateId (consumption) {
    const {sensorId, date, source, measurementType} = consumption;
    return `${sensorId}-${getYearFromDate(date)}-${source}-${measurementType}`;
}

function getDefaultAggregate (consumption) {
    const {sensorId, date, source, measurementType, measurementValues, unitOfMeasurement} = consumption;

    return {
        _id: getAggregateId(consumption),
        year: getYearFromDate(date),
        sensorId,
        source,
        measurementType,
        measurementValues,
        unitOfMeasurement
    };
}

async function performUpsert (consumption) {
    const db = await mongodb;
    return db.collection(YEARLY_AGGREGATES_COLLECTION_NAME).update(
        {_id: consumption._id},
        consumption,
        {upsert: true}
    );
}

async function getOrCreateConsumption (consumption) {
    const {date, sum} = consumption;
    const db = await mongodb;
    const aggregate = await db
        .collection(YEARLY_AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(consumption)});
    const agg = aggregate || getDefaultAggregate(consumption);
    var values = (agg.measurementValues || "").split(",");
    values[getOffset(date)] = sum;
    return {
        ...agg,
        measurementValues: values.join(",")
    };
}

export default async function upsertConsumptions (consumptions) {
    const consumptionsToUpsert = await map(consumptions, getOrCreateConsumption);

    return await map(consumptionsToUpsert, performUpsert);
}
