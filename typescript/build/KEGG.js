/// <reference path="../../build/linq.d.ts"/>
/**
 * The kegg brite index file parser
 *
 * https://www.kegg.jp/kegg/brite.html
*/
var KEGGBrite;
(function (KEGGBrite) {
    /**
     * 将目标brite json文件或者对象解析为对象entry枚举
    */
    function parse(briteText) {
        var tree = typeof briteText == "string" ? JSON.parse(briteText) : briteText;
        var list = new List();
        for (var i = 0; i < tree.children.length; i++) {
            list.AddRange(treeTravel(tree.children[i]));
        }
        return list;
    }
    KEGGBrite.parse = parse;
    /**
     * 进行递归构建
    */
    function treeTravel(Class, class_path, list) {
        if (class_path === void 0) { class_path = []; }
        if (list === void 0) { list = []; }
        if (isLeaf(Class)) {
            list.push({
                entry: parseIDEntry(Class.name),
                class_path: class_path.slice()
            });
        }
        else {
            class_path = class_path.slice();
            // there is a child count number in class name
            // removes this count number tags
            //
            // example as: Prokaryotes (5639)
            class_path.push(Class.name.replace(/\s+[(]\d+[)]/ig, ""));
            Class.children.forEach(function (node) { return treeTravel(node, class_path, list); });
        }
        return list;
    }
    function parseIDEntry(text) {
        var list = text.split(/\s{2,}/g);
        var id = list[0];
        var names = $ts(list)
            .Skip(1)
            .Select(function (s) { return s.split(/;\s*/g); })
            .Unlist(function (x) { return x; })
            .ToArray();
        return { id: id, names: names };
    }
    function isLeaf(node) {
        return $ts.isNullOrEmpty(node.children);
    }
})(KEGGBrite || (KEGGBrite = {}));
//# sourceMappingURL=KEGG.js.map