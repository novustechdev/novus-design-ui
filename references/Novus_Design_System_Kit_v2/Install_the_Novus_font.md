# Install the Novus font (Carlito)

Carlito is the Novus typeface — free, open-source, and metric-identical to Calibri. Installing it
makes Word, PowerPoint, Microsoft 365 Copilot, the brand guide, and any Novus document render the
**real** Novus type. Without it, your machine silently swaps in a different font (macOS ships
neither Carlito nor Calibri), so branded files look wrong on your screen.

The font files are in **`fonts/ttf/`**: `Carlito-Regular.ttf` and `Carlito-Bold.ttf`.

## Windows
1. Open the `fonts/ttf/` folder.
2. Select both `Carlito-Regular.ttf` and `Carlito-Bold.ttf`.
3. Right-click → **Install** (or **Install for all users**).
4. Restart Word / PowerPoint if they were open.

## macOS
1. Open the `fonts/ttf/` folder.
2. Double-click `Carlito-Regular.ttf` → **Install Font**. Repeat for `Carlito-Bold.ttf`.
   (Or select both and open with **Font Book**.)
3. Restart Word / PowerPoint if they were open.

## Check it worked
Open Word or PowerPoint and look for **Carlito** in the font list. If it's there, you're set.

> Web/HTML files (`brand.html`, the standalone guide, and self-contained decks) already carry
> Carlito inside them, so they render correctly even before you install the font. Installing it
> still helps for **editing** Office documents and for previewing your own HTML before it's embedded.
