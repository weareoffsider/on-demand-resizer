# Change Log

All notable changes to this project will be documented in this file.

## Unreleased Changes

## 0.6.0 - 2019-10-22
### Added
- add imageminPlugins to config to allow for customisation on image optimisation
  settings

## 0.5.5 - 2019-01-22
### Fixed
- instantiate gm inside doResize to attempt reduction of memory footprint

## 0.5.3 - 2016-08-12
### Fixed
- Fix using extension when file provided to api.resize is an image object.

## 0.5.2 - 2016-06-06
### Fixed
- Add missing browser passovers for browserify.

## 0.5.1 - 2016-06-06
### Fixed
- Fixed collection of buffer. Improved recovery on error so queue will continue.

## 0.5.0 - 2016-05-10
### Changed
- Update all dependencies. Changes should be internal only. Pinned dependency
  versions.

## 0.4.0 - 2015-04-02
### Added
- Added worker setting to set an upper limit to the number of concurrent
  resizes being done.

## 0.3.3 - 2015-03-28
### Changed
- Changed to in memory cache of done and progress images, so resizing will not
  even check the filesystem if an image record is in the cache. Attempt to
  improve the current execution, which is way less efficient than it should be.

## 0.3.2 - 2015-03-27
### Changed
- Changed SHA1 hashing to be implemented by jshashes, for client support and
  small browserify runtime

## 0.3.1 - 2015-03-27
### Fixed
- Removed deprecated promise requires.

## 0.3.0 - 2015-03-27
### Changed
- Stopped using promises, predicted result names are returned regardless of
  resize results so code can be used within synchronous render cycles, will
  be experimenting with this in context of React rendering in a client split.

## 0.2.2 - 2015-03-13
### Fixed
- flush cache if source file not found

## 0.2.1 - 2015-03-11
### Fixed
- cache reference incorrect

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
