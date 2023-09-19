// SPDX-License-Identifier: Apache-2.0

import { lambdaToMicrons } from '~/model/layout';

export default function Scale(props: { y: number }) {
  return (
    <g style={{ 'user-select': 'none' }}>
      <rect x={0} y={props.y - 10} fill="black" stroke="black" width="50" height="10" />
      <rect x={50} y={props.y - 10} fill="none" stroke="black" width="50" height="10" />
      <text x={0} y={props.y - 12} font-size="10">
        0µm
      </text>
      <text x={50} y={props.y - 12} text-anchor="middle" font-size="10">
        {`${50 * lambdaToMicrons}µm`}
      </text>
      <text x={100} y={props.y - 12} text-anchor="middle" font-size="10">
        {`${100 * lambdaToMicrons}µm`}
      </text>
    </g>
  );
}
