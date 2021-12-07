const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;

const createTripReview = async (tripId, userId, reviewText, recommended) => {
  if (
    !ObjectId.isValid(tripId) ||
    userId == null ||
    typeof reviewText !== "string" ||
    reviewText.trim() === "" ||
    recommended == null
  ) {
    throw new Error("Invalid parameters");
  }
  const reviewDb = await reviews();
  const review = { tripId, userId, reviewText, recommended };
  await reviewDb.insertOne(review);
};

const getReviewsForTrip = async (tripId) => {
  if (!ObjectId.isValid(tripId)) {
    throw new Error("Invalid trip id");
  }
  const reviewDb = await reviews();
  const reviewsForTrip = await reviewDb.find({ tripId }).toArray();
  return reviewsForTrip;
};

module.exports = { createTripReview, getReviewsForTrip };
