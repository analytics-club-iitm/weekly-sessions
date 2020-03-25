from itertools import permutations
A = input("Enter the list: ").split()
l = list(permutations(A))
print(l)