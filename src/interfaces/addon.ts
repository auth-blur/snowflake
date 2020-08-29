export interface IAddon {
    EPOCH: number
    next: (nodeID: number, workerID: number, count: number)=>TID
    serialization: (id:number)=>IAddonSnowflake
}

export type TID = number

export interface IAddonSnowflake {
    id: number
    timestamp: number
    nodeID: number
    workerID: number
    count: number
}