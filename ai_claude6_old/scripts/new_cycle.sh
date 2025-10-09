#!/usr/bin/env zsh
set -euo pipefail

base_dir="flows"

if [[ $# -eq 0 ]]; then
  ts=$(date +"%Y%m%d_%H%M%S")
else
  ts="$1"
fi

cycle_dir="$base_dir/$ts"

if [[ -d "$cycle_dir" ]]; then
  echo "[warn] $cycle_dir は既に存在します" >&2
  exit 1
fi

mkdir -p "$cycle_dir/assets"

steps=(
  "1_screenshot"
  "2_scoring"
  "3_tasks"
  "4_execution"
)

for step in "${steps[@]}"; do
  target="$cycle_dir/${step}.md"
  case "$step" in
    "1_screenshot")
      cat <<TEMPLATE > "$target"
# ${ts} ${step}
- 所感:
- 指示: スマホ幅375pxのビューでフルページスクリーンショットを取得し、assets/step1_full.png に保存する。
- 結果:
- 添付:
TEMPLATE
      ;;
    *)
      cat <<TEMPLATE > "$target"
# ${ts} ${step}
- 所感:
- 指示:
- 結果:
TEMPLATE
      ;;
  esac
done

echo "created $cycle_dir (assets/ ready)"
