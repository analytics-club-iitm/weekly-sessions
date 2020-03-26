'''
Write a program to print a fibonacci triangle.
- Given a number n (i.e) number of lines the program must output a Fibonacci triangle.
'''
'''
s   p   c
1   0   1 over here becuz previous is zero the program is doing an extra cycle (kind of, pay attention to this)
0   1   1 becuz of the extra cycle we can print 1 twice
1   1   2
1   2   3
2   3   5
'''

n = int(input("how many rows do you want: "))
def fibonacci(start=1,n=5):
    previous = 0
    for i in range(n):
        print()
        for j in range(i+1):
            current = start + previous
            print(current,end=' ')
            start = previous
            previous=current

fibonacci(1,n)


