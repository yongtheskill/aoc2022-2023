with open('./2/2.in', 'r') as f:
    dat = f.read().split('\n')

depth = 0
pos = 0
aim = 0

for i in dat:
    move, dist = i.split(' ')
    if move == "forward":
        pos += int(dist)
        depth += aim * int(dist)
    if move == "down":
        aim += int(dist)
    if move == "up":
        aim -= int(dist)

print(depth * pos)