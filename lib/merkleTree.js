var util = require('./util.js');

exports.getRoot = function (rpcData, coinbaseHash) {
    if (rpcData.defaultroots && rpcData.defaultroots.merkleroot)
        return util.reverseHex(rpcData.defaultroots.merkleroot);
    // Zebra GBT hashes are display-order transaction IDs, not authorization digests.
    var leaves = [coinbaseHash].concat(rpcData.transactions.map(function (tx) {
        return tx.txid !== undefined ? tx.txid : tx.hash;
    })).map(function (hash) {
        return Buffer.from(hash, 'hex').reverse();
    });
    while (leaves.length > 1) {
        var parents = [];
        for (var i = 0; i < leaves.length; i += 2)
            parents.push(util.sha256d(Buffer.concat([leaves[i], leaves[i + 1] || leaves[i]])));
        leaves = parents;
    }
    return leaves[0].toString('hex');
};
