// Validation helper
const validateTicketData = (data) => {
  const errors = [];

  // Validate sourceStation
  if (
    !data.sourceStation ||
    !data.sourceStation._id ||
    !data.sourceStation.name ||
    !data.sourceStation.code
  ) {
    errors.push("sourceStation is required with _id, name, and code.");
  } else {
    if (
      !Array.isArray(data.sourceStation.name) ||
      data.sourceStation.name.some(
        (n) => typeof n !== "string" || n.length < 2 || n.length > 50
      )
    ) {
      errors.push(
        "sourceStation.name must be an array of strings (2-50 chars)."
      );
    }
    if (
      !Array.isArray(data.sourceStation.code) ||
      data.sourceStation.code.some(
        (c) => typeof c !== "string" || c.length < 2 || c.length > 6
      )
    ) {
      errors.push(
        "sourceStation.code must be an array of strings (2-6 chars)."
      );
    }
  }

  // Validate destinationStation
  if (
    !data.destinationStation ||
    !data.destinationStation._id ||
    !data.destinationStation.name ||
    !data.destinationStation.code
  ) {
    errors.push("destinationStation is required with _id, name, and code.");
  } else {
    if (
      !Array.isArray(data.destinationStation.name) ||
      data.destinationStation.name.some(
        (n) => typeof n !== "string" || n.length < 2 || n.length > 50
      )
    ) {
      errors.push(
        "destinationStation.name must be an array of strings (2-50 chars)."
      );
    }
    if (
      !Array.isArray(data.destinationStation.code) ||
      data.destinationStation.code.some(
        (c) => typeof c !== "string" || c.length < 2 || c.length > 6
      )
    ) {
      errors.push(
        "destinationStation.code must be an array of strings (2-6 chars)."
      );
    }
  }

  // Date of journey
  if (!data.dateOfJourney || isNaN(Date.parse(data.dateOfJourney))) {
    errors.push("dateOfJourney is required and must be a valid date.");
  }

  // Adults and children
  if (
    typeof data.adultsCount !== "number" ||
    data.adultsCount < 1 ||
    data.adultsCount > 6
  ) {
    errors.push("adultsCount must be a number between 1 and 6.");
  }
  if (
    data.childrenCount !== undefined &&
    (typeof data.childrenCount !== "number" ||
      data.childrenCount < 0 ||
      data.childrenCount > 6)
  ) {
    errors.push("childrenCount must be a number between 0 and 6.");
  }

  // Mobile numbers
  const mobileRegex = /^[0-9]{10}$/;
  if (
    data.travellersmobileNumber &&
    !mobileRegex.test(data.travellersmobileNumber)
  ) {
    errors.push("travellersmobileNumber must be a 10-digit number string.");
  }
  if (data.bookersmobileNumber && !mobileRegex.test(data.bookersmobileNumber)) {
    errors.push("bookersmobileNumber must be a 10-digit number string.");
  }

  // Passenger discounts
  const discounts = data.passengerDiscountDetails;
  if (!discounts) {
    errors.push("passengerDiscountDetails is required.");
  } else {
    if (
      typeof discounts.childFareDiscount !== "number" ||
      discounts.childFareDiscount < 0 ||
      discounts.childFareDiscount > 10000
    ) {
      errors.push("childFareDiscount must be a number between 0 and 10000.");
    }
    if (
      typeof discounts.physicallyHandicappedDiscount !== "number" ||
      discounts.physicallyHandicappedDiscount < 0 ||
      discounts.physicallyHandicappedDiscount > 100
    ) {
      errors.push(
        "physicallyHandicappedDiscount must be a number between 0 and 100."
      );
    }
    if (
      typeof discounts.generalDiscount !== "number" ||
      discounts.generalDiscount < 0 ||
      discounts.generalDiscount > 100
    ) {
      errors.push("generalDiscount must be a number between 0 and 100.");
    }
  }

  // Train and fare details
  const train = data.trainAndFareDetails;
  if (!train) {
    errors.push("trainAndFareDetails is required.");
  } else {
    if (typeof train.trainNumber !== "number" || train.trainNumber < 0) {
      errors.push("trainNumber must be a non-negative number.");
    }
    if (typeof train.trainName !== "string" || train.trainName.length > 50) {
      errors.push("trainName must be a string up to 50 characters.");
    }
    if (
      typeof train.trainFarePerIndividual !== "number" ||
      train.trainFarePerIndividual < 0 ||
      train.trainFarePerIndividual > 10000
    ) {
      errors.push(
        "trainFarePerIndividual must be a number between 0 and 10000."
      );
    }
  }

  return errors;
};
module.exports = validateTicketData;
