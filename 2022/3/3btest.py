dat = '''00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010'''.split("\n")

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


mostCommon = []
leastCommon = []

for i, n in enumerate(num0s):
    if n > num1s[i]:
        mostCommon += [0]
        leastCommon += [1]
    else:
        mostCommon += [1]
        leastCommon += [0]

print(mostCommon)

datCopy = [i for i in dat]
for i in range(len(num0s)):
    print(datCopy)
    if len(datCopy) == 1:
        break
    datCopy = [j for j in datCopy if j[i] == mostCommon[i]]

oxy = ''.join([str(i) for i in datCopy[0]])

datCopy = [i for i in dat]
for i in range(len(num0s)):
    if len(datCopy) == 1:
        break
    datCopy = [j for j in datCopy if j[i] == leastCommon[i]]

co2 = ''.join([str(i) for i in datCopy[0]])

print(oxy)
print(co2)

print(int(oxy, 2) * int(co2, 2))