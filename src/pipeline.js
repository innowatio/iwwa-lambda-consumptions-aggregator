import {map} from "bluebird";
import {contains, isNil, filter} from "ramda";

import skipProcessing from "./steps/skip-processing";
import findDailyAggregate from "./steps/find-daily-aggregate";
import spreadReading from "./steps/spread-readings";
import getReadingsConsumption from "./steps/get-readings-consumption";
import upsertConsumptions from "./steps/upsert-consumptions";
import {ALLOWED_ENERGY_TYPES} from "./config";

export default async function pipeline (event) {
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
    const readings = filter(
        reading => contains(reading.measurementType, ALLOWED_ENERGY_TYPES),
        spreadReading(rawReading)
    );
    if (!readings) {
        return null;
    }

    // retrieve daily aggregate
    const dailyAggregates = await map(readings, findDailyAggregate);

    // split aggregates, replace with new value and sum
    const readingTotalConsumptions = getReadingsConsumption(
        readings,
        dailyAggregates.filter(agg => !isNil(agg))
    );

    // upsert
    await upsertConsumptions(readingTotalConsumptions);

    return null;
}
