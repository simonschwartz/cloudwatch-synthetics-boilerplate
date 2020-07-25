const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const exampleTest = async function () {
    let url = "https://www.google.com/";

    let page = await synthetics.getPage();

    // Navigate to the initial url
    await synthetics.executeStep('navigateToUrl', async function (timeoutInMillis = 30000) {
        await page.goto(url, {waitUntil: ['load', 'networkidle0'], timeout: timeoutInMillis});
    });

    // Execute customer steps
    await synthetics.executeStep('customerActions', async function () {
        await Promise.all([
          page.waitForNavigation({ timeout: 30000 }),
          await page.click("")
        ]);
        try {
            await synthetics.takeScreenshot("redirection", 'result');
        } catch(ex) {
            synthetics.addExecutionError('Unable to capture screenshot.', ex);
        }
    });
};

exports.handler = async () => {
    return await exampleTest();
};