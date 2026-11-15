// Constants
const cjkCharacterRegExp = /\p{Script=Han}/u;
const latinCharacterRegExp = /[\da-z]/i;

// Functions

/**
 * Joins UI text parts, adding a space where a CJK character meets a Latin letter or digit at a joint (e.g. `新增` and
 * `IP 存取規則` become `新增 IP 存取規則`).
 */
export function joinCjkText(...parts: string[]) {
    return parts.reduce(
        (text, part) => {
            const last = text.at(-1);
            const first = part[0];
            if (!last || !first) return text + part;
            const needsSpace = (cjkCharacterRegExp.test(last) && latinCharacterRegExp.test(first))
              || (latinCharacterRegExp.test(last) && cjkCharacterRegExp.test(first));

            return needsSpace ? `${text} ${part}` : text + part;
        },
        '',
    );
}
