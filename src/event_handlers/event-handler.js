module.exports = {
  onUnhandledRejection: require("./unhandled_rejection/unhandled-rejection"),
  onClientReady: require("./client_ready/client-ready"),
  onInteractionCreate: require("./interaction_create/interaction-create")
};
