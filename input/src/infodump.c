#include <libevdev-1.0/libevdev/libevdev.h>
#include <libevdev-1.0/libevdev/libevdev-uinput.h> //TODO fix these paths for final release
#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

void infodump(const char *devpath) {
	struct libevdev *dev = NULL;
	int fd;
	int rc = 1;
	 
	fd = open(devpath, O_RDONLY|O_NONBLOCK);
	rc = libevdev_new_from_fd(fd, &dev);
	if (rc < 0) {
			  fprintf(stderr, "Failed to init libevdev (%s)\n", strerror(-rc));
			  exit(1);
	}
	printf("Input device name: \"%s\"\n", libevdev_get_name(dev));
	printf("Input device ID: bus %#x\n vendor %#x\n product %#x\n uid %s\n",
			 libevdev_get_id_bustype(dev),
			 libevdev_get_id_vendor(dev),
			 libevdev_get_id_product(dev),
			 libevdev_get_uniq(dev)
	);
}

int main() {
	infodump("/dev/input/event2");
	infodump("/dev/input/event5");
	return 0;
}
