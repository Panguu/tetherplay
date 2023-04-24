#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <linux/input.h>

#include "device.h"
#include "api.h"
#include "json_api.h"
#include "tpinput.h"

int read_input(char *buf, int size) {
	if (fgets(buf, size, stdin))
		return 0;
	return 1;
}

void handle_vec(vec v, int x_abs, int y_abs){
	set_abs(x_abs, v.x);
	set_abs(y_abs, v.y);
}

void handle_bool(bool b, int button){
	if (b)
		press(button);
	else
		release(button);
}

typedef void (*instruction_handler) (api_value);

void handle_gp_ljoy(api_value val) {
	handle_vec(val.v, ABS_X, ABS_Y);
}
void handle_gp_south(api_value val) {
	handle_bool(val.b, BTN_SOUTH);
}
void handle_gp_west(api_value val) {
	handle_bool(val.b, BTN_WEST);
}
void handle_gp_start(api_value val) {
	click(BTN_START);
}

static const instruction_handler handlers[] = {
	handle_gp_ljoy,
	handle_gp_west,
	handle_gp_south,
	handle_gp_start
};

int main() {
	create_device("tp-input-js0");
	int size = BUFSIZ;
	char line[size];
	for (;;) {
		if (read_input(line, size))
			break;
		api_instruction ins = decode(line);
		handlers[ins.recipient_id](ins.value);
	}
	cleanup();
	return 0;
}
