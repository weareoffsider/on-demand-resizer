# Change Log

All notable changes to this project will be documented in this file.

## Unreleased Changes

## 0.2.0 - 2015-03-11
### Added
- resizes registered with a progress cache to protect against multiple resizes
  of an identical image.

## 0.1.7 - 2015-02-04
### Added
- allow use of imageMagick through config options.

## 0.1.6 - 2015-01-25
### Added
- when the source image is not found, return
  "baseUrl + /source-image-not-found.jpg" instead of crashing

## 0.1.5 - 2015-01-25
### Fixed
- typo

## 0.1.4 - 2015-01-25
### Changed
- resize function supports {src: path, focus: []} setup

## 0.1.3 - 2015-01-25
### Fixed
- srcset breakpoint omits width clause if no breakpoint supplied

## 0.1.2 - 2015-01-25
### Fixed
- forgot to add mkdirp to package.json

## 0.1.1 - 2015-01-25
### Added
- destination folder will be created if required

## 0.1.0 - 2015-01-25
### Added
- basic resizing and srcset command, tested with then-jade
