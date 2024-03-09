import requests
import sys
import json

url = ""

payload = {
    "id": 1,
    "jsonrpc": "2.0",
    "params": [sys.argv[1]],
    "method": "eth_getTransactionReceipt",
}
headers = {"accept": "application/json", "content-type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
_json = response.json()
if "result" not in _json.keys():
    print(_json)
logs = [
    l
    for l in _json["result"]["logs"]
    if l["topics"][0]
    == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
]  # nft transfer topic

info = {}
tokens = []
for l in logs:
    tokens.append(int(l["topics"][3], 16))
with open("tokens.json", "w") as f:
    f.write(json.dumps(tokens))
print(tokens)
