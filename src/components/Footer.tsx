// SPDX-License-Identifier: Apache-2.0

import { repo } from '~/config/consts';

export function Footer() {
  const commit = __COMMIT_HASH__;
  return (
    <footer>
      <small>
        SiliWiz revision{' '}
        <a href={`${repo}/commit/${commit}`} target="_blank">
          {commit}
        </a>
        , built at {__BUILD_TIME__}.
      </small>
    </footer>
  );
}
