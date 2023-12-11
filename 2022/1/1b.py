
with open('./1/1.in', 'r') as f:
    dat = f.read()

nums = [int(i) for i in dat.split("\n")]

res = 0
prevSum = 10000000000000000000
for i, _ in enumerate(nums[:-2]):
    newSum = sum(nums[i:i+3])
    if newSum > prevSum:
        res += 1
    prevSum = newSum

print(res)
