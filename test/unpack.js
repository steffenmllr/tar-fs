var test = require('tap').test;
var rimraf = require('rimraf');
var tar = require('../index');
var path = require('path');
var fs = require('fs');
var os = require('os');
var zlib = require('zlib');

test('unpack test chmod', function(t) {
    t.plan(3);

    var unpackPath = './tmp';
    rimraf.sync(unpackPath);

    var tarFile = fs.createReadStream('./fixtures/test.tar.gz').pipe(zlib.createGunzip());
    var extract = tar.extract(unpackPath);


    extract.on('finish', function () {
        t.ok(fs.statSync(path.join(unpackPath, 'file1')).mode.toString(8) == 100444, '444 file permission');
        t.ok(fs.statSync(path.join(unpackPath, 'file2')).mode.toString(8) == 100666, '666 file permission');
        t.ok(fs.statSync(path.join(unpackPath, 'file3')).mode.toString(8) == 100644, '644 file permission');
    });

    tarFile.pipe(extract);
});
