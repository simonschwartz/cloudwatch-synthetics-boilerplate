// This package mocks the Synthetics dependency which is part of the Cloudwatch canary runtime - syn-1.0
// We do this so we can run synthetic checks locally for testing
// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Function_Library.html

const puppeteer = require('puppeteer');

const SyntheticsMock = {
  getPage: async function () {
    const browser = await puppeteer.launch({ headless: false });
    return await browser.newPage();
  },
  takeScreenshot: async function () {
    return;
  },
  addExecutionError: async function () {
    return;
  },
  executeStep: async function (stepName, callback) {
    return await callback();
  }
};

module.exports = SyntheticsMock;