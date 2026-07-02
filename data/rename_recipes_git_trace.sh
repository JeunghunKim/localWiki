#!/usr/bin/env bash
#
# 레시피 md 파일 이름을 yyyymmdd_제목.md 규칙으로 renaming합니다.
# 파일의 **git 최초 추가일**을 기준으로 날짜를 결정합니다.
#
# 사용법:
#   ./rename_recipes_git_trace.sh [--dry-run]
#
# 옵션:
#   --dry-run  실제로 rename하지 않고 변경 내용만 표시

set -euo pipefail

# ─── 설정 ───

# 스크립트가 있는 디렉토리를 repo root로 사용
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR}"

cd "${REPO_ROOT}"

# repo root 기준 상대 경로
DIRECTORIES=(
    "babyfood"
    "recipe"
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
# 파일의 git 최초 추가일을 yyyymmdd 형식으로 반환
# Arguments:
#   $1 - 파일 경로 (repo root 기준 상대 경로)
# Outputs:
#   yyyymmdd 형식 날짜
# Returns:
#   0 성공, 1 실패 (커밋 이력 없음)
#######################################
function get_first_commit_date() {
    local file="$1"

    # 파일이 git 추적 대상이 아니면 실패
    if ! git ls-files --error-unmatch "${file}" >/dev/null 2>&1; then
        # 아직 git에 추가되지 않은 파일은 현재 날짜 사용
        date '+%Y%m%d'
        return 0
    fi

    # --follow: rename 이력도 추적, --diff-filter=A: 추가된 커밋만
    local first_date
    first_date="$(git log --follow --diff-filter=A --format='%ai' -- "${file}" | tail -n 1)"

    if [[ -z "${first_date}" ]]; then
        echo "[WARN] git 이력이 없는 파일: ${file}, 현재 날짜 사용" >&2
        date '+%Y%m%d'
        return 0
    fi

    # "2026-06-30 23:26:42 +0900" → "20260630"
    echo "${first_date}" | head -c 10 | tr -d '-'
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
# 변경 사항을 출력
# Arguments:
#   $1 - 모드 (DRY-RUN / RENAMED)
#   $2 - 원본 파일명
#   $3 - 새 파일명
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
fi

total=0
renamed=0
skipped=0
errors=0

for dir in "${DIRECTORIES[@]}"; do
    # 절대 경로로 변환
    local_dir="${REPO_ROOT}/${dir}"

    if [[ ! -d "${local_dir}" ]]; then
        echo "[ERROR] 디렉토리가 존재하지 않습니다: ${local_dir}" >&2
        ((errors++)) || true
        continue
    fi

    echo ""
    echo "=== ${dir} ==="

    for filepath in "${local_dir}"/*.md; do
        [[ -f "${filepath}" ]] || continue
        ((total++)) || true

        filename="$(basename "${filepath}")"
        rel_path="${filepath#${REPO_ROOT}/}"

        # git에서 파일이 이미 다른 이름으로 추적 중이면 현재 이름으로 rename 안됨
        # 현재 파일명으로 git 이력 조회 (--follow로 rename 이력 포함)
        git_date="$(get_first_commit_date "${rel_path}")"

        new_basename="$(strip_date_prefix "${filename}")"
        target_filename="${git_date}_${new_basename}"
        target_path="${local_dir}/${target_filename}"

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
