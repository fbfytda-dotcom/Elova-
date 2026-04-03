import os

def fix_broken_strings(content):
    lines = content.split('\n')
    changed = True
    while changed:
        changed = False
        result = []
        i = 0
        while i < len(lines):
            line = lines[i]
            dq = line.count('"') - line.count('\\"')
            if dq % 2 == 1 and i + 1 < len(lines):
                lines[i + 1] = line + ' ' + lines[i + 1].lstrip()
                changed = True
                i += 1
                continue
            result.append(line)
            i += 1
        lines = result
    return '\n'.join(lines)

files_to_fix = [
    'src/components/DesktopSidebar.tsx',
    'src/components/FriendsSidebar.tsx',
    'src/components/ui/sonner.tsx',
    'src/components/ui/toast.tsx',
    'src/components/ui/tooltip.tsx',
    'src/pages/CommunityPage.tsx',
    'src/pages/GamesPage.tsx',
    'src/pages/VoiceRoomPage.tsx',
]

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        fixed = fix_broken_strings(content)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f'✓ Fixed {filepath}')
    else:
        print(f'✗ Not found: {filepath}')

print('\nDone!')
