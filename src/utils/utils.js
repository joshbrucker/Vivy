const { Utils } = require("discord-music-player");

function escapeMarkdown(text) {
  return text.replace(/((\_|\*|\~|\`|\|){2})/g, '\\$1');
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

function isPlaylist(search) {
  return Utils.regexList.SpotifyPlaylist.test(search) ||
      Utils.regexList.YouTubePlaylist.test(search) ||
      Utils.regexList.ApplePlaylist.test(search);
}

async function random(num) {
  return Math.floor(Math.random() * num);
}

module.exports = {
  escapeMarkdown,
  getMonthName,
  isPlaylist,
  random
};
