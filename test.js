/// <reference path="reactive.ts"/>
document.addEventListener("DOMContentLoaded", function () {
    var w = new Re.Processors();
    var cellInput = w.wrap(function () {
        return document.getElementById("inp").value;
    });
    document.getElementById("inp").addEventListener('input', function (e) {
        w.rerequest(cellInput);
    });
    var cellProcessor = w.wrap(function () {
        return "[" + cellInput() + "]";
    });
    w.wrap(function () {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });
    w.go();
});
//# sourceMappingURL=test.js.map