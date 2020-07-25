// This package mocks the SyntheticsLogger dependency which is part of the Cloudwatch canary runtime - syn-1.0
// We do this so we can run synthetic checks locally for testing
// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Function_Library.html

const SyntheticsLoggerMock = {
  debug: function (message) {
    return console.debug(message)
  },
  error: function (message) {
    return console.error(message)
  },
  info: function (message) {
    return console.info(message)
  },
  log: function (message) {
    return console.log(message)
  },
  warn: function (message) {
    return console.warn(message)
  }
};

module.exports = SyntheticsLoggerMock;