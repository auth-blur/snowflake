import {IAddon, TID, IAddonSnowflake} from "./interfaces/addon"
import {Flag,Type,ISnowflake} from "./interfaces/snowflake"

const addon: IAddon = require("bindings")("snowflake")

const Types = {
    USER: 1 << 0,
    AVATAR: 1 << 1,
    CLIENT: 1 << 2,
};

const Flags = {
    USER: {
        ACTIVE_USER: 1 << 0,
        DEVELOPER: 1 << 1,
        SYSTEM: 1 << 2,
    },
    AVATAR: {
        PRO_USER: 1 << 0,
        CLIENT: 1 << 1,
    },
    CLIENT: {
        NORMAL: 1 << 0,
        VERIFIED: 1 << 1,
        SYSTEM: 1 << 3,
    },
};

export class SnowFlakeFactory {
    private count = 0;
    private flag: Flag;
    private type: number;
    private typeName: string;

    constructor(iflags: Array<Flag>, itype: Type) {
        this.flag = iflags.reduce((acc, cur) => acc | cur);
        const [name, type] = Object.entries(Types).find(
            ([, val]) => val == itype,
        );
        this.typeName = name
        this.type = type;
    }
    next(iflags?: Array<Flag>): TID {
        this.count += 1;
        const BwType = this.type,
            BwWorker = (iflags
                ? iflags.reduce((acc, cur) => acc | cur)
                : this.flag
            ),
            BwCount = (this.count & 0xfff);
        return addon.next(BwType,BwWorker,BwCount);
    }
    serialization(id: number, type?: string):ISnowflake  {
        const sid = addon.serialization(id)
        const flags = Object.entries(Flags[type||this.typeName])
            .filter((f:[string,number]) => f[1] === (sid.workerID & f[1]))
            .map(f => f[0]);
        return {
            id,
            timestamp: sid.timestamp,
            type: type||this.typeName,
            flags,
            count: sid.count,
        };
    }
    
}

const snowflake = new SnowFlakeFactory([Flags.USER.ACTIVE_USER],Type.USER)

console.log(snowflake.next())
console.log(snowflake.serialization(snowflake.next()))