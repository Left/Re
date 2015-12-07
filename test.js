/// <reference path="reactive.ts"/>
document.addEventListener("DOMContentLoaded", function () {
    var world = new Re.Processors();
    var cellInput = world.wrap(function () {
        return document.getElementById("inp").value;
    });
    document.getElementById("inp").addEventListener('input', function (e) {
        world.rerequest(cellInput);
    });
    var cellProcessor = world.wrap(function () {
        return "[" + cellInput() + "]";
    });
    world.wrap(function () {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });
    world.go();
});
//# sourceMappingURL=test.js.map