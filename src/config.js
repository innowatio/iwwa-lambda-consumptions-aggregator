import dotenv from "dotenv";
import moment from "moment";

dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL;
export const ALLOWED_SOURCES = ["reading"];
export const ALLOWED_ENERGY_TYPES = ["activeEnergy"];
export const CONSUMPTIONS_DELTA_IN_MS = moment.duration(1, "day").asMilliseconds();
export const MEASUREMENTS_DELTA_IN_MS = moment.duration(5, "minutes").asMilliseconds();
export const DAILY_AGGREGATES_COLLECTION_NAME = "readings-daily-aggregates";
export const YEARLY_AGGREGATES_COLLECTION_NAME = "consumptions-yearly-aggregates";
