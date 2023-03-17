const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

/*This function fetches all the documents in the Job collection that belong to the user identified by 
the userId property in the request object. It then sorts the documents by their creation date and 
sends the list of documents along with the count to the client in the response body.*/

const getAllJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ job, count: job.length });
};


/*This function retrieves a specific document from the Job collection based on the id parameter 
in the request URL and the userId property in the request object. If the document is found, 
it sends the document to the client in the response body. If the document is not found, it throws a NotFoundError. */

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const job = await Job.findOne({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError("Job Not Found !");
  }
  res.status(StatusCodes.OK).json({ job });
};

/*This function creates a new document in the Job collection based on the request body.
 It sets the createdBy property of the document to the userId property in the request object. 
 If the document is created successfully, it sends the document to the client in the response body. */
const createJob = async (req, res) => {
  const { userId, name } = req.user;
  const { company, position, status } = req.body;
  req.body.createdBy = userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

/*This function updates a specific document in the Job collection based on the id parameter in the request
 URL and the userId property in the request object. It updates the document with the properties and values
  provided in the request body. If the update is successful, it sends the updated document to the client in the response body. 
  If the document is not found, it throws a NotFoundError. If the request body is invalid, it throws a BadRequestError. */
const updateJob = async (req, res) => {
  const {
    body: { company, position, status },
    params: { id },
    user: { userId },
  } = req;

  const enumValues = ["interview", "declined", "pending"];
  let newJob = {};

  if (company === "" || position === "") {
    throw new BadRequestError("Company or position connot be empty !");
  }

  if (company) {
    newJob.company = company;
  }

  if (position) {
    newJob.position = position;
  }

  if (status) {
    if (!enumValues.includes(status)) {
      throw new BadRequestError(`status connot be a value of ${status}`);
    }
    newJob.status = status;
  }

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    newJob,
    {
      new: true,
    }
  );

  if (!job) {
    throw new NotFoundError("Job not Found to Update !");
  }

  res.status(StatusCodes.OK).json(job);
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError("Job not Found for deleting !");
  }

  res.status(StatusCodes.OK).json(job);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
