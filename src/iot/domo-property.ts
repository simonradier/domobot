export class DomoProperty<T> {
    public value : T;
    public type : string;
    public history : Array<T> = new Array<T>();

    public constructor(value : T) {
        this.value = value;
        this.type = typeof value; 
    }

    public update (value : T) {
        this.history.push(value);
        this.value = value;
    }

}