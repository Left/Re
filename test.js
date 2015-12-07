/// <reference path="reactive.ts"/>
document.addEventListener("DOMContentLoaded", function () {
    var w = new Re.Processors();
    function dataFromInput(id) {
        var ret = w.wrap(function () {
            return document.getElementById(id).value;
        });
        document.getElementById(id).addEventListener('input', function (e) {
            ret();
        });
        return ret;
    }
    var cellInput = dataFromInput("inp");
    var cellInput2 = dataFromInput("inp2");
    ;
    var timer = w.wrap(function () {
        return new Date().getTime();
    });
    setInterval(timer, 25);
    var cellProcessor = w.wrap(function () {
        return "[" + cellInput() + " " + cellInput2() + " " + timer() + "]";
    });
    w.wrap(function () {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });
    w.go();
});
//# sourceMappingURL=test.js.map