// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onUnhandledRejection(error: any) {
  if (error.code === "ENOTFOUND") {
    console.log("No internet connection");
  } else if (error.code === "ECONNREFUSED") {
    console.log("Connection refused");
  } else {
    console.log(error);
  }
}
