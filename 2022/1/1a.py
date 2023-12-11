
with open('./1/1.in', 'r') as f:
    dat = f.read()

nums = [int(i) for i in dat.split("\n")]

res = 0
for n, i in enumerate(nums[1:]):
    if n > nums[i]:
        res += 1

print(res)
