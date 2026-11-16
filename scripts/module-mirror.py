"""Repackage two public, pinned Go source mirrors using Go module ZIP rules.

Go itself still verifies these archives against the upstream Helpdesk go.sum.
No replacement directives, changed checksums, or disabled sum database are used.
"""
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

local = Path(sys.argv[1])
modules = [
    ('libc', 'v1.80.1', 'https://gitlab.com/cznic/libc.git', '612e8b0f2f1b1923d5c24c08bc233722500499cd'),
    ('sqlite', 'v1.62.0', 'https://github.com/modernc-org/sqlite.git', 'd04d243c4dfdb9f9fb19bd1c0c8c37d3923f0589'),
]
for name, version, repository, commit in modules:
    source = local / 'module-sources' / name
    if not source.exists():
        source.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['git', 'clone', '--depth', '1', '--branch', version, repository, str(source)], check=True)
    actual = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    if actual != commit:
        raise SystemExit(f'Refusing unexpected {name} mirror revision.')
    target = local / 'module-proxy' / 'modernc.org' / name / '@v'
    target.mkdir(parents=True, exist_ok=True)
    prefix = f'modernc.org/{name}@{version}/'
    with zipfile.ZipFile(target / (version + '.zip'), 'w', zipfile.ZIP_DEFLATED) as archive:
        for directory, dirs, files in os.walk(source):
            dirs[:] = [d for d in dirs if d not in {'.git', '.hg', '.svn', '.bzr', 'vendor'} and not (Path(directory) / d / 'go.mod').exists()]
            for filename in sorted(files):
                file = Path(directory) / filename
                if file.is_file() and not file.is_symlink():
                    archive.write(file, prefix + file.relative_to(source).as_posix())
    for suffix in ('.mod', '.info'):
        cache = local / 'go-path/pkg/mod/cache/download/modernc.org' / name / '@v' / (version + suffix)
        if cache.exists():
            shutil.copyfile(cache, target / (version + suffix))
        else:
            subprocess.run(['curl', '-fsSL', f'https://proxy.golang.org/modernc.org/{name}/@v/{version}{suffix}', '-o', str(target / (version + suffix))], check=True)
    print(f'Prepared pinned {name} mirror; Go checksum verification follows.', flush=True)
