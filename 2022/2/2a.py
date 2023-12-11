with open('./2/2.in', 'r') as f:
    dat = f.read().split('\n')

d = 0
p = 0

for i in dat:
    move, dist = i.split(' ')
    if move == "forward":
        p += int(dist)
    if move == "down":
        d += int(dist)
    if move == "up":
        d -= int(dist)

print(d * p)