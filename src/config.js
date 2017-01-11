import dotenv from "dotenv";
import moment from "moment";

dotenv.load();

export const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test";
export const ALLOWED_SOURCES = ["reading", "reference"];
export const ALLOWED_ENERGY_TYPES = ["activeEnergy", "comfort"];
export const CONSUMPTIONS_DELTA_IN_MS = moment.duration(1, "day").asMilliseconds();
export const DAILY_AGGREGATES_COLLECTION_NAME = "readings-daily-aggregates";
export const YEARLY_AGGREGATES_COLLECTION_NAME = "consumptions-yearly-aggregates";
