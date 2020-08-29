import { SnowflakeService } from ".";
import { Type, UserFlag } from "./interfaces/snowflake";

describe("Snowflake Factory Test", () => {
    let snowflake: SnowflakeService;

    beforeEach(() => {
        snowflake = new SnowflakeService();
        snowflake.setType(Type.USER);
        snowflake.setFlags([UserFlag.ACTIVE_USER]);
    });
    describe("Snowflake generation (default)", () => {
        let id;
        let time;
        it("generation", done => {
            time = Date.now();
            id = snowflake.next();
            expect(typeof id).toBe("number");
            done();
        });
        it("serialization", done => {
            const sid = snowflake.serialization(id);
            expect(Math.floor(sid.timestamp / 10000)).toEqual(
                Math.floor(time / 10000),
            );
            expect(sid.type).toEqual("USER");
            expect(sid.flags[0]).toEqual("ACTIVE_USER");
            expect(sid.count).toEqual(1);
            done();
        });
    });
    describe("Snowflake generation (with Flags)", () => {
        let id;
        let time;
        it("generation", done => {
            time = Date.now();
            id = snowflake.next([UserFlag.SYSTEM]);
            expect(typeof id).toBe("number");
            done();
        });
        it("serialization", done => {
            const sid = snowflake.serialization(id);
            expect(Math.floor(sid.timestamp / 10000)).toEqual(
                Math.floor(time / 10000),
            );
            expect(sid.type).toEqual("USER");
            expect(sid.flags[0]).toEqual("SYSTEM");
            expect(sid.count).toEqual(1);
            done();
        });
    });
});
