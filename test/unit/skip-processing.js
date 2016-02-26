import {expect} from "chai";

import {getReading} from "../utils";

import skipProcessing from "steps/skip-processing";


describe("skipProcessing", () => {

    it("skips if the source is not a `reading`", () => {
        const notReading = getReading({source: "forecast", type: "activeEnergy"});
        const reading = getReading({source: "reading", type: "activeEnergy"});

        expect(skipProcessing(notReading)).to.be.equals(true);
        expect(skipProcessing(reading)).to.be.equals(false);
    });

    it("skips if there are no `activeEnergy` measurements", () => {
        const readingMaxPower = getReading({source: "reading", type: "maxPower"});
        const readingActiveEnergy = getReading({source: "reading", type: "activeEnergy"});
        const readingReactiveEnergy = getReading({source: "reading", type: "reactiveEnergy"});

        expect(skipProcessing(readingMaxPower)).to.be.equals(true);
        expect(skipProcessing(readingActiveEnergy)).to.be.equals(false);
        expect(skipProcessing(readingReactiveEnergy)).to.be.equals(true);
    });
});
