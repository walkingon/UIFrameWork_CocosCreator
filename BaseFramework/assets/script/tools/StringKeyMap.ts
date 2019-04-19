import { Map } from "./Map";

export class StringKeyMap<Val> extends Map<string, Val> {
    private _table:{[key: string]: Val;} = {};

    protected getTable() {
        return this._table;
    }
}
