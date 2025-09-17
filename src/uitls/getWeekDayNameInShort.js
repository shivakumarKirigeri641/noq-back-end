const getWeekDayNameInShort = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};
module.exports = getWeekDayNameInShort;
