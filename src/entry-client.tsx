// SPDX-License-Identifier: Apache-2.0

import { mount, StartClient } from '@solidjs/start/client';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mount(() => <StartClient />, document.getElementById('app')!);
