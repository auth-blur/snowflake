import { SnowFlakeFactory } from "../src"
import { Type, UserFlag } from "../src/interfaces/snowflake"

describe("Snowflake",()=>{
    let snowflake = new SnowFlakeFactory([UserFlag.ACTIVE_USER],Type.USER)
    describe("default snowflake generation",()=>{
        let id
        let time
        it("generation",(done)=>{
            time = Date.now()
            id = snowflake.next()
            expect(typeof id).toBe("number")
            done()
        })
        it("serialization",(done)=>{
            const sid = snowflake.serialization(id)
            expect(Math.floor(sid.timestamp/10000)).toEqual(Math.floor(time/10000))
            expect(sid.type).toEqual("USER")
            expect(sid.flags[0]).toEqual("ACTIVE_USER")
            expect(sid.count).toEqual(1)
            done()
        })
    })
    describe("Snowflake generation with Flags",()=>{
        let id
        let time
        it("generation",(done)=>{
            time = Date.now()
            id = snowflake.next([UserFlag.SYSTEM])
            expect(typeof id).toBe("number")
            done()
        })
        it("serialization",(done)=>{
            const sid = snowflake.serialization(id)
            expect(Math.floor(sid.timestamp/10000)).toEqual(Math.floor(time/10000))
            expect(sid.type).toEqual("USER")
            expect(sid.flags[0]).toEqual("SYSTEM")
            expect(sid.count).toEqual(2)
            done()
        })
    })
})