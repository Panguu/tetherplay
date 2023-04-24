#include <string.h>
#include <stdio.h>
#include "api.h"
#include "json_api.h"

typedef struct {
	int recipient_id;
	char *value;
} json_instruction;

static json_instruction json_decode(char *input) {
	int index;
	char value[100];
	if (sscanf(input, "{\"i\":%d,\"v\":%s}", &index, value)) {	
	}
	return (json_instruction) {index, value}; //TODO handle error if scanf fails
}

static int int4_to_abs(int int4) {
	return int4 * 73; //TODO make more generic version
}

typedef api_value (*decoder) (char*);

static void *decode_inst(char *s) {
	return NULL;
}

static bool decode_bool(char *bool_str){
	return (!strcmp(bool_str, "true}"));
}

static vec decode_vec(char *vec_str){
	int x, y;
	if (sscanf(vec_str, "[%d,%d]}", &x, &y))
		return (vec){ int4_to_abs(x), int4_to_abs(y) };
	return (vec){0,0};
}

static const decoder decoders[] = {
	(decoder)decode_vec,
	(decoder)decode_bool,
	(decoder)decode_bool,
	(decoder)decode_inst
};

api_instruction decode (char *input) {
	json_instruction ji = json_decode(input);
	api_instruction out;
	memset (&out, 0, sizeof(out));
	out.recipient_id = ji.recipient_id;
	out.value = decoders[ji.recipient_id]( ji.value );
	return out;
}
