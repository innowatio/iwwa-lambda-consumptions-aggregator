import "babel/polyfill";
import router from "kinesis-router";
import {map} from "bluebird";

import skipProcessing from "./steps/skip-processing";
import findDailyAggregate from "./steps/find-daily-aggregate";
import spreadReadingByMeasurementType from "./steps/spread-readings";
import getReadingsConsumption from "./steps/get-readings-consumption";
import upsertConsumptions from "./steps/upsert-consumptions";

async function pipeline (event) {
    const rawReading = event.data.element;
    /*
    *   Workaround: some events have been incorrectly generated and thus don't
    *   have an `element` property. When processing said events, just return and
    *   move on without failing, as failures can block the kinesis stream.
    */
    if (!rawReading) {
        return null;
    }


    // check if use it or not
    if (skipProcessing(rawReading)) {
        return null;
    }

    // spread
    const readings = spreadReadingByMeasurementType(rawReading);

    // retrieve daily aggregate
    const dailyAggregates = map(readings, findDailyAggregate);

    // merge dailyAggregates and spreadReading
    // const readings.map(reading => {
    //     return merge(reading, {
    //         dailyAggregates.find(agg => {
    //             return agg.sensorId === reading.sensorId && })
    //     });
    // });

    // split aggregates, replace with new value and sum
    const readingTotalConsumptions = getReadingsConsumption(readings, dailyAggregates);

    // upsert
    await upsertConsumptions(readingTotalConsumptions);

    return null;
}

export const handler = router()
    .on("element inserted in collection readings", pipeline);
