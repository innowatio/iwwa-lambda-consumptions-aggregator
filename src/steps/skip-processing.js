import {contains} from "ramda";

import * as config from "../config";

function checkSource (reading) {
    return contains((reading.source || reading.measurements[0].source), config.ALLOWED_SOURCES);
}

function checkContainsAllowedTypes (reading) {
    return contains((reading.type || reading.measurements[0].type), config.ALLOWED_ENERGY_TYPES);
}

export default function skipProcessing (reading) {
    return (
        // Ignore if not a reading
        !checkSource(reading) ||
        // Ignore readings without an `activeEnergy`
        !checkContainsAllowedTypes(reading)
    );
}
