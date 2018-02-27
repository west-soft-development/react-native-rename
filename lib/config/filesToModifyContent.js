'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.filesToModifyContent = filesToModifyContent;
// nS - No Space
// lC - Lowercase

function filesToModifyContent(currentAppName, newName, displayName, projectName) {
	var nS_CurrentAppName = currentAppName.replace(/\s/g, '');
	var nS_NewName = newName.replace(/\s/g, '');
	var lC_Ns_CurrentAppName = nS_CurrentAppName.toLowerCase();
	var lC_Ns_NewName = nS_NewName.toLowerCase();
	var nS_DisplayName = displayName.replace(/\s/g, '');

	var nameUsedForDisplay = nS_DisplayName || nS_NewName;

	return [{
		regex: '<string name="app_name">' + currentAppName + '</string>',
		replacement: '<string name="app_name">' + nameUsedForDisplay + '</string>',
		paths: ['./android/app/src/main/res/values/strings.xml']
	}, {
		regex: nS_CurrentAppName,
		replacement: nS_NewName,
		paths: ['./index.android.js', './index.ios.js', './ios/' + nS_NewName + '.xcodeproj/project.pbxproj', './ios/' + nS_NewName + '.xcworkspace/contents.xcworkspacedata', './ios/' + nS_NewName + '.xcodeproj/xcshareddata/xcschemes/' + nS_NewName + '-tvOS.xcscheme', './ios/' + nS_NewName + '.xcodeproj/xcshareddata/xcschemes/' + nS_NewName + '.xcscheme', './ios/' + nS_NewName + '/AppDelegate.m', './android/settings.gradle', './ios/' + nS_NewName + 'Tests/' + nS_NewName + 'Tests.m', './ios/build/info.plist', './ios/Podfile', './app.json']
	}, {
		regex: 'text="' + currentAppName + '"',
		replacement: 'text="' + newName + '"',
		paths: ['./ios/' + nS_NewName + '/Base.lproj/LaunchScreen.xib']
	}, {
		regex: currentAppName,
		replacement: nameUsedForDisplay,
		paths: ['./ios/' + nS_NewName + '/Info.plist']
	}, {
		regex: '"name": "' + nS_CurrentAppName + '"',
		replacement: '"name": "' + nS_NewName + '"',
		paths: ['./package.json']
	}, {
		regex: '"displayName": "' + currentAppName + '"',
		replacement: '"displayName": "' + newName + '"',
		paths: ['./app.json']
	}];
}