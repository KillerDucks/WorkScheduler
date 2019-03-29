# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- DockerFile code

### Added
- Prioritiser class `Priority_Class.js` to assist with ordering jobs in the correct order based on:
    - Time span
    - Priority
    - Current Number of jobs

## [1.2.0] - 29-03-2019
### Changed
- Added all the code for the JSON and text file storage options for the App Logger, these options can now be used if you don't want to use MongoDB as a store of the logs.
- Added to the TODO list.

## [1.1.1] - 05-01-2019
### Changed
- Added in extra options into the `Configs.js` file to allow for easier development in different environments. The change added a *Debugging* Key into the object which houses information on if debugging is enabled, which kind of environment are you in (Docker, Standard, Other) and optional information like a debugging MongoDB server for example (`Configs.Debugging.Env.MongoDB.Host`).

### Changed
- `app.js` will know check the config file to see if you have debugging enabled and will be default use the debugging MongoDB Host instead of the normal / 'production' one.

## [1.0.1] - 04-01-2019
### Fixed
- There was a problem with the new DB class method which was calling back 2 sets of data the method in question was `GetSingleRow()`

## [1.0.0] - 03-01-2019
### Added
- Logger was added to the project to allow debugging information to be shown on the console whilst being stored in a DB or a File (formats: JSON, Plain Text).

### Changed
- Refactored the Database class `DB_Class.js` to remove duplication of code, methods have also been renamed to better represent what the method does.

## [0.2.0] -> [1.0.0] - Unknown
### Changed
- Many changes where made to the project, most are undocumented and proper loggings of changes will occur from v1.0.0.

## [0.2.0] - 30-11-2018
### Added
- API routes to the express instance to allow for custom clients to query the database (add, remove, update) for jobs.

## [0.1.0] - 29-11-2018
### Added
- Initial Commit