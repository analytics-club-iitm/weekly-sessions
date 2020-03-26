## fast doubling method
def fibonacci(n):
    if n < 0:
        print("please enter positive values")
    return _fib(n)[0]


#Returns the tuple (F(n), F(n+1)).
def _fib(n):
    if n == 0:
        return (0, 1)
    else:
        a, b = _fib(n // 2)
        c = a * (b * 2 - a)
        d = a * a + b * b
        if n % 2 == 0:
            return (c, d)
        else:
            return (d, c + d)

## recursive method
def fib(n):
    a = 1
    b = 1
    if n == 1:
        return a
    for i in range(n-2):
        c = a + b
        a = b
        b = c
    return b

## benchmarking between recurisive method and fast doubling.

import time
import matplotlib.pyplot as plt
x = []
t1 = []
t2 = []
for i in range(1,1000):
    x.append(i)
    start = time.time()
    fib1 = fib(i)
    t1.append(time.time() - start)
    start = time.time()
    fib2 = fibonacci(i)
    t2.append(time.time() - start)
plt.plot(x,t1, label="recursion")
plt.plot(x,t2, label="fast-doubling")
plt.legend()
plt.show()