class DataFrame {
    constructor(data) {
        Object.keys(data).forEach((e) => (this[e] = data[e]));
        this._indicator = Array(this[Object.keys(this)[0]].length).fill(1);
    }
}
class Mapping extends Map {
    constructor(...mappings) {
        super([...mappings]);
        if (!this.has("y"))
            this.set("y", "_indicator");
    }
}
const baseMembershipArray = [1, 2, 3, 4];
const transientMembershipArray = [129, 130, 131, 132];
const validMembershipArray = [
    ...baseMembershipArray,
    ...transientMembershipArray,
    128,
];
const [, ...highlightMembershipArray] = validMembershipArray;
const plotTypeArray = [
    "scatter",
    "bubble",
    "bar",
    "histo",
    "square",
    "squareheat",
];
export { DataFrame, Mapping, baseMembershipArray, validMembershipArray, highlightMembershipArray, plotTypeArray, };
