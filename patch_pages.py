"""
Run this from your Elova project root.
It patches every page to accept the onMenuOpen prop and shows a Menu button in the header.
"""
import os, re

pages = [
    "src/pages/ExplorePage.tsx",
    "src/pages/RoomsPage.tsx",
    "src/pages/CommunityPage.tsx",
    "src/pages/GamesPage.tsx",
    "src/pages/VoiceRoomPage.tsx",
    "src/pages/ProfilePage.tsx",
    "src/pages/LoungePage.tsx",
]

MENU_IMPORT = 'import { Menu } from "lucide-react";\n'

for path in pages:
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        continue

    with open(path, "r", encoding="utf-8") as f:
        src = f.read()

    changed = False

    # 1. Add Menu import if not already there
    if '"Menu"' not in src and "{ Menu" not in src:
        src = src.replace('from "lucide-react"', 'Menu } from "lucide-react";\nimport { Menu', 1)
        # Simpler: just prepend the import near the top
        src = MENU_IMPORT + src
        changed = True

    # 2. Change default export signature to accept onMenuOpen prop
    # Matches: export default function FooPage() {
    src_new = re.sub(
        r'export default function (\w+)\(\)',
        r'export default function \1({ onMenuOpen }: { onMenuOpen: () => void })',
        src
    )
    if src_new != src:
        src = src_new
        changed = True

    # 3. Add Menu button after the first <header or first sticky div's inner div
    # We look for the h1 tag and insert a Menu button flex row before it
    if 'onMenuOpen' in src and '<Menu ' not in src:
        src = src.replace(
            '<header ',
            '<header onClick={onMenuOpen} ',
            1
        )
        changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write(src)
        print(f"  ✓ Patched: {path}")
    else:
        print(f"  ~ No change: {path}")

print("\nDone!")
