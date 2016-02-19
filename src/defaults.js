import _ from 'lodash';

function negPosRange(n) {
    // returns a range array like [-5, 5], given 5
    return [-Math.abs(n), Math.abs(n)]
}
function makeYRanges(boundaries) {
    boundaries = _.isArray(boundaries) ? boundaries : [boundaries];
    return boundaries.map(boundary => ({y: negPosRange(boundary)}));
}

const vectorFuncs = [
    function(x, y, r, th, t) { return (Math.cos(r) + Math.cos(th)) * 10; },
    function(x, y, r, th, t) { return (Math.sin(r) * Math.cos(th)) * 10; },
    function(x, y, r, th, t) { return (Math.cos(r / th) + Math.cos(th)) * 10; },
    function(x, y, r, th, t) { return (Math.cos(r * th) + Math.sin(th)) * 10; },
    function(x, y, r, th, t) { return ((Math.cos(x) + Math.cos(y)) * 10); },
    function(x, y, r, th, t) { return ((Math.sin(x) * Math.cos(y)) * 10); },
    function(x, y, r, th, t) { return ((Math.sin(x) * Math.cos(y / x)) * 10); },
    function(x, y, r, th, t) { return Math.sin(y & th) * 10; },
    function(x, y, r, th, t) { return Math.cos(x * y) * 10; },
    function(x, y, r, th, t) { return x },
    function(x, y, r, th, t) { return y },
    function(x, y, r, th, t) { return r },
    function(x, y, r, th, t) { return th },
    function(x, y, r, th, t) { return r / th },

    function(x, y, r, th, t) { return ((Math.cos(mouseX) + Math.cos(y)) * 10); },
    function(x, y, r, th, t) { return ((Math.sin(x) * Math.cos(mouseY)) * 10); },
    function(x, y, r, th, t) { return ((Math.sin(mouseX) * Math.cos(mouseY / x)) * 10); },
    function(x, y, r, th, t) { return mouseX - x },
    function(x, y, r, th, t) { return mouseY - y },
    function(x, y, r, th, t) { return mouseX - mouseY },
    function(x, y, r, th, t) { return r / mouseX },

];

const colorFuncs = [
    function(x, y, r, th, t) {
        return window.d3.lab(80 - (r * 13), y * 20 * Math.random(), x * 20 * Math.random()).toString();
    },
    function(x, y, r, th, t) {
        return window.d3.hsl(x * t * 3, Math.abs(y * 20), Math.abs(Math.sin(y))).toString();
    },
    function(x, y, r, th, t) {
        return window.d3.lab(r * 13, y * 2 * Math.random(), x * 20 * Math.random()).toString();
    }
];

const birthplaceFuncs = {
    uniformXY: function(xDomain, yDomain) {
const x = window._.random(xDomain[0], xDomain[1], true);
const y = window._.random(yDomain[0], yDomain[1], true);
return {x, y};
    },
    uniformGrid: function(xDomain, yDomain, gridPrecision = 1) {
const x = +window._.random(xDomain[0], xDomain[1], true).toFixed(gridPrecision);
const y = +window._.random(yDomain[0], yDomain[1], true).toFixed(gridPrecision);
return {x, y};
    },
    normalXY: function(xDomain, yDomain) {
const means = [xDomain, yDomain].map(_.mean);
const devs = [xDomain, yDomain].map(d => Math.abs(d[1] - d[0]) / 4);
return {
    x: window.d3.random.normal(means[0], devs[0])(),
    y: window.d3.random.normal(means[1], devs[1])()
        }
    }
};

export default {
    default: {

    },
    // list of possible initial starting states
    // any settings which can be chosen randomly have a "choices" property which is an array of possible choices
    presets: [
        {
            isPolar: {choices: [true, false]},
            particleCount: 1000,
            fadeAmount: 0,
            lineWidth: 1,
            domain: {choices: makeYRanges([3, 5, 7, 9])},
            // first velocity function, X (cartesian) or R (polar)
            vA: vectorFuncs[0],
            // second velocity function, Y (cartesian) or Theta (polar)
            vB: vectorFuncs[1],
            // shuffle desired Y domains, X will be auto-created from aspect ratio
            color: colorFuncs[0],
            //birthplace: birthplaceFuncs.uniformXY
        },
        {
            isPolar: true,
            particleCount: 1000,
            fadeAmount: 0,
            lineWidth: 1,
            domain: {y: negPosRange(8)},
            vA: function(x, y, r, th, t) {
                return y & t;
            },
            vB: function(x, y, r, th, t) {
                return (Math.cos(r * th) + Math.sin(th)) * 10;
            },
            color: colorFuncs[0],
            //birthplace: birthplaceFuncs.uniformXY
        },
        {
            isPolar: true,
            particleCount: 3000,
            fadeAmount: 0,
            lineWidth: 0.3,
            domain: {y: negPosRange(5)},
            vA: function(x, y, r, th, t) {
                return (Math.cos(r * th) + Math.sin(th)) * 10;;
            },
            vB: function(x, y, r, th, t) {
                return (Math.cos(x) + Math.cos(y)) * 10;
            },
            color: colorFuncs[0],
            //birthplace: birthplaceFuncs.uniformXY
        },
        {
            isPolar: false,
            particleCount: 3000,
            fadeAmount: 0,
            lineWidth: 0.1,
            domain: {y: negPosRange(7)},
            // first velocity function, X (cartesian) or R (polar)
            vA: function(x, y, r, th, t) {
                return (Math.cos(r) + Math.floor(th)) * 10;
            },
            vB: function(x, y, r, th, t) {
                return Math.round(y) * Math.cos(th) + Math.sin(x) * 10;
            },
            color: colorFuncs[2],
            //birthplace: birthplaceFuncs.uniformXY
        }
    ],
    stateChoices: {
        isPolar: {choices: [true, false]},
        vA: {choices: vectorFuncs},
        vB: {choices: vectorFuncs},
        domain: {choices: makeYRanges([2, 3, 4, 5, 6, 8, 10])},
        color: {choices: colorFuncs},
        particleCount: {choices: [300, 500, 1000, 1500, 2000, 3000]},
        fadeAmount: {choices: [0, 0, 0, 2, 8]},
        lineWidth: {choices: [0.1, 0.3, 0.5, 0.8, 1, 2, 3]},
        //birthplace: {choices: _.values(birthplaceFuncs)}
    }
};

// http://localhost:8228/?s=eyJpc1BvbGFyIjp0cnVlLCJ2QSI6ImZ1bmN0aW9uIGFub255bW91cyh4LHkscix0aGV0YSx0LGZyLHZ4LHZ5XG4vKiovXG4vKiovXG4vKiovXG4vKiovXG4vKiovKSB7XG5yZXR1cm4geSAmIHRcbn0iLCJ2QiI6ImZ1bmN0aW9uIGFub255bW91cyh4LHkscix0aGV0YSx0LGZyLHZ4LHZ5XG4vKiovXG4vKiovXG4vKiovXG4vKiovXG4vKiovXG4vKiovXG4vKiovKSB7XG5yZXR1cm4gKE1hdGguY29zKHIgKiB0aGV0YSkgKyBNYXRoLnNpbih0aGV0YSkpICogMTA7XG59IiwiZG9tYWluIjp7IngiOlstOSw5XSwieSI6Wy01LDVdfSwiY29sb3IiOiJmdW5jdGlvbiBhbm9ueW1vdXMoeCx5LHIsdGhldGEsdCxmclxuLyoqL1xuLyoqLykge1xucmV0dXJuIHdpbmRvdy5kMy5oc2woTWF0aC5hYnMoeCo0KSArIDE5MCwgTWF0aC5hYnMoMS9NYXRoLmNvcyh5KSksIF8uY2xhbXAoTWF0aC5hYnMoTWF0aC5zaW4oTWF0aC5wb3cociwgMikpKSwgMC4xLCAwLjgpKS50b1N0cmluZygpXG59IiwicGFydGljbGVDb3VudCI6MTAwMCwiZmFkZUFtb3VudCI6MCwibGluZVdpZHRoIjoxLCJzY3JlZW5JZCI6MTQ1NTc4MDI4MzA4OSwiZnVuY1N0cnMiOlsidkEiLCJ2QiIsImNvbG9yIl19

// http://localhost:8228/?s=eyJpc1BvbGFyIjp0cnVlLCJ2QSI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIE1hdGguc2luKHIpICogTWF0aC5jb3ModGhldGEpICogMTA7XG5cdH0iLCJ2QiI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIChNYXRoLmNvcyh4KSArIE1hdGguY29zKHkpKSAqIDEwO1xuXHR9IiwiZG9tYWluIjp7InkiOlstNCw0XSwieCI6Wy02LDZdfSwiY29sb3IiOiJmdW5jdGlvbiBhbm9ueW1vdXMoeCx5LHIsdGhldGEsdCxmclxuLyoqLykge1xucmV0dXJuIHdpbmRvdy5kMy5sYWIoKDEvcikgKiA1MCwgKCgxL3IpICogMTAwMCkgJSA1MCwgciAqIDIwICogTWF0aC5yYW5kb20oKSAtIDYwKS50b1N0cmluZygpO1xufSIsInBhcnRpY2xlQ291bnQiOjUwMDAsImZhZGVBbW91bnQiOjAsImxpbmVXaWR0aCI6MC4xLCJzY3JlZW5JZCI6MTQ1NTg0NzgzMjA5NiwiZnVuY1N0cnMiOlsidkEiLCJ2QiIsImNvbG9yIl19

// http://localhost:8228/?s=eyJpc1BvbGFyIjp0cnVlLCJ2QSI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIChNYXRoLmNvcyhyIC8gdGhldGEpICsgTWF0aC5jb3ModGhldGEpKSAqIDEwO1xuXHR9IiwidkIiOiJmdW5jdGlvbiAoeCwgeSwgciwgdGhldGEsIHQpIHtcblx0ICAgIHJldHVybiAoTWF0aC5jb3MociAqIHRoZXRhKSArIE1hdGguc2luKHRoZXRhKSkgKiAxMDtcblx0fSIsImRvbWFpbiI6eyJ5IjpbLTgsOF0sIngiOlstMTIuMTUsMTIuMTVdfSwiY29sb3IiOiJmdW5jdGlvbiAoeCwgeSwgciwgdGhldGEsIHQpIHtcblx0ICAgIHJldHVybiB3aW5kb3cuZDMubGFiKDgwIC0gciAqIDEzLCB5ICogMjAgKiBNYXRoLnJhbmRvbSgpLCB4ICogMjAgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygpO1xuXHR9IiwicGFydGljbGVDb3VudCI6MTAwMCwiZmFkZUFtb3VudCI6MCwibGluZVdpZHRoIjowLjUsInNjcmVlbklkIjoxNDU1ODQ3OTc2NTM3LCJmdW5jU3RycyI6WyJ2QSIsInZCIiwiY29sb3IiXX0=

// http://localhost:8228/?s=eyJpc1BvbGFyIjp0cnVlLCJ2QSI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIE1hdGguY29zKHggKiB5KSAqIDEwO1xuXHR9IiwidkIiOiJmdW5jdGlvbiAoeCwgeSwgciwgdGhldGEsIHQpIHtcblx0ICAgIHJldHVybiBNYXRoLnNpbih4KSAqIE1hdGguY29zKHkpICogMTA7XG5cdH0iLCJkb21haW4iOnsieSI6Wy0zLDNdLCJ4IjpbLTQuNTYsNC41Nl19LCJjb2xvciI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIHdpbmRvdy5kMy5sYWIoODAgLSByICogMTMsIHkgKiAyMCAqIE1hdGgucmFuZG9tKCksIHggKiAyMCAqIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKCk7XG5cdH0iLCJwYXJ0aWNsZUNvdW50IjozMDAwLCJmYWRlQW1vdW50IjowLCJsaW5lV2lkdGgiOjAuNSwic2NyZWVuSWQiOjE0NTU4NDkwNzA1NzcsImZ1bmNTdHJzIjpbInZBIiwidkIiLCJjb2xvciJdfQ==

// http://localhost:8228/?s=eyJpc1BvbGFyIjp0cnVlLCJ2QSI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIE1hdGguc2luKHkgJiB0aGV0YSkgKiAxMDtcblx0fSIsInZCIjoiZnVuY3Rpb24gKHgsIHksIHIsIHRoZXRhLCB0KSB7XG5cdCAgICByZXR1cm4gTWF0aC5jb3MoeCAqIHkpICogMTA7XG5cdH0iLCJkb21haW4iOnsieSI6Wy0zLDNdLCJ4IjpbLTIuNTgsMi41OF19LCJjb2xvciI6ImZ1bmN0aW9uICh4LCB5LCByLCB0aGV0YSwgdCkge1xuXHQgICAgcmV0dXJuIHdpbmRvdy5kMy5sYWIoODAgLSByICogMTMsIHkgKiAyMCAqIE1hdGgucmFuZG9tKCksIHggKiAyMCAqIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKCk7XG5cdH0iLCJwYXJ0aWNsZUNvdW50Ijo1MDAsImZhZGVBbW91bnQiOjAsImxpbmVXaWR0aCI6MC41LCJzY3JlZW5JZCI6MTQ1NTg2Nzk3MjE4OSwiZnVuY1N0cnMiOlsidkEiLCJ2QiIsImNvbG9yIl19


