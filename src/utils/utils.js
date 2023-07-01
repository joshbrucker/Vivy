function escapeMarkdown(text) {
  return text.replace(/((_|\*|~|`|\|){2})/g, "\\$1");
}

function getMonthName(num) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  try {
    return months[num - 1];
  } catch (err) {
    throw new Error("Invalid month number! Valid range is 1-12.");
  }
}

function playableToString(playable, includeLink = true) {
  if (includeLink && playable.url) {
    return `[${escapeMarkdown(playable.title)}](${playable.url})`;
  }

  return escapeMarkdown(playable.title);
}

async function random(num) {
  return Math.floor(Math.random() * num);
}

module.exports = {
  escapeMarkdown,
  getMonthName,
  random,
  playableToString
};
