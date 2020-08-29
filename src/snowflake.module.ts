import {  Module, Provider } from "@nestjs/common";
import { SnowflakeService } from "./snowflake.service"
import { Flag, Type, UserFlag } from "./interfaces/snowflake";
import { snowflakes } from "./snowflake.decorator";

function SnowflakeFactory(snowflakeService: SnowflakeService,flags?:Flag[],type?:Type) {
    if(flags) 
        snowflakeService.setFlags(flags)
    else snowflakeService.setFlags([UserFlag.ACTIVE_USER])
    if(type)
        snowflakeService.setType(type)
    else snowflakeService.setType(Type.USER)
    return snowflakeService
}

function createSnowflakeProviders(): Array<Provider<SnowflakeService>> {
    function createSnowflakeProvider(flags:Flag[],type:Type):Provider<SnowflakeService> {
        return {
            provide: `Snowflake.${type}.${flags.reduce((a,b)=>a|b)}`,
            useFactory: (snowflakeService: SnowflakeService) => SnowflakeFactory(snowflakeService,flags,type),
            inject: [SnowflakeService] 
        }
    }
    return snowflakes.map(({type,flags})=>createSnowflakeProvider(flags,type))
}

@Module({
    providers: [SnowflakeService,...createSnowflakeProviders()],
    exports: [SnowflakeService,...createSnowflakeProviders()]
})
export class SnowflakeModule {}