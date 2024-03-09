import json

with open("operators.txt", "r") as f:
    data = f.readlines()

data = [d.replace("\n", "") for d in data]
print(data)
with open("operators.json", "w") as f:
    f.write(json.dumps(data))
