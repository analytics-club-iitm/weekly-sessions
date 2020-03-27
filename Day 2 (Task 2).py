'''
Task 2
Write a program to find all possible permutations of a given list.
Given a list [1,2,3]
'''

num = [1,2,3]
end = len(num)-1

def permutate(num,start,end):
    if(start==end):
        print(num)
    else:
        x=start
        while(x<=end):
            temp = num[x]
            num[x]=num[start]
            num[start]=temp
            permutate(num,start+1,end)
            temp = num[x]
            num[x]=num[start]
            num[start]=temp
            x+=1

permutate(num,0,end)