with open('./3/3.in', 'r') as f:
    dat = f.read().split('\n')

dat = [[int(j) for j in list(i)] for i in dat]


rowLen = len(dat[0])

num0s = [0] * rowLen
num1s = [1] * rowLen

def addArr(a, b):
    for i, n in enumerate(a):
        b[i] += n

for row in dat:
    addArr(row, num1s)
    addArr([int(not i) for i in row], num0s)

print(num0s)
print(num1s)

gamma = ""
epsilon = ""

for i, n in enumerate(num0s):
    if n > num1s[i]:
        gamma += "0"
        epsilon += "1"
    else:
        gamma += "1"
        epsilon += "0"

print(int(gamma, 2) * int(epsilon, 2))
