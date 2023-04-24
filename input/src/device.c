#include <libevdev-1.0/libevdev/libevdev.h>
#include <libevdev-1.0/libevdev/libevdev-uinput.h> //TODO fix these paths for final release
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#include "errutil.h"
#include "device.h"

static struct libevdev_uinput *uidev;

static int enable_event(struct libevdev *dev, int type, int code, void *data) {
	RETURN_IF_TRUE(libevdev_has_event_code(dev, type, code), EEXIST);
	RETURN_IF_ERROR(libevdev_enable_event_code(dev, type, code, data), EKEYREJECTED);
	return 0;
}
static int enable_key_event(struct libevdev *dev, int code){
	return enable_event(dev, EV_KEY, code, NULL);
}

static int enable_abs_event(struct libevdev *dev, int code){
	struct input_absinfo *abs = malloc(sizeof(struct input_absinfo));

	errno = -enable_event(dev, EV_ABS, code, &abs);
	if (errno) {
		free(abs);
		return -errno;
	}

	libevdev_set_abs_minimum(dev, code, -0b111111111);
	libevdev_set_abs_maximum(dev, code, 0b111111111);
	libevdev_set_abs_flat(dev, code, 0);
	libevdev_set_abs_fuzz(dev, code, 0);
	libevdev_set_abs_resolution(dev, code, 0);
	return 0;
}

static int enable_event_fails(
		int (*function) (struct libevdev *dev, int type),
		struct libevdev *dev,
		int event_code,
		char *event_code_name) {

	errno = -function(dev, event_code);
	if (errno == 0)
		return 0;
	fprinte(0, "failed to enable %s",  event_code_name);
	if (errno == EEXIST)
		return 0;
	return 1;
}

#define enable_event_fails(function, code) enable_event_fails(function, dev, code, #code)
static int hardcode_device(struct libevdev *dev) {
	int errors =
		enable_event_fails(enable_key_event, BTN_SOUTH) +
		enable_event_fails(enable_key_event, BTN_WEST) +
		enable_event_fails(enable_key_event, BTN_START) +
		enable_event_fails(enable_abs_event, ABS_X) +
		enable_event_fails(enable_abs_event, ABS_Y);
	return -errors;
}
#undef enable_event_fails

static void write_event(int type, int code, int value){
	errno = -libevdev_uinput_write_event(uidev, type, code, value);
	if (errno)
		printe(0, "failed to write event");
}

static void write_key_event(int code, int value){
	write_event(EV_KEY, code, value);
}

static void write_abs_event(int code, int value){
	write_event(EV_ABS, code, value);
}
static void sync_events(){
	write_event(EV_SYN, SYN_REPORT, 0);
}

int create_device(char *name){
	struct libevdev *dev = libevdev_new();

	int errors = hardcode_device(dev);
	if (errors < 0)
		fprinte(1, "Critical: %d events failed to initialize", -errors);

	libevdev_set_name(dev, name);

	RETURN_IF_ERRNO(libevdev_uinput_create_from_device(
				dev,
				LIBEVDEV_UINPUT_OPEN_MANAGED,
				&uidev
	));
	return 0;
}

void press( int code){
	write_key_event(code, 1);
	sync_events();
}

void release( int code){
	write_key_event(code, 0);
	sync_events();
}

void click( int code){
	press(code);
	usleep(20000);
	release(code);
}

void set_abs( int code, int pos){
	write_abs_event(code, pos);
	sync_events();
}

void cleanup(){
	libevdev_uinput_destroy(uidev);
}
