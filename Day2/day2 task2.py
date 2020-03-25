def permute(a, start, end):
    if start == end:
        print(a, end='\t')
        return
    else:
        for i in range(start, end+1):
            a[start], a[i] = a[i], a[start]
            permute(a, start+1, end)
            a[start], a[i] = a[i], a[start]


global A
A = []
List = input("enter list: ").split()
print(len(List))
permute(List, 0, len(List)-1)
