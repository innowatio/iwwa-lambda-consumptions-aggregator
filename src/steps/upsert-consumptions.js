import moment from "moment";
import {map} from "bluebird";

import mongodb from "services/mongodb";

import {
    CONSUMPTIONS_DELTA_IN_MS,
    YEARLY_AGGREGATES_COLLECTION_NAME
} from "../config";

async function performUpsert (consumption) {
    const db = await mongodb;
    return db.collection(YEARLY_AGGREGATES_COLLECTION_NAME).update(
        {_id: consumption._id},
        consumption,
        {upsert: true}
    );
}

function getYearFromDate (dateString) {
    return moment.utc(dateString, moment.ISO_8601, true).format("YYYY");
}

function getYearOffset (readingDate) {
    return moment.utc(readingDate, moment.ISO_8601, true).dayOfYear()-1;
}

function getAggregateId (consumption) {
    const {sensorId, date, source, measurementType} = consumption;
    return `${sensorId}-${getYearFromDate(date)}-${source}-${measurementType}`;
}


function getDefaultAggregate (consumption) {
    const {sensorId, date, source, measurementType, unitOfMeasurement} = consumption;
    return {
        _id: getAggregateId(consumption),
        year: getYearFromDate(date),
        sensorId,
        source,
        measurementType,
        measurementValues: "",
        unitOfMeasurement
    };
}

async function getOrCreateConsumption (consumption) {
    const {date, sum} = consumption;
    const db = await mongodb;
    const aggregate = await db
        .collection(YEARLY_AGGREGATES_COLLECTION_NAME)
        .findOne({_id: getAggregateId(consumption)});
    const agg = aggregate || getDefaultAggregate(consumption);
    var values = agg.measurementValues.split(",");
    values[getYearOffset(date)] = sum;
    return {
        ...agg,
        measurementValues: values.join(","),
        measurementsDeltaInMs: CONSUMPTIONS_DELTA_IN_MS
    };
}

export default async function upsertConsumptions (consumptions) {
    const consumptionsToUpsert = await map(consumptions, getOrCreateConsumption);
    return await map(consumptionsToUpsert, performUpsert);
}
