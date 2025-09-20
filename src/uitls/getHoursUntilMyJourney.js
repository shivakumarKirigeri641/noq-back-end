function getHoursUntilMyJourney(dateOfJourney, timeOfDeparture) {
  // Ensure two-digit hours & minutes
  const [hh, mm] = timeOfDeparture.split(":").map((x) => x.padStart(2, "0"));

  const journeyDateTime = new Date(dateOfJourney);

  const now = new Date();
  const diffMs = journeyDateTime - now;
  return diffMs / (1000 * 60 * 60);
}
//wrong conversion here...
module.exports = getHoursUntilMyJourney;
