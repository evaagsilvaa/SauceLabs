# Sauce Demo Website
Automation of some scenarios in the Sauce Demo web application.

## Prerequisites
You need to have Node.js installed on your machine with at least v16.x version.

## Installation
Please follow this steps to install and run the project:
1. Open the command line or a git bash terminal on the directory that you want to save the project;
2. Run the following command: ```git clone git@github.com:evaagsilvaa/CodeChallenge_BroadVoice.git```
3. Change to the project directory by using the command: ```cd CodeChallenge_BroadVoice```
4. Run the following command to install all dependencies: ```npm i```
5. Now run the tests with the command: ```npm run wdio```

## Running Tests
To run all the test scenarios, please run the command: ```npm run wdio```

## Assumptions
Here's some assumptions made on the project:

Assumption 1: The project assumes that Node.js is installed on the system.
  - Install at least v16.x or higher as this is the oldest active LTS version
  - Only releases that are or will become an LTS release are officially supported

Assumption 2: During the execution of the tests, it was assumed that there's only one book for each title
