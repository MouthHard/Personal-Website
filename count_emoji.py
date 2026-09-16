import re
from collections import Counter
path = r'D:/Program Files/项目/PersonalWebsite/public/static-data/museum/exhibition-halls.json'
data = open(path, 'r', encoding='utf-8').read()
ms = re.findall(r'"icon"\\s*:\\s*"(["]+)"', data)
c = Counter(ms)
with open(r'D:/Program Files/项目/PersonalWebsite/emoji_stats.txt', 'w', encoding='utf-8') as f:
    for k, v in c.most_common():
        f.write(f'{v:4d}  {k}
')
print('total:', len(ms), 'unique:', len(c))