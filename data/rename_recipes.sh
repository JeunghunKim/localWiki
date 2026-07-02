#!/usr/bin/env bash
#
# 레시피 md 파일 이름을yyyymmdd_제목.md 규칙으로 renaming합니다.
# 파일의 수정일(mtime)을 기준으로 날짜를 결정합니다.
#
# 사용법:
#   ./rename_recipes.sh [--dry-run]
#
# 옵션:
#   --dry-run  실제로 rename하지 않고 변경 내용만 표시

set -euo pipefail

# ─── 설정 ───

DIRECTORIES=(
    "hijh/baby_food_recipes"
    "hijh/recipes"
)

DATE_PREFIX_REGEX='^[0-9]{8}_'
DRY_RUN=false

# ─── 인자 파싱 ───

for arg in "$@"; do
    case "${arg}" in
        --dry-run)
            DRY_RUN=true
            ;;
        *)
            echo "Unknown option: ${arg}" >&2
            exit 1
            ;;
    esac
done

# ─── 함수 ───

#######################################
# 파일 수정일(mtime)을 yyyymmdd 형식으로 반환
# Arguments:
#   $1 - 파일 경로
#######################################
function get_mtime() {
    local file="$1"
    stat -c '%Y' "${file}" | xargs -I{} date -d @{} '+%Y%m%d'
}

#######################################
# 기존 파일명에서 yyyymmdd_ 접두사 제거
# Arguments:
#   $1 - 파일명 (확장자 포함)
# Outputs:
#   접두사 제거된 파일명
#######################################
function strip_date_prefix() {
    local filename="$1"
    echo "${filename}" | sed 's/^[0-9]\{8\}_//'
}

#######################################
# 파일명을 출력
# Arguments:
#   $1 - 메시지
#   $2 - 파일명
#######################################
function log_rename() {
    local action="$1"
    local from="$2"
    local to="$3"
    echo "[${action}] ${from} → ${to}"
}

# ─── 메인 ───

if [[ "${DRY_RUN}" == true ]]; then
    echo "=== DRY-RUN 모드 (실제로 rename하지 않음) ==="
    echo ""
fi

total=0
renamed=0
skipped=0
errors=0

for dir in "${DIRECTORIES[@]}"; do
    if [[ ! -d "${dir}" ]]; then
        echo "[ERROR] 디렉토리가 존재하지 않습니다: ${dir}" >&2
        ((errors++)) || true
        continue
    fi

    echo ""
    echo "=== ${dir} ==="

    for filepath in "${dir}"/*.md; do
        [[ -f "${filepath}" ]] || continue
        ((total++)) || true

        filename="$(basename "${filepath}")"
        new_basename="$(strip_date_prefix "${filename}")"
        mtime="$(get_mtime "${filepath}")"
        target_filename="${mtime}_${new_basename}"
        target_path="${dir}/${target_filename}"

        # 이미 규칙에 맞거나 같은 이름이면 skip
        if [[ "${filename}" == "${target_filename}" ]]; then
            ((skipped++)) || true
            continue
        fi

        # 중복 파일명 확인
        if [[ -f "${target_path}" ]]; then
            echo "[WARNING] 중복 파일명 충돌: ${filename} → ${target_filename} (이미 존재)" >&2
            ((errors++)) || true
            continue
        fi

        if [[ "${DRY_RUN}" == true ]]; then
            log_rename "DRY-RUN" "${filename}" "${target_filename}"
        else
            mv "${filepath}" "${target_path}"
            log_rename "RENAMED" "${filename}" "${target_filename}"
            ((renamed++)) || true
        fi
    done
done

# ─── 요약 ───

echo ""
echo "=== 요약 ==="
echo "  전체 파일: ${total}"
echo "  rename: ${renamed}"
echo "  skip (이미 규칙에 맞춤): ${skipped}"
echo "  error: ${errors}"

if [[ "${errors}" -gt 0 ]]; then
    exit 1
fi
