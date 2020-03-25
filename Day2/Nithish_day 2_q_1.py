n=input('enter number of lines')
first=0
second=1
for i in range(int(n)):
    t=i+1
    a=1
    while(a<=t):
        print(second,end=" ")
        next=first+second
        first=second
        second=next
        a+=1
    print('\n')
    