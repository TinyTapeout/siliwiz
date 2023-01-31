// SPDX-License-Identifier: Apache-2.0

export function Footer() {
  const commit = __COMMIT_HASH__;
  return (
    <footer>
      <small>
        SiliWiz revision <a href={`https://github.com/wokwi/siliwiz/commit/${commit}`}>{commit}</a>,
        built at {__BUILD_TIME__}.
      </small>
    </footer>
  );
}
