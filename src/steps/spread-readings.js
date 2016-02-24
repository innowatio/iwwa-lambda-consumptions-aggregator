import assert from "assert";
import {is, path} from "ramda";

function getReadingSource (reading) {
    const source = (
        reading.source ?
        reading.source :
        path(["measurements", "0", "source"], reading)
    );
    assert(is(String, source), "Reading has no source");
    return source;
}

export default function spreadReadingByMeasurementType (reading) {
    const source = getReadingSource(reading);
    return reading.measurements.map(measurement => ({
        sensorId: reading.sensorId,
        date: reading.date,
        source,
        measurementType: measurement.type,
        measurementValue: measurement.value,
        unitOfMeasurement: measurement.unitOfMeasurement
    }));
}
