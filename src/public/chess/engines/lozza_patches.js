/**
 * Created by Jason on 3/17/2016.
 */
importScripts('./lozza.js');

var shadowing = false;
var logging = false;
var count = 0;
/*
ShadowNodes represent positions at shallower depths than the search tree goes.
 */
function ShadowNode(san, uci) {
    this.name = san;
    this.uci = uci;
    this.childNodes = {};
    count++;
}

var rootShadowNode, currentShadowNode, shadowNodeStack, searchDepth, visibleDepth;

// Start monkey patching...
var tabs = '';

var realMakeMove = lozBoard.prototype.makeMove;

lozBoard.prototype.makeMove = function(node, move) {

    if (logging && shadowing) {
        console.log(tabs + "make " + this.formatMove(move, UCI_FMT) + ' ' + this.formatMove(move, SAN_FMT));
    }

    if (shadowing) {
        var san = this.formatMove(move, SAN_FMT), uci = this.formatMove(move, UCI_FMT);
        if (currentShadowNode.childNodes.hasOwnProperty(san)) {
            shadowNodeStack.push(currentShadowNode);
            currentShadowNode = currentShadowNode.childNodes[san];
        } else {
            var c = new ShadowNode(san, uci);
            currentShadowNode.childNodes[c.name] = c;
            shadowNodeStack.push(currentShadowNode);
            currentShadowNode = c;
        }
    }

    realMakeMove.bind(this)(node, move);
};

var realUnmakeMove = lozBoard.prototype.unmakeMove;

lozBoard.prototype.unmakeMove = function(node, move) {

    if (logging && shadowing) {
        console.log(tabs + "take " + this.formatMove(move, UCI_FMT) + ' ' + this.formatMove(move, SAN_FMT));
    }
    realUnmakeMove.bind(this)(node, move);

    if (shadowing) {
        currentShadowNode = shadowNodeStack.pop();
    }
};

var realAlphaBeta = lozChess.prototype.alphabeta;

lozChess.prototype.alphabeta = function(node, depth, turn, alpha, beta, nullOK, inCheck) {
    tabs += '  ';
    if (logging && shadowing) {
        console.log(tabs + "alphabeta(object...," + depth + ", " + turn + ", " + alpha + ", " + beta + ", " + nullOK + ", " + inCheck + ")");
    }
    tabs += '  ';
/*
    if (depth < searchDepth - visibleDepth) {
        // do minimax until we get close to leaves
        alpha = -INFINITY;
        beta = INFINITY;
    }
*/
    var sc = realAlphaBeta.bind(this)(node, depth, turn, -INFINITY, INFINITY, nullOK, inCheck);

    tabs = tabs.substring(0, tabs.length - 2);

    if (logging && shadowing) {
        console.log(tabs + sc);
    }
    tabs = tabs.substring(0, tabs.length - 2);

    if (shadowing) {
        currentShadowNode.score = sc;
    }
    return sc;
};

/*

 */


 var realSearch = lozChess.prototype.search;

lozChess.prototype.search = function(node, depth, turn, alpha, beta) {
    var rv = realSearch.bind(this)(node, depth, turn, alpha, beta);
    console.log("search(...,"+depth+", "+turn+", "+alpha+", "+beta+") returned "+rv);
    return rv;
};

function tree(_searchDepth, _visibleDepth, fen) {

    searchDepth = _searchDepth;
    visibleDepth = _visibleDepth;
    rootShadowNode = currentShadowNode = new ShadowNode('START', '');
    shadowNodeStack = [];

    lozza.position();
    var board = lozza.board;
    var spec = lozza.uci.spec;
    spec.depth = searchDepth;

    var alpha = -INFINITY;
    var beta = INFINITY;
    var asp = ASP_MAX;

    var score = 0;

    for (var ply = searchDepth; ply <= searchDepth; ply++) {
        console.log('-----------------------------------------------------');
        console.log("search: "+ply);
        console.log('-----------------------------------------------------');

        shadowing = true;

        var lozzaBoundSearch = realSearch.bind(lozza);
        score = lozzaBoundSearch(lozza.rootNode, ply, board.turn, alpha, beta);

        shadowing = false;

        if (score <= alpha || score >= beta) {
            alpha = -INFINITY;
            beta = INFINITY;
            asp = ASP_MAX * 10;

            continue;

        }

        if (Math.abs(score) >= MINMATE && Math.abs(score) <= MATE) {
            break;
        }

        alpha = score - asp;
        beta = score + asp;

        asp -= ASP_DELTA; //  shrink the window.
        if (asp < ASP_MIN)
            asp = ASP_MIN;
    }


    var prune = function(shadowNode, depth) {
        if (depth === 0) {
            shadowNode.childNodes = undefined;
        } else {
            if (shadowNode.childNodes) {
                var arr = Object.keys(shadowNode.childNodes);
                arr.forEach(function(key) {
                    prune(shadowNode.childNodes[key], depth - 1);
                });
            }
        }
    };

    if (searchDepth > visibleDepth) {
        prune(rootShadowNode, visibleDepth);
    }

    var arrayify = function(shadowNode, direction) {
        if (shadowNode.score !== undefined) {
            shadowNode.name += '('+shadowNode.score+")";
        }
        if (shadowNode.childNodes) {
            var ownPropertyNames = Object.getOwnPropertyNames(shadowNode.childNodes);
            shadowNode.children = ownPropertyNames.map(function(name){return shadowNode.childNodes[name];});
            shadowNode.children.forEach(function(ch) {
                arrayify(ch, -direction);
            });
            //shadowNode.children.forEach(arrayify);
            delete shadowNode.childNodes;
            shadowNode.children = shadowNode.children.sort(function(a1, a2) {
                if (a1.score !== undefined && a2.score === undefined) {
                    return 1;
                }
                if (a1.score === undefined && a2.score !== undefined) {
                    return -1;
                }
                if (a1.score === a2.score) {
                    return 0;
                }
                return a1.score > a2.score ? direction : -direction;
                //return a2.score > a1.score;
            });
        }
    };

    arrayify(rootShadowNode, 1);

    return "tree " + JSON.stringify(rootShadowNode, 1);
}

var realOnMessage = onmessage;

onmessage = function(e) {

    //console.log("Got this: "+e.data);

    var probeCmd = e.data.match(/tree\s+(\d+)\s+(\d+)(\s+.*)?/);
    if (probeCmd !== null) {
        if (probeCmd[3] !== undefined) {
            realOnMessage({data: 'position fen ' + probeCmd[3]});
        } else {
            realOnMessage({data: 'position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'});
        }
        //realOnMessage({data: ''});
        var m = tree(parseInt(probeCmd[1]), parseInt(probeCmd[2]));
        postMessage(m);
    } else {
        realOnMessage(e);
    }

};
