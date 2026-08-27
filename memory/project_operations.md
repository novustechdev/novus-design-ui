# Operations and environment quirks

**Why**: these are the commands and traps that cost time this session; reusing
them avoids rediscovery.

**How to apply**:

- Build + gates: `node site/build.mjs && scripts/gates.sh` (gates are release
  blocking; the site build also runs a link gate and refuses subdirectory
  content index.html files, which break under clean-URL servers).
- Publish: bump version + CHANGELOG, then
  `NODE_AUTH_TOKEN=$(gh auth token) npm publish` (gh token needs
  `write:packages`; refresh with `gh auth refresh -h github.com -s
  read:packages,write:packages`, run by the user via `!` since it is a device
  flow).
- Deploy docs: push normally, but this repo drops push-event triggers
  sometimes; fallback `gh workflow run pages.yml --repo
  novustechdev/novus-design-ui --ref 001-novus-design-kit`, then
  `gh run watch <id>` (select the run by matching headSha, not `--limit 1`).
- Browser verification: puppeteer-core driving snap Chromium
  (`executablePath: /snap/bin/chromium`, `userDataDir:
  ~/snap/chromium/common/pptr-profile`). Snap AppArmor blocks writes outside
  $HOME; write screenshots into `~/snap/chromium/common/...`, then copy to the
  session scratchpad. Headless CLI flags alone can't emulate
  prefers-color-scheme; use puppeteer's `emulateMediaFeatures`.
- .NET SDK 10.0.400 installed at `~/.dotnet` (add to PATH). Blazor samples:
  kill stale `dotnet run` servers by port (`fuser -k <port>/tcp`), not by name.
- Shell trap: `pkill -f "<pattern>"` kills the CURRENT bash if the pattern
  appears in the command line itself (the recurring exit-144). Use a bracket
  trick (`pkill -f "port 580[8]"`) or `fuser -k`.
- Guide verification pattern: throwaway sample projects in the session
  scratchpad, install the kit from a packed tarball or the registry, build,
  then runtime-check via DOM dump + screenshot (build success alone misses
  runtime throws, e.g. MUI error #9 on var() palette colours).
