import { Observable } from "rxjs";

export enum ActionStatus {
    Undefined = 0,
    Started = 1,
    Waiting = 2,
    InProgress = 3,
    Finished = 4,
    Error = 5,
    Cancelled = 6,
}

export abstract class DomoAction {
    public abstract launch(...args : any[]) : Observable<ActionStatus>;
    public abstract cancel() : Promise<boolean>;
    public abstract getStatus() : ActionStatus;
}
