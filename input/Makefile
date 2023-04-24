CFLAGS = -I/usr/include/libevdev-1.0
LDFLAGS = `pkg-config --static --libs libevdev`

TITLE = tpinput
SRC = src/tpinput.c src/device.c src/json_api.c
OBJ = ${SRC:.c=.o}

${TITLE}: setup ${OBJ}
	cc -o $@ ${OBJ} ${LDFLAGS}

%.h: %.c
	makeheaders $<

%.o: %.c
	cc -c ${CFLAGS} $< -o $@

setup: ${SRC:.c=.h}

clean:
	-rm -f ${OBJ} ${SRC:.c=.h} ${TITLE}

test: ${TITLE}
	./$< ../node_server/dumpipe

.PHONY: setup clean test
