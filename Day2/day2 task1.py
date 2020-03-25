n = int(input('enter the number of lines of fibonacci triangle: '))
a = 0
b = 1
print(1, '\n')
for i in range(2, n+1):
    for j in range(i):
        m = a + b
        print(m, end='\t')
        a = b
        b = m
    print('\n')

