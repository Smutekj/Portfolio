import json
import os
import sys

# os.makedirs("Levels")

with open('Levels.json', 'r') as f:
    levelsData = json.load(f)
    
for level in levelsData["levels"]:
    levelId = level["id"]
    with open("Levels/" + levelId + ".json", 'w') as f:
        json.dump(level, f)