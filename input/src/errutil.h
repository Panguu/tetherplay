#include <stdio.h>
#include <stdlib.h>
#include <error.h>
#include <errno.h>

#define RED(s) "\e[91m" s "\e[39m"

#define fprinte(status, msg, ...) error(status, errno, RED(msg), __VA_ARGS__)
#define printe(status, msg) error(status, errno, RED(msg))

#define RETURN_IF_TRUE(expr, error_num) if(expr) {errno = error_num; return -error_num;}

#define RETURN_IF_FALSE(expr, error_num) RETURN_IF_TRUE(!(expr), error_num)

#define RETURN_IF_ERROR(expr, error_num) RETURN_IF_TRUE((expr) < 0, error_num)

//stupid hack to assign variable in macros without breaking everything
#define SUBSCOPE(assignment, expression) for(assignment;;) {expression; break;}

#define RETURN_IF_ERRNO(expr) SUBSCOPE(int result = -abs(expr), RETURN_IF_ERROR(result, result))
