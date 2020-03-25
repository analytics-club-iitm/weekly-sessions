def fib(val):    #For getting the fibonacci values of diff no
    if val==1:
        return 1
    if val==2:
        return 1
    z = fib(val-1)+fib(val-2)
    return z

def fibtri(val):    #For geeting the values of a particular row of the triangle
    x={}
    a=(int)((val)*(val-1)/2+1)
    x[val]=(str)(fib(a))
    if val==1:
        return "1"
    for y in range(a+1,a+val):
        x[val]+= ' ' + (str)(fib(y))
    return x[val]

def mainfunc(value):        #for printing each row one by one
    for x in range(1,value+1):
        print(fibtri(x))            

n=input("Input number: ")
mainfunc(int(n))