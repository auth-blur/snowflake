import { Flag, Type } from "./interfaces/snowflake";
import { Inject } from "@nestjs/common";

export const snowflakes: { flags: Flag[]; type: Type }[] = [];

export function Snowflake(
    type: Type,
    flags: Flag[],
): (target: any, key: string | symbol, index?: number) => void {
    if (!snowflakes.some(s => Object.is(s, { type, flags })))
        snowflakes.push({ type, flags });
    return Inject(
        `Snowflake.${type.toString()}.${flags
            .reduce((a, b) => a | b)
            .toString()}`,
    );
}
