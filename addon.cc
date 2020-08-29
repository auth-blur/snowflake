#include <ctime>
#include <napi.h>

const uint64_t EPOCH = 1596963600000;

using namespace std;

Napi::Value SnowflakeNextGen(const Napi::CallbackInfo &args)
{
	Napi::Env env = args.Env();
	if (args.Length() != 3)
	{
		Napi::TypeError::New(env, "Wrong Arguments ex: nodeID:number,workerID:number,Count:number")
			.ThrowAsJavaScriptException();
		return env.Null();
	}

	const int offsets[] = {17, 12, 0};
	int64_t snowflake = 0;
	for (int i = 0; i < 3; i++)
	{
		if (!args[i].IsNumber())
		{
			Napi::TypeError::New(env, "Wrong Arguments ex: nodeID:number,workerID:number,Count:number")
				.ThrowAsJavaScriptException();
			return env.Null();
		}
		int64_t arg = args[i].As<Napi::Number>().Int64Value();
		snowflake |= (arg << offsets[i]);
	}
	time_t now = time(0);
	uint64_t BwUnixMs = (*((uint64_t *)&now))*1000;
	uint64_t BwRes = ((BwUnixMs - EPOCH) << 22)|snowflake;
	return Napi::Number::New(env,BwRes);
}
Napi::Value SnowflakeSerialization(const Napi::CallbackInfo &args)
{
	Napi::Env env = args.Env();
	if (!args[0].IsNumber())
	{
		Napi::TypeError::New(env, "Type of Argument must Number")
			.ThrowAsJavaScriptException();
		return env.Null();
	}
	uint64_t id = args[0].As<Napi::Number>().Int64Value();
	Napi::Object res = Napi::Object::New(env);
	res.Set("id", Napi::Number::New(env, id));
	res.Set("timestamp", Napi::Number::New(env, ((id >> 22)+EPOCH)));
	res.Set("nodeID", Napi::Number::New(env, ((id >> 17) & 31)));
	res.Set("workerID", Napi::Number::New(env, ((id >> 12) & 31)));
	res.Set("count", Napi::Number::New(env, (id & 4095)));
	return res;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
	exports.Set("EPOCH", Napi::Number::New(env, EPOCH));
	exports.Set("next", Napi::Function::New(env, SnowflakeNextGen));
	exports.Set("serialization", Napi::Function::New(env, SnowflakeSerialization));
	return exports;
}

NODE_API_MODULE(MODULE, Init);