module.exports = (error) => {
  if (error.code === "ENOTFOUND") {
    console.log("No internet connection");
  } else if (error.code === "ECONNREFUSED") {
    console.log("Connection refused");
  } else {
    console.log(error);
  }
}
