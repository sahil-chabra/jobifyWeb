import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  getjob,
  showStats,
  updateJob,
} from "../controller/jobController.js";

const jobRouter = express.Router();

jobRouter.route("/").get(getAllJobs).post(createJob);
jobRouter.get("/showStats", showStats);
jobRouter.route("/:id").patch(updateJob).delete(deleteJob).get(getjob);

export default jobRouter;
