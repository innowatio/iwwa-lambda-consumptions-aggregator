import {expect} from "chai";
import {getMeasure} from "../utils";

import skipProcessing from "steps/skip-processing";

describe("skipProcessing", () => {

    it("skips if the source is not a `reading`", () => {
        const forecast = getMeasure({source: "forecast", type: "activeEnergy"});
        const reading = getMeasure({source: "reading", type: "activeEnergy"});
        const comfort = getMeasure({source: "reading", type: "comfortLevel"});

        expect(skipProcessing(forecast)).to.be.equals(true);
        expect(skipProcessing(reading)).to.be.equals(false);
        expect(skipProcessing(comfort)).to.be.equals(false);
    });

    it("skips if the source is not a `reference`", () => {
        const forecast = getMeasure({source: "forecast", type: "activeEnergy"});
        const reference = getMeasure({source: "reference", type: "activeEnergy"});

        expect(skipProcessing(forecast)).to.be.equals(true);
        expect(skipProcessing(reference)).to.be.equals(false);
    });

    it("skips if there are no `activeEnergy` measurements", () => {
        const readingMaxPower = getMeasure({source: "reading", type: "maxPower"});
        const readingActiveEnergy = getMeasure({source: "reading", type: "activeEnergy"});
        const readingReactiveEnergy = getMeasure({source: "reading", type: "reactiveEnergy"});

        const referenceMaxPower = getMeasure({source: "reference", type: "maxPower"});
        const referenceActiveEnergy = getMeasure({source: "reference", type: "activeEnergy"});
        const referenceReactiveEnergy = getMeasure({source: "reference", type: "reactiveEnergy"});

        expect(skipProcessing(readingMaxPower)).to.be.equals(true);
        expect(skipProcessing(readingActiveEnergy)).to.be.equals(false);
        expect(skipProcessing(readingReactiveEnergy)).to.be.equals(true);

        expect(skipProcessing(referenceMaxPower)).to.be.equals(true);
        expect(skipProcessing(referenceActiveEnergy)).to.be.equals(false);
        expect(skipProcessing(referenceReactiveEnergy)).to.be.equals(true);
    });

    it("skips if there are no `comfortLevel` measurements", () => {
        const readingMaxPower = getMeasure({source: "reading", type: "maxPower"});
        const readingComfortLevel = getMeasure({source: "reading", type: "comfortLevel"});
        const readingReactiveEnergy = getMeasure({source: "reading", type: "reactiveEnergy"});

        expect(skipProcessing(readingMaxPower)).to.be.equals(true);
        expect(skipProcessing(readingComfortLevel)).to.be.equals(false);
        expect(skipProcessing(readingReactiveEnergy)).to.be.equals(true);
    });
});
