# Sauce Labs Demo Website
Automation of some scenarios in the Sauce Demo web application.

## Prerequisites
You need to have Node.js installed on your machine with at least v16.x version and Playwright with at least v1.30.x

## Installation
Please follow this steps to install and run the project:
1. Open the command line or a git bash terminal on the directory that you want to save the project;
2. Run the following command: ```git clone https://github.com/evaagsilvaa/SauceLabs.git```
3. Change to the project directory by using the command: ```cd SauceLabs```
4. Run the following command to install all dependencies: ```npm i```
5. Run the following command to install playwright browsers: ```npx playwright install```

## Running Tests
To run all tests for all supported languages (e.g., both English and Portuguese): ```npx playwright test```

To run tests for a specific language, use the --project flag:
- For English:```npx playwright test --project=English```
- For Portuguese:```npx playwright test --project=Portuguese```

## More
This repository also contains a TestStrategy.txt file, which outlines a brief test strategy for this website. Additionally, there is a ManualTestCases.txt file, where several test cases are written using the BDD (Behavior-Driven Development) format.
