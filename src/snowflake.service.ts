import { Injectable } from "@nestjs/common";
import { IAddon, TID } from "./interfaces/addon";
import { Flag, Type, ISnowflake } from "./interfaces/snowflake";
import bindings from "bindings";

const Types = {
    USER: 1 << 0,
    AVATAR: 1 << 1,
    APP: 1 << 2,
};

const Flags = {
    USER: {
        ACTIVE_USER: 1 << 0,
        DEVELOPER: 1 << 1,
        SYSTEM: 1 << 2,
    },
    AVATAR: {
        PRO_USER: 1 << 0,
        APP: 1 << 1,
    },
    APP: {
        NORMAL: 1 << 0,
        VERIFIED: 1 << 1,
        SYSTEM: 1 << 3,
    },
};

@Injectable()
export class SnowflakeService {
    private count = 0;
    private flag: Flag;
    private type: number;
    private typeName: string;
    private ready: boolean;
    private addon: IAddon = bindings("snowflake");

    setFlags(iflags: Flag[]): void {
        this.flag = iflags.reduce((acc, cur) => acc | cur);
        if (this.flag && this.type && this.typeName) this.ready = true;
    }

    setType(itype: Type): void {
        const [name, type] = Object.entries(Types).find(
            ([, val]) => val == itype,
        );
        this.typeName = name;
        this.type = type;
        if (this.flag && this.type && this.typeName) this.ready = true;
    }

    next(iflags?: Array<Flag>): TID {
        if (!this.ready) throw new Error("Factory not ready");
        this.count += 1;
        const BwType = this.type,
            BwWorker = iflags
                ? iflags.reduce((acc, cur) => acc | cur)
                : this.flag,
            BwCount = this.count & 0xfff;
        return this.addon.next(BwType, BwWorker, BwCount);
    }
    serialization(id: number, type?: string): ISnowflake {
        if (!this.ready) throw new Error("Factory not ready");
        const sid = this.addon.serialization(id);
        const flags = Object.entries(Flags[type || this.typeName])
            .filter((f: [string, number]) => f[1] === (sid.workerID & f[1]))
            .map(f => f[0]);
        return {
            id,
            timestamp: sid.timestamp,
            type: type || this.typeName,
            flags,
            count: sid.count,
        };
    }
}
