import os
import re
import sys
import glob
import json

regex = 'msgid "([^"]+)"\nmsgstr "([^"]+)"'

for name in glob.glob('translations/*.po'):
    with open(name) as f:
        text = f.read()

    d = {}
    for match in re.finditer(regex, text):
        d[match.group(1)] = match.group(2)

    with open(os.path.join(sys.argv[1],
                           name.replace('.po', '.json')), 'w') as f:
        json.dump(d, f)
