#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// nS - No Space
// lC - Lowercase

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mv = require('mv');

var _mv2 = _interopRequireDefault(_mv);

var _projectName = require('project-name');

var _projectName2 = _interopRequireDefault(_projectName);

var _pathExists = require('path-exists');

var _pathExists2 = _interopRequireDefault(_pathExists);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _replace = require('replace');

var _replace2 = _interopRequireDefault(_replace);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _foldersAndFiles = require('./config/foldersAndFiles');

var _filesToModifyContent = require('./config/filesToModifyContent');

var _bundleIdentifiers = require('./config/bundleIdentifiers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectName = (0, _projectName2.default)();
var replaceOptions = {
	recursive: true,
	silent: true
};

function readFile(filePath) {
	return new Promise(function (resolve, reject) {
		_fs2.default.readFile(filePath, function (err, data) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
}

function replaceContent(regex, replacement, paths) {
	(0, _replace2.default)(_extends({
		regex: regex,
		replacement: replacement,
		paths: paths
	}, replaceOptions));

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var path = _step.value;

			console.log(path + ' ' + _colors2.default.green('MODIFIED'));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
}

function moveJavaFiles(javaFiles, currentJavaPath, newBundlePath) {
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = javaFiles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var file = _step2.value;

			(0, _mv2.default)(currentJavaPath + '/' + file, newBundlePath + '/' + file, { mkdirp: true }, function (err) {
				if (err) return console.log('Error in moving java files.', err);
				console.log(newBundlePath + ' ' + _colors2.default.green('BUNDLE INDENTIFIER CHANGED'));
			});
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2.return) {
				_iterator2.return();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}
}

readFile('./app.json').then(function (data) {
	var newData = JSON.parse(data);
	var currentAppName = newData.name;
	var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
	var lC_Ns_CurrentAppName = nS_CurrentAppName.toLowerCase();

	_commander2.default.version('2.1.5').arguments('<newName>').option('-b, --bundleID [value]', 'Set custom bundle identifier eg. "com.junedomingo.travelapp"').option('-d, --displayName [value]', 'Set custom display name').action(function (newName) {
		var nS_NewName = newName.replace(/\s/g, '');
		var pattern = /^([0-9]|[a-z])+([0-9a-z\s]+)$/i;
		var lC_Ns_NewAppName = nS_NewName.toLowerCase();
		var bundleID = _commander2.default.bundleID ? _commander2.default.bundleID.toLowerCase() : null;
		var displayName = _commander2.default.displayName || '';
		var newBundlePath = void 0;

		if (bundleID) {
			newBundlePath = bundleID.replace(/\./g, '/');
			var id = bundleID.split('.');
			if (id.length < 2) return console.log('Invalid Bundle Identifier. Add something like "com.travelapp" or "com.junedomingo.travelapp"');
		}

		if (!pattern.test(newName)) {
			return console.log('"' + newName + '" is not a valid name for a project. Please use a valid identifier name (alphanumeric and space).');
		}

		if (newName === currentAppName || newName === nS_CurrentAppName || newName === lC_Ns_CurrentAppName) {
			return console.log('Please try a different name.');
		}

		// Clean builds on both platform
		_shelljs2.default.rm('-rf', ['./ios/build/*', './android/.gradle/*', './android/app/build/*', './android/build/*']);

		(0, _foldersAndFiles.foldersAndFiles)(currentAppName, newName).forEach(function (element, index) {
			var dest = element.replace(new RegExp(nS_CurrentAppName, 'gi'), nS_NewName);
			(0, _pathExists2.default)(element).then(function (exists) {
				setTimeout(function () {
					if (exists) {
						(0, _mv2.default)(element, dest, function (err) {
							if (err) return console.log('Error in renaming folder.', err);
							console.log(dest + ' ' + _colors2.default.green('RENAMED'));
						});
					} else {
						// Rename children files and folders
						(0, _mv2.default)(element, dest, function (err) {
							if (err) return;
							console.log(dest + ' ' + _colors2.default.green('RENAMED'));
						});
					}
				}, 600 * index);
			});
		});

		setTimeout(function () {
			(0, _filesToModifyContent.filesToModifyContent)(currentAppName, newName, displayName, projectName).map(function (file) {
				file.paths.map(function (path, index) {
					var newPaths = [];
					(0, _pathExists2.default)(path).then(function (exists) {
						if (exists) {
							newPaths.push(path);
							setTimeout(function () {
								replaceContent(file.regex, file.replacement, newPaths);
							}, 500 * index);
						}
					});
				});
			});
		}, 8000);

		setTimeout(function () {
			readFile('./android/app/src/main/AndroidManifest.xml').then(function (data) {
				var $ = _cheerio2.default.load(data);
				var currentBundleID = $('manifest').attr('package');
				var newBundleID = _commander2.default.bundleID ? bundleID : 'com.' + lC_Ns_NewAppName;
				var javaFileBase = './android/app/src/main/java';
				var newJavaPath = javaFileBase + '/' + newBundleID.replace(/\./g, '/');
				var currentJavaPath = javaFileBase + '/' + currentBundleID.replace(/\./g, '/');

				var javaFiles = ['MainActivity.java', 'MainApplication.java'];

				if (bundleID) {
					newBundlePath = newJavaPath;
					moveJavaFiles(javaFiles, currentJavaPath, newBundlePath);
				} else {
					newBundlePath = newBundleID.replace(/\./g, '/').toLowerCase();
					newBundlePath = javaFileBase + '/' + newBundlePath;
					moveJavaFiles(javaFiles, currentJavaPath, newBundlePath);
				}

				setTimeout(function () {
					(0, _bundleIdentifiers.bundleIdentifiers)(currentAppName, newName, projectName, currentBundleID, newBundleID, newBundlePath).map(function (file) {
						file.paths.map(function (path, index) {
							var newPaths = [];
							(0, _pathExists2.default)(path).then(function (exists) {
								if (exists) {
									newPaths.push(path);
									setTimeout(function () {
										replaceContent(file.regex, file.replacement, newPaths);
									}, 500 * index);
								}
							});
						});
					});
				}, 2000);
			});
		}, 10000);
	}).parse(process.argv);
	if (!process.argv.slice(2).length) _commander2.default.outputHelp();
}).catch(function (err) {
	if (err.code === 'ENOENT') return console.log('Directory should be created using "react-native init"');
	return console.log('Something went wrong: ', err);
});