import moment from "moment";
import {map} from "bluebird";

import mongodb from "services/mongodb";

import {
    MEASUREMENTS_DELTA_IN_MS,
    YEARLY_AGGREGATES_COLLECTION_NAME
} from "../config";

function getYearFromDate (dateString) {
    return moment.utc(dateString, moment.ISO_8601, true).parse("YYYY");
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
    const {sensorId, date, source, measurementType, unitOfMeasurement, sum} = consumption;
    var values = [];
    values[getOffset(date)] = sum;
    return {
        _id: getAggregateId(consumption),
        year: getYearFromDate(date),
        sensorId,
        source,
        measurementType,
        measurementValues: values,
        unitOfMeasurement,
        measurementsDeltaInMs: MEASUREMENTS_DELTA_IN_MS
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
    const db = await mongodb;
    const aggregate = await db
        .collection(YEARLY_AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(consumption)});
    return aggregate || getDefaultAggregate(consumption);
}

export default async function upsertConsumptions (consumptions) {
    const consumptionsToUpsert = await getOrCreateConsumption(consumptions);

    return map(consumptionsToUpsert, performUpsert);
}
